import { NextRequest, NextResponse } from 'next/server'

const mealPlans: Record<string, any> = {
  'non-veg': {
    breakfast: 'Eggs (3) with whole wheat toast, avocado, and green tea',
    snack1: 'Greek yogurt with almonds',
    lunch: 'Grilled chicken breast (200g) with brown rice and steamed broccoli',
    snack2: 'Protein shake with banana',
    dinner: 'Salmon (150g) with sweet potato and mixed vegetables',
  },
  veg: {
    breakfast: 'Oatmeal with berries, almonds, and milk',
    snack1: 'Hummus with carrot sticks',
    lunch: 'Paneer curry with brown rice and green salad',
    snack2: 'Mixed nuts and fruit',
    dinner: 'Lentil dal with quinoa and roasted vegetables',
  },
  vegan: {
    breakfast: 'Tofu scramble with whole wheat toast and avocado',
    snack1: 'Chickpea snack with tahini',
    lunch: 'Tempeh stir-fry with quinoa and vegetables',
    snack2: 'Protein smoothie with plant milk',
    dinner: 'Bean curry with brown rice and steamed greens',
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dietType = body.diet_type || 'non-veg'
    const plan = mealPlans[dietType] || mealPlans['non-veg']
    
    const mealPlanText = `Daily Meal Plan (${dietType}):\n\nBreakfast: ${plan.breakfast}\n\nMid-Morning Snack: ${plan.snack1}\n\nLunch: ${plan.lunch}\n\nAfternoon Snack: ${plan.snack2}\n\nDinner: ${plan.dinner}\n\nMacros: Protein ${body.macros.protein}g | Carbs ${body.macros.carbs}g | Fats ${body.macros.fats}g`
    
    return NextResponse.json({
      meal_plan: mealPlanText,
      diet_type: dietType,
      macros: body.macros,
      message: 'Meal plan generated successfully'
    })
  } catch (error) {
    console.error('Meal Plan Error:', error)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
