import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Call your Python client here or process the data
    // For now, return mock data
    const mockResponse = {
      calories: {
        daily_calories: Math.round(1800 + (body.weight - 70) * 10)
      },
      macros: {
        protein: Math.round(body.weight * 1.6),
        carbs: Math.round(body.weight * 4),
        fats: Math.round(body.weight * 0.8)
      },
      meal_plan: {
        plan: `Breakfast: Oats with berries and almonds\nLunch: Grilled chicken with brown rice\nSnack: Greek yogurt\nDinner: Salmon with vegetables`
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate diet plan' }, { status: 500 });
  }
}
