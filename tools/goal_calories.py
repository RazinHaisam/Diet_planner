def adjust_for_goal(tdee, goal):
    if goal == "loss":
        return tdee - 400
    elif goal == "gain":
        return tdee + 400
    return tdee
