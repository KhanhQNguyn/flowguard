import { NextRequest, NextResponse } from 'next/server'
import { MOCK_ALERTS, getActiveAlerts, getAlertsByDistrict } from '@/lib/mock-alerts'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const activeOnly = searchParams.get('active') !== 'false'

    let alerts = activeOnly ? getActiveAlerts() : MOCK_ALERTS

    if (district) {
      alerts = getAlertsByDistrict(district)
    }

    return NextResponse.json({
      alerts,
      total: alerts.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[API] Alerts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
