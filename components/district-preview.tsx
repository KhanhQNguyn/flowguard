"use client";

import { useState, useEffect } from "react";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { MOCK_DISTRICTS } from "@/lib/mock-districts";

interface District {
  id: string;
  name: string;
  nameVi: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  activeAlerts: number;
  sensorCount: number;
  population: number;
}

export function DistrictPreview() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Supabase env vars missing");
        }
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error: supaErr } = await supabase
          .from("districts")
          .select(
            "id,name,nameVi,riskLevel,activeAlerts,sensorCount,population",
          )
          .limit(100);

        if (supaErr) {
          // If table doesn't exist or schema not refreshed, fallback to mocks
          console.warn("[DistrictPreview] Supabase error:", supaErr.message);
          setDistricts(MOCK_DISTRICTS as unknown as District[]);
          return;
        }

        const rows = (data || []) as any[];
        if (rows.length === 0) {
          console.log(
            "[DistrictPreview] No rows in 'districts' table, using MOCK_DISTRICTS",
          );
          setDistricts(MOCK_DISTRICTS as unknown as District[]);
          return;
        }
        const mapped: District[] = rows.map((d: any) => ({
          id: String(d.id),
          name: d.name,
          nameVi: d.nameVi ?? d.name,
          riskLevel: d.riskLevel as "LOW" | "MEDIUM" | "HIGH",
          activeAlerts: Number(d.activeAlerts ?? 0),
          sensorCount: Number(d.sensorCount ?? 0),
          population: Number(d.population ?? 0),
        }));

        setDistricts(mapped);
      } catch (err) {
        console.error("[DistrictPreview] Error fetching districts:", err);
        // On any failure, fallback to mock data to keep UI working
        setDistricts(MOCK_DISTRICTS as unknown as District[]);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  if (error) {
    console.warn("[DistrictPreview] Backend error:", error);
  }

  const highRiskDistricts = districts
    .filter((d) => d.riskLevel === "HIGH" || d.riskLevel === "MEDIUM")
    .slice(0, 3);

  const getRiskBadge = (risk: "LOW" | "MEDIUM" | "HIGH") => {
    const styles = {
      LOW: "bg-[#d1fae5] text-[#065f46]",
      MEDIUM: "bg-[#fef9c3] text-[#854d0e]",
      HIGH: "bg-[#fee2e2] text-[#991b1b]",
    };
    return styles[risk];
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-900">Nearby Districts</h3>
        <button className="text-sm text-[#3b82f6] font-medium flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {highRiskDistricts.map((district) => (
          <div
            key={district.id}
            className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              {district.riskLevel === "HIGH" && (
                <AlertTriangle className="w-4 h-4 text-[#e03a35]" />
              )}
              <div>
                <p className="font-medium text-sm">{district.name}</p>
                <p className="text-xs text-neutral-500">
                  {district.activeAlerts} active alerts
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getRiskBadge(district.riskLevel)}`}
            >
              {district.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
