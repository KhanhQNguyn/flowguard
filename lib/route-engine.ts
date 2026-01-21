export interface Location {
  lat: number
  lng: number
  address: string
  district: string
}

export interface RouteSegment {
  street: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface RouteRecommendation {
  waypoints: string[]
  avoidStreets: string[]
  safetyScore: number
  reasoning: string
  estimatedTime: number
}

export function analyzeRoute(
  origin: Location,
  destination: Location,
  riskData: Map<string, 'LOW' | 'MEDIUM' | 'HIGH'>
): RouteRecommendation {
  // Simulate route calculation based on districts
  const segments: RouteSegment[] = []
  
  // Add segments based on the route
  if (origin.district === 'District 7') {
    segments.push({ 
      street: 'Huỳnh Tấn Phát', 
      riskLevel: riskData.get('Huỳnh Tấn Phát') || 'MEDIUM' 
    })
  }
  
  segments.push({ 
    street: 'Nguyễn Văn Linh', 
    riskLevel: riskData.get('Nguyễn Văn Linh') || 'LOW' 
  })
  
  if (destination.district === 'District 1' || destination.district === 'District 4') {
    segments.push({ 
      street: 'Võ Văn Kiệt', 
      riskLevel: riskData.get('Võ Văn Kiệt') || 'LOW' 
    })
  }

  // Calculate safety score
  let safetyScore = 100
  const avoidStreets: string[] = []

  segments.forEach(segment => {
    if (segment.riskLevel === 'HIGH') {
      safetyScore -= 30
      avoidStreets.push(segment.street)
    } else if (segment.riskLevel === 'MEDIUM') {
      safetyScore -= 15
    } else if (segment.riskLevel === 'LOW') {
      safetyScore -= 5
    }
  })

  safetyScore = Math.max(safetyScore, 0)

  // Generate reasoning
  let reasoning = ''
  if (safetyScore >= 70) {
    reasoning = `This route is relatively safe with ${segments.filter(s => s.riskLevel === 'LOW').length} low-risk segments.`
  } else if (safetyScore >= 40) {
    reasoning = `This route has some risk. Consider alternate paths to avoid ${avoidStreets.length} problem areas.`
  } else {
    reasoning = `This route is not recommended due to multiple high-risk segments.`
  }

  // Calculate estimated time based on distance and traffic
  const baseTime = 15 + Math.floor(Math.random() * 10)
  const delayFromRisk = avoidStreets.length * 5

  return {
    waypoints: segments.map(s => s.street),
    avoidStreets,
    safetyScore,
    reasoning,
    estimatedTime: baseTime + delayFromRisk
  }
}

export function getSuggestedAlternative(
  avoidStreets: string[]
): { street: string; reason: string }[] {
  const alternatives: { street: string; reason: string }[] = []

  if (avoidStreets.includes('Huỳnh Tấn Phát')) {
    alternatives.push({
      street: 'Nguyễn Thị Thập',
      reason: 'Lower elevation, better drainage'
    })
  }

  if (avoidStreets.includes('Nguyễn Hữu Cảnh')) {
    alternatives.push({
      street: 'Điện Biên Phủ',
      reason: 'Elevated roadway, flood resistant'
    })
  }

  return alternatives
}
