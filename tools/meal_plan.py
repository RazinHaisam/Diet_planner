import json
from pathlib import Path

def load_foods():
    """Load foods from data/foods.json"""
    foods_file = Path(__file__).parent.parent / "data" / "foods.json"
    try:
        with open(foods_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def filter_foods_by_diet(foods: dict, diet_type: str):
    """Filter foods based on diet type"""
    filtered = {}
    for food_name, food_data in foods.items():
        if diet_type == "veg" and food_data.get("type") in ["vegetarian", "vegan"]:
            filtered[food_name] = food_data
        elif diet_type == "vegan" and food_data.get("type") == "vegan":
            filtered[food_name] = food_data
        elif diet_type == "non-veg":
            filtered[food_name] = food_data
    return filtered

def select_foods_for_macros(foods: dict, target_protein: int, target_carbs: int, target_fats: int):
    """Select foods that match target macros"""
    selected = {
        "breakfast": [],
        "lunch": [],
        "snack": [],
        "dinner": []
    }
    
    # Group foods by meal type
    breakfast_foods = [f for f, d in foods.items() if d.get("meal_type") == "breakfast"]
    lunch_foods = [f for f, d in foods.items() if d.get("meal_type") == "lunch"]
    snack_foods = [f for f, d in foods.items() if d.get("meal_type") == "snack"]
    dinner_foods = [f for f, d in foods.items() if d.get("meal_type") == "dinner"]
    
    # Select foods for each meal (simple selection)
    if breakfast_foods:
        selected["breakfast"].append(breakfast_foods[0])
    if lunch_foods:
        selected["lunch"].append(lunch_foods[0])
    if snack_foods:
        selected["snack"].append(snack_foods[0])
    if dinner_foods:
        selected["dinner"].append(dinner_foods[0])
    
    return selected

def generate_meal_plan(macros: dict, diet_type: str):
    """Generate meal plan using only foods from data/foods.json"""
    
    # Load foods from JSON
    all_foods = load_foods()
    
    if not all_foods:
        return {
            "error": "No foods found in database",
            "meal_plan": "Unable to generate meal plan"
        }
    
    # Filter foods by diet type
    available_foods = filter_foods_by_diet(all_foods, diet_type)
    
    if not available_foods:
        return {
            "error": f"No {diet_type} foods found in database",
            "meal_plan": "Unable to generate meal plan for specified diet type"
        }
    
    # Select foods for meals
    selected_foods = select_foods_for_macros(
        available_foods,
        macros.get("protein", 0),
        macros.get("carbs", 0),
        macros.get("fats", 0)
    )
    
    # Build meal plan text
    meal_plan_text = f"""Daily Meal Plan ({diet_type}):\n\n"""
    
    for meal_type, foods_list in selected_foods.items():
        if foods_list:
            meal_name = meal_type.capitalize()
            food_name = foods_list[0]
            food_data = available_foods.get(food_name, {})
            
            portion = food_data.get("portion", "100g")
            calories = food_data.get("calories", 0)
            protein = food_data.get("protein", 0)
            carbs = food_data.get("carbs", 0)
            fats = food_data.get("fats", 0)
            
            meal_plan_text += f"{meal_name}: {food_name} ({portion})\n"
            meal_plan_text += f"  Calories: {calories}kcal | P: {protein}g | C: {carbs}g | F: {fats}g\n\n"
    
    meal_plan_text += f"\nDaily Macros Target:\n"
    meal_plan_text += f"Protein: {macros.get('protein', 0)}g\n"
    meal_plan_text += f"Carbs: {macros.get('carbs', 0)}g\n"
    meal_plan_text += f"Fats: {macros.get('fats', 0)}g\n"
    meal_plan_text += f"Total Calories: {macros.get('calories', 0)}kcal"
    
    return {
        "meal_plan": meal_plan_text,
        "diet_type": diet_type,
        "foods_used": [f for foods in selected_foods.values() for f in foods],
        "macros_target": macros
    }
