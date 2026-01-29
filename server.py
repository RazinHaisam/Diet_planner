from mcp.server.fastmcp import FastMCP
from tools.bmr import calculate_bmr
from tools.tdee import calculate_tdee
from tools.goal_calories import adjust_for_goal
from tools.macros import calculate_macros
from tools.meal_plan import generate_meal_plan

mcp = FastMCP("diet-planner")

@mcp.tool()
def bmr(weight, height, age, gender):
    return calculate_bmr(weight, height, age, gender)

@mcp.tool()
def tdee(bmr, activity):
    return calculate_tdee(bmr, activity)

@mcp.tool()
def goal_calories(tdee, goal):
    return adjust_for_goal(tdee, goal)

@mcp.tool()
def macros(weight, calories):
    return calculate_macros(weight, calories)

@mcp.tool()
def meal_plan(macros, diet_type):
    return generate_meal_plan(macros, diet_type)

if __name__ == "__main__":
    mcp.run()
