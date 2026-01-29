import json
from pathlib import Path

foods_file = Path(__file__).parent.parent / "data" / "food.json"
FOOD_DB = json.loads(foods_file.read_text())

def get_food(food_name: str):
    return FOOD_DB.get(food_name.lower())
