import { RiskOutput } from './flood-logic'
import { RouteRecommendation } from './route-engine'

export interface ExplanationContext {
  type: 'risk' | 'route' | 'alert'
  data: RiskOutput | RouteRecommendation | AlertData
}

export interface AlertData {
  triggerReason: string
  conditions: string
  duration: string
}

export function generateExplanation(context: ExplanationContext): string {
  switch (context.type) {
    case 'risk':
      return generateRiskExplanation(context.data as RiskOutput)
    case 'route':
      return generateRouteExplanation(context.data as RouteRecommendation)
    case 'alert':
      return generateAlertExplanation(context.data as AlertData)
    default:
      return 'Analysis not available'
  }
}

function generateRiskExplanation(data: RiskOutput): string {
  const intro = `FlowGuard AI detected ${data.risk.toLowerCase()} risk conditions.`
  const reasons = data.reasoning.join('. ')
  const confidence = `Confidence level: ${data.confidence}%.`

  let action = ''
  if (data.risk === 'HIGH') {
    action = 'We strongly recommend avoiding travel in this area.'
  } else if (data.risk === 'MEDIUM') {
    action = 'Use caution and plan alternate routes where possible.'
  } else {
    action = 'Conditions are currently safe for normal travel.'
  }

  return `${intro} ${reasons}. ${action} ${confidence}`
}

function generateRouteExplanation(data: RouteRecommendation): string {
  if (data.avoidStreets.length > 0) {
    return `This route avoids ${data.avoidStreets.join(', ')} due to elevated flood risk. The suggested path via ${data.waypoints.join(' → ')} provides safer conditions with ${data.safetyScore}% safety score.`
  }

  return `This route via ${data.waypoints.join(' → ')} is currently safe with ${data.safetyScore}% safety score and no major flood risks detected.`
}

function generateAlertExplanation(data: AlertData): string {
  return `Alert triggered due to ${data.triggerReason}. Current conditions: ${data.conditions}. Expected duration: ${data.duration}.`
}

export function getActionRecommendation(risk: 'LOW' | 'MEDIUM' | 'HIGH'): {
  action: string
  icon: string
  priority: 'low' | 'medium' | 'high'
} {
  switch (risk) {
    case 'HIGH':
      return {
        action: 'Stay indoors and avoid all non-essential travel',
        icon: 'alert-triangle',
        priority: 'high'
      }
    case 'MEDIUM':
      return {
        action: 'Plan your route carefully and avoid low-lying areas',
        icon: 'alert-circle',
        priority: 'medium'
      }
    case 'LOW':
    default:
      return {
        action: 'Normal travel conditions - stay informed',
        icon: 'check-circle',
        priority: 'low'
      }
  }
}
