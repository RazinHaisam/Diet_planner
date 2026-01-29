import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age
    
    if (body.gender === 'male') {
      bmr += 5
    } else {
      bmr -= 161
    }
    
    return NextResponse.json({
      bmr: Math.round(bmr),
      message: `BMR calculated: ${Math.round(bmr)} kcal/day`
    })
  } catch (error) {
    console.error('BMR Error:', error)
    return NextResponse.json({ error: 'Failed to calculate BMR' }, { status: 500 })
  }
}
