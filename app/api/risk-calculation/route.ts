import { type NextRequest, NextResponse } from "next/server"

interface RiskInput {
  rainIntensity: "Low" | "Medium" | "Heavy"
  waterLevel: number
  citizenReports: number
  tideLevel: "Low" | "Medium" | "High"
}

export async function POST(request: NextRequest) {
  const body: RiskInput = await request.json()

  let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW"
  const reasoning: string[] = []

  // Primary threshold
  if (body.waterLevel > 70) {
    risk = "HIGH"
    reasoning.push("Water level exceeds 70cm threshold")
  } else if (body.waterLevel > 50) {
    risk = "MEDIUM"
    reasoning.push("Water level exceeds 50cm threshold")
  }

  // Rain escalation
  if (body.rainIntensity === "Heavy") {
    if (body.waterLevel > 50) {
      risk = "HIGH"
      reasoning.push("Heavy rain + high water → escalated to HIGH")
    } else if (body.waterLevel > 30) {
      if (risk === "LOW") risk = "MEDIUM"
      reasoning.push("Heavy rain detected")
    }
  }

  // Citizen reports
  if (body.citizenReports >= 3 && body.waterLevel > 35) {
    if (risk === "LOW") {
      risk = "MEDIUM"
      reasoning.push("Multiple verified reports → escalated")
    } else if (risk === "MEDIUM") {
      risk = "HIGH"
      reasoning.push("Multiple reports confirm HIGH risk")
    }
  }

  // Tide modifier
  if (body.tideLevel === "High" && body.waterLevel > 40) {
    if (risk === "LOW") risk = "MEDIUM"
    else if (risk === "MEDIUM") risk = "HIGH"
    reasoning.push("High tide increases flood risk")
  }

  return NextResponse.json({
    risk,
    reasoning,
    inputs: body,
    timestamp: new Date().toISOString(),
  })
}
