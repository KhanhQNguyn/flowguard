export type WaterLevelMode = "SAFE" | "WARNING" | "CRITICAL";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export async function getWaterLevelMode(): Promise<WaterLevelMode> {
  try {
    if (!(SUPABASE_URL && SUPABASE_KEY))
      throw new Error("Missing Supabase env");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("[FG:Water] Supabase GET mode from sensor_config id=1");
    const { data, error } = await supabase
      .from("sensor_config")
      .select("mode")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.warn("[FG:Water] Supabase mode fetch error", error);
      return "SAFE";
    }
    if (data && data.mode) {
      console.log("[FG:Water] Supabase mode", data.mode);
      return String(data.mode).toUpperCase() as WaterLevelMode;
    }
    return "SAFE";
  } catch {
    console.warn("[FG:Water] Mode fetch failed, default SAFE");
    return "SAFE";
  }
}

export async function setWaterLevelMode(
  mode: WaterLevelMode,
): Promise<boolean> {
  try {
    if (!(SUPABASE_URL && SUPABASE_KEY))
      throw new Error("Missing Supabase env");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("[FG:Water] Supabase UPDATE mode", { mode });
    const { data, error } = await supabase
      .from("sensor_config")
      .update({ mode })
      .eq("id", 1)
      .select("mode");
    if (error) {
      console.warn("[FG:Water] Supabase update failed, trying insert", error);
      const { error: insertErr } = await supabase
        .from("sensor_config")
        .insert({ id: 1, mode });
      if (insertErr) {
        console.error("[FG:Water] Supabase insert failed", insertErr);
        return false;
      }
      console.log("[FG:Water] Supabase insert OK");
      return true;
    }
    console.log("[FG:Water] Supabase update OK", data);
    return true;
  } catch {
    console.warn("[FG:Water] POST mode failed");
    return false;
  }
}

export interface WaterLevelReading {
  id: string;
  water_level_cm: number;
  location: string;
  created_at?: string;
}

export async function getLatestWaterLevels(): Promise<WaterLevelReading[]> {
  try {
    if (!(SUPABASE_URL && SUPABASE_KEY))
      throw new Error("Missing Supabase env");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("[FG:Water] Supabase GET latest readings from system_logs");
    const { data, error } = await supabase
      .from("system_logs")
      .select("id, water_level_cm, location, created_at")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) {
      console.warn("[FG:Water] Supabase latest fetch error", error);
      return [];
    }
    console.log("[FG:Water] Supabase latest count", data?.length || 0);
    const readings = (data as unknown as WaterLevelReading[]) || [];

    // Also fetch current mode to pick index accordingly
    let mode: WaterLevelMode = "SAFE";
    try {
      const { data: modeRow, error: modeErr } = await supabase
        .from("sensor_config")
        .select("mode")
        .eq("id", 1)
        .maybeSingle();
      if (!modeErr && modeRow?.mode) {
        mode = String(modeRow.mode).toUpperCase() as WaterLevelMode;
      }
    } catch {
      // ignore, default SAFE
    }

    if (readings.length === 0) return [];

    // Ascending order: earliest first, latest last
    let selected: WaterLevelReading | undefined;
    if (mode === "SAFE") {
      selected = readings[0];
    } else if (mode === "WARNING") {
      selected = readings.length > 1 ? readings[1] : readings[0];
    } else {
      selected = readings[readings.length - 1];
    }

    return selected ? [selected] : [];
  } catch {
    console.warn("[FG:Water] Latest fetch failed, returning []");
    return [];
  }
}
