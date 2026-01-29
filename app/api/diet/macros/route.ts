import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Macro calculation: Protein 1.6g per kg, Carbs 4g per kg, Fats 0.8g per kg
    const protein = body.weight * 1.6
    const fats = body.weight * 0.8
    const carbsFromCalories = body.calories - (protein * 4 + fats * 9)
    const carbs = carbsFromCalories / 4
    
    return NextResponse.json({
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      calories: body.calories,
      message: `Macros calculated: P ${Math.round(protein)}g, C ${Math.round(carbs)}g, F ${Math.round(fats)}g`
    })
  } catch (error) {
    console.error('Macros Error:', error)
    return NextResponse.json({ error: 'Failed to calculate macros' }, { status: 500 })
  }
}
