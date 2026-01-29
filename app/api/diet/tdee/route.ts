import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
    }
    
    const factor = activityFactors[body.activity] || 1.55
    const tdee = body.bmr * factor
    
    return NextResponse.json({
      tdee: Math.round(tdee),
      message: `TDEE calculated: ${Math.round(tdee)} kcal/day`
    })
  } catch (error) {
    console.error('TDEE Error:', error)
    return NextResponse.json({ error: 'Failed to calculate TDEE' }, { status: 500 })
  }
}
