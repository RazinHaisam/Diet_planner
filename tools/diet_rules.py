from tools.food_db import FOOD_DB

def generate_diet_plan(calories: int, bmi_category: str):
    plan = []

    if bmi_category in ["overweight", "obese"]:
        target_cal = calories - 300
    elif bmi_category == "underweight":
        target_cal = calories + 300
    else:
        target_cal = calories

    # very simple food selection logic
    if target_cal < 2000:
        plan = ["oats", "banana", "spinach"]
    else:
        plan = ["oats", "banana", "chicken breast", "spinach"]

    meal = {}
    total_cal = 0

    for food in plan:
        data = FOOD_DB[food]
        meal[food] = data
        total_cal += data.get("calories_kcal", 0)

    return {
        "target_calories": target_cal,
        "foods": meal,
        "estimated_calories": total_cal
    }
