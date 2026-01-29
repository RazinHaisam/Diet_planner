import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    let calories = body.tdee
    
    if (body.goal === 'loss') {
      calories = body.tdee * 0.85 // 15% deficit
    } else if (body.goal === 'gain') {
      calories = body.tdee * 1.1 // 10% surplus
    }
    // maintain stays the same
    
    return NextResponse.json({
      calories: Math.round(calories),
      goal: body.goal,
      message: `Daily calorie target: ${Math.round(calories)} kcal`
    })
  } catch (error) {
    console.error('Goal Calories Error:', error)
    return NextResponse.json({ error: 'Failed to calculate goal calories' }, { status: 500 })
  }
}
