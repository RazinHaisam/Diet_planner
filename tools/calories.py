def daily_calories(age: int, height_cm: float, weight_kg: float, activity: str) -> int:
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5

    factors = {
        "low": 1.2,
        "moderate": 1.55,
        "high": 1.725
    }

    return int(bmr * factors.get(activity, 1.2))
