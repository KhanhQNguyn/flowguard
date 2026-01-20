import { NextRequest, NextResponse } from 'next/server'
import { calculateFloodRisk } from '@/lib/flood-logic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { rainIntensity, waterLevel, citizenReports, tideLevel } = body

    // Validation
    if (!rainIntensity || waterLevel === undefined || citizenReports === undefined || !tideLevel) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Validate rainIntensity
    if (!['Low', 'Medium', 'Heavy'].includes(rainIntensity)) {
      return NextResponse.json(
        { error: 'Invalid rainIntensity. Must be Low, Medium, or Heavy.' },
        { status: 400 }
      )
    }

    // Validate tideLevel
    if (!['Low', 'Medium', 'High'].includes(tideLevel)) {
      return NextResponse.json(
        { error: 'Invalid tideLevel. Must be Low, Medium, or High.' },
        { status: 400 }
      )
    }

    const result = calculateFloodRisk({
      rainIntensity,
      waterLevel: Number(waterLevel),
      citizenReports: Number(citizenReports),
      tideLevel
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Risk calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FlowGuard Risk Calculation API',
    usage: 'POST with { rainIntensity, waterLevel, citizenReports, tideLevel }'
  })
}
