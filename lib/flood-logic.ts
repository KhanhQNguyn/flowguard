export interface RiskInput {
  rainIntensity: 'Low' | 'Medium' | 'Heavy'
  waterLevel: number
  citizenReports: number
  tideLevel: 'Low' | 'Medium' | 'High'
}

export interface RiskOutput {
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  reasoning: string[]
  confidence: number
}

export function calculateFloodRisk(input: RiskInput): RiskOutput {
  let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  const reasoning: string[] = []

  // Rule 1: Primary water level thresholds
  if (input.waterLevel > 70) {
    risk = 'HIGH'
    reasoning.push('Water level exceeds 70cm critical threshold')
  } else if (input.waterLevel > 30) {
    risk = 'MEDIUM'
    reasoning.push('Water level above 30cm warning threshold')
  }

  // Rule 2: Rain intensity escalation
  if (input.rainIntensity === 'Heavy') {
    if (input.waterLevel > 50) {
      risk = 'HIGH'
      reasoning.push('Heavy rain combined with elevated water levels')
    } else if (input.waterLevel > 30) {
      if (risk === 'LOW') risk = 'MEDIUM'
      reasoning.push('Heavy rain increasing flood risk')
    }
  }

  // Rule 3: Citizen report validation
  if (input.citizenReports >= 3 && input.waterLevel > 35) {
    if (risk === 'LOW') {
      risk = 'MEDIUM'
      reasoning.push('Multiple citizen reports confirm rising water')
    } else if (risk === 'MEDIUM') {
      risk = 'HIGH'
      reasoning.push('Citizen reports escalate existing risk')
    }
  }

  // Rule 4: Tide level modifier
  if (input.tideLevel === 'High' && input.waterLevel > 40) {
    if (risk === 'MEDIUM') {
      risk = 'HIGH'
      reasoning.push('High tide amplifies flood risk')
    } else if (risk === 'LOW') {
      risk = 'MEDIUM'
      reasoning.push('High tide raises water levels')
    }
  }

  // Calculate confidence based on data availability
  let confidence = 70
  if (input.waterLevel > 0) confidence += 10
  if (input.rainIntensity !== 'Low') confidence += 10
  if (input.citizenReports > 0) confidence += 10

  // If no reasoning was added, add a default
  if (reasoning.length === 0) {
    reasoning.push('All sensor readings within normal parameters')
  }

  return { risk, reasoning, confidence: Math.min(confidence, 100) }
}
