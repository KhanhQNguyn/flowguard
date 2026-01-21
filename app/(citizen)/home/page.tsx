"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  RefreshCw,
  Radio,
  CheckCircle,
  AlertCircle,
  Droplets,
  Users,
  Moon,
  Crown,
  X,
  ChevronRight,
} from "lucide-react";
import { RiskIndicator } from "@/components/risk-indicator";
import { ActionGuidance } from "@/components/action-guidance";
import { DistrictPreview } from "@/components/district-preview";
import { ConditionCard } from "@/components/condition-card";
import { DistrictSelectorModal } from "@/components/district-selector-modal";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useApp } from "@/lib/app-context";
import { usePremium } from "@/lib/premium-context";
import { PremiumModal } from "@/components/premium-modal";
import {
  getLatestWaterLevels,
  getWaterLevelMode,
  setWaterLevelMode,
  type WaterLevelMode,
} from "@/lib/water-level-service";

export default function HomePage() {
  const router = useRouter();
  const { currentDistrict, currentRisk, lastUpdated, refreshData, sensors } =
    useApp();
  const { isPremium } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);
  const [showDistrictSelector, setShowDistrictSelector] = useState(false);
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [mode, setMode] = useState<WaterLevelMode>("SAFE");
  const [liveWaterLevel, setLiveWaterLevel] = useState<number | null>(null);

  // Map district -> sensor location name used by backend simulator
  const districtSensorLocation = useMemo(() => {
    // Align with backend WATER_LEVEL_SENSORS / simulator default "Sensor_Tram_A"
    // Simple mapping: use A for District 7, B for District 1/3, C for District 4/Phu Nhuan
    if (currentDistrict === "District 7") return "Sensor_Tram_A";
    if (currentDistrict === "District 1" || currentDistrict === "District 3")
      return "Sensor_Tram_B";
    return "Sensor_Tram_C";
  }, [currentDistrict]);

  // Load current mode and start polling latest water level
  useEffect(() => {
    let isMounted = true;
    getWaterLevelMode().then((m) => {
      if (isMounted) setMode(m);
    });

    const fetchLevels = async () => {
      const readings = await getLatestWaterLevels();
      const forDistrict = readings.find(
        (r) => r.location === districtSensorLocation,
      );
      if (forDistrict) setLiveWaterLevel(forDistrict.water_level_cm);
      else if (readings.length > 0)
        setLiveWaterLevel(readings[0].water_level_cm);
    };
    fetchLevels();
    const iv = setInterval(fetchLevels, 4000);
    return () => {
      isMounted = false;
      clearInterval(iv);
    };
  }, [districtSensorLocation]);

  const currentSensor = sensors.find((s) => s.district === currentDistrict);

  if (!currentRisk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading flood data..." />
      </div>
    );
  }

  const getWaterLevelDisplay = (level: number) => `${level}cm`;

  const getReportsDisplay = (count: number) => {
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">
      {/* Location Header - Enhanced with District Selector */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setShowDistrictSelector(true)}
          className="w-full flex items-start justify-between gap-3 hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
        >
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#289359]" />
              <p className="font-semibold text-neutral-900 text-sm truncate">
                {currentDistrict}, HCMC
              </p>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-1" />
        </button>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-3">
        {/* Premium Banner */}
        {!isPremium && !dismissBanner && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-4 flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3 flex-1">
              <Crown className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Go Premium</p>
                <p className="text-xs opacity-90">
                  Advanced routing, priority alerts & more
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissBanner(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Risk Indicator - Hero Element */}
        {(() => {
          // Prefer deriving from actual live water level; fallback to mode
          const riskFromMode: "LOW" | "MEDIUM" | "HIGH" =
            mode === "SAFE" ? "LOW" : mode === "WARNING" ? "MEDIUM" : "HIGH";
          const riskFromLevel: "LOW" | "MEDIUM" | "HIGH" =
            liveWaterLevel == null
              ? currentRisk.risk
              : liveWaterLevel <= 0
                ? "LOW"
                : liveWaterLevel <= 40
                  ? "MEDIUM"
                  : "HIGH";
          const derivedRisk: "LOW" | "MEDIUM" | "HIGH" =
            liveWaterLevel == null ? riskFromMode : riskFromLevel;

          const reasoningLines: string[] = [
            `Mode: ${mode}`,
            `Live water level: ${liveWaterLevel ?? 0} cm`,
            `Derived risk: ${derivedRisk}`,
          ];

          return (
            <RiskIndicator
              risk={derivedRisk}
              reasoning={reasoningLines}
              district={currentDistrict}
            />
          );
        })()}

        {/* Current Conditions - compact grid */}
        <div className="grid grid-cols-4 gap-2">
          <ConditionCard
            icon={Droplets}
            label="Rain"
            value={currentSensor?.rainIntensity || "Medium"}
          />
          <ConditionCard
            icon={Droplets}
            label="Water"
            value={getWaterLevelDisplay(
              liveWaterLevel ?? currentSensor?.waterLevel ?? 0,
            )}
          />
          <ConditionCard
            icon={Users}
            label="Reports"
            value={getReportsDisplay(currentSensor?.reportsNearby || 0)}
          />
          <ConditionCard
            icon={Moon}
            label="Tide"
            value={currentSensor?.tideLevel || "Medium"}
          />
        </div>

        {/* Action Guidance - condensed */}
        <ActionGuidance
          risk={
            liveWaterLevel == null
              ? mode === "SAFE"
                ? "LOW"
                : mode === "WARNING"
                  ? "MEDIUM"
                  : "HIGH"
              : liveWaterLevel <= 0
                ? "LOW"
                : liveWaterLevel <= 40
                  ? "MEDIUM"
                  : "HIGH"
          }
        />

        {/* District Preview - compact */}
        <DistrictPreview />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Radio className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Sensors</p>
            <p className="text-sm font-bold text-blue-600">3 active</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Safe Routes</p>
            <p className="text-sm font-bold text-green-600">2 found</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Alerts</p>
            <p className="text-sm font-bold text-red-600">1 active</p>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
        <Button
          onClick={() => router.push("/navigate")}
          className="w-full h-14 text-base font-semibold bg-[#289359] hover:bg-[#1f6e43] shadow-lg"
        >
          Navigate Safely
        </Button>
        <div className="mt-2 flex justify-center">
          <button
            className="text-xs text-neutral-500 underline"
            onClick={() => setShowModeDialog(true)}
          >
            Water level mode: {mode}
          </button>
        </div>
      </div>

      {/* Modals */}
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
      <DistrictSelectorModal
        open={showDistrictSelector}
        onClose={() => setShowDistrictSelector(false)}
      />

      {/* Mode Switch Dialog */}
      {showModeDialog && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[90%] max-w-sm p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-neutral-900 text-sm">
                Water level mode
              </h3>
              <button
                onClick={() => setShowModeDialog(false)}
                className="p-1 rounded hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Choose how the simulator generates water level readings.
            </p>
            <div className="space-y-2">
              {(["SAFE", "WARNING", "CRITICAL"] as WaterLevelMode[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={async () => {
                      const ok = await setWaterLevelMode(m);
                      if (ok) setMode(m);
                    }}
                    className={`w-full text-left px-3 py-2 rounded border text-sm ${mode === m ? "border-[#289359] bg-[#289359]/5" : "border-neutral-200 hover:bg-neutral-50"}`}
                  >
                    {m}
                  </button>
                ),
              )}
            </div>
            <div className="mt-3 text-right">
              <Button
                onClick={() => setShowModeDialog(false)}
                className="h-9 px-4 bg-neutral-800 hover:bg-neutral-700"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
