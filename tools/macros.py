def calculate_macros(weight_kg, calories):
    protein_g = 2.0 * weight_kg
    protein_kcal = protein_g * 4

    fat_kcal = calories * 0.25
    fat_g = fat_kcal / 9

    remaining_kcal = calories - (protein_kcal + fat_kcal)
    carbs_g = remaining_kcal / 4

    return {
        "protein_g": round(protein_g),
        "fat_g": round(fat_g),
        "carbs_g": round(carbs_g),
        "calories": round(calories)
    }
