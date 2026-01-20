import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
const reports: Array<{
  id: string
  type: 'flood' | 'traffic' | 'hazard'
  severity: 'low' | 'medium' | 'high'
  location: string
  description: string
  timestamp: string
  verified: boolean
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { type, severity, location, description } = body

    // Validation
    if (!type || !severity || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: type, severity, location' },
        { status: 400 }
      )
    }

    const newReport = {
      id: `report-${Date.now()}`,
      type,
      severity,
      location,
      description: description || '',
      timestamp: new Date().toISOString(),
      verified: false
    }

    reports.push(newReport)

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Report submitted successfully. Pending verification.'
    })
  } catch (error) {
    console.error('[API] Report submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    reports: reports.slice(-10), // Return last 10 reports
    total: reports.length,
    timestamp: new Date().toISOString()
  })
}
