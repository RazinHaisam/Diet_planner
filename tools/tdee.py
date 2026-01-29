ACTIVITY_MULTIPLIER = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "heavy": 1.725
}

def calculate_tdee(bmr, activity):
    return bmr * ACTIVITY_MULTIPLIER[activity]
