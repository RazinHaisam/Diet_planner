import asyncio
import json
import uuid
from dotenv import load_dotenv

from groq import Groq
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp import ClientSession

# Load .env file
load_dotenv()

# Create Groq client
client = Groq()

SYSTEM_PROMPT = """
You are a diet-planning AI assistant.

You have access to the following tools:
1. bmr(weight, height, age, gender)
2. tdee(bmr, activity)
3. goal_calories(tdee, goal)
4. macros(weight, calories)
5. meal_plan(macros, diet_type)

Rules:
- NEVER calculate nutrition values yourself
- ALWAYS use tools for calculations
- Follow this exact order:
  bmr → tdee → goal_calories → macros → meal_plan
- If a tool is needed, respond ONLY in valid JSON
- JSON format:
{
  "tool": "<tool_name>",
  "arguments": { ... }
}
"""


def ask_llm(messages):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0
    )
    return response.choices[0].message.content


def extract_tool_result(result):
    if hasattr(result.content[0], "text"):
        return json.loads(result.content[0].text)
    return json.loads(str(result.content[0]))


async def main():
    async with stdio_client(
        StdioServerParameters(command="python", args=["server.py"])
    ) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # ---- USER PROFILE ----
            user_profile = {
                "age": 25,
                "gender": "male",
                "height": 170,
                "weight": 70,
                "activity": "moderate",
                "goal": "loss",
                "diet_type": "non-veg"
            }

            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"My profile is: {json.dumps(user_profile)}. "
                        "Create a diet plan using the proper nutrition method."
                    )
                }
            ]

            # ---- STEP 1: BMR ----
            tool_call = ask_llm(messages)
            bmr_call = json.loads(tool_call)
            bmr_call_id = str(uuid.uuid4())

            bmr_result = await session.call_tool(
                bmr_call["tool"],
                arguments=bmr_call["arguments"]
            )
            bmr_value = extract_tool_result(bmr_result)

            messages.append({"role": "assistant", "content": tool_call})
            messages.append({"role": "tool", "content": json.dumps(bmr_value), "tool_call_id": bmr_call_id})

            # ---- STEP 2: TDEE ----
            tool_call = ask_llm(messages)
            tdee_call = json.loads(tool_call)
            tdee_call_id = str(uuid.uuid4())

            tdee_result = await session.call_tool(
                tdee_call["tool"],
                arguments=tdee_call["arguments"]
            )
            tdee_value = extract_tool_result(tdee_result)

            messages.append({"role": "assistant", "content": tool_call})
            messages.append({"role": "tool", "content": json.dumps(tdee_value), "tool_call_id": tdee_call_id})

            # ---- STEP 3: GOAL CALORIES ----
            tool_call = ask_llm(messages)
            goal_call = json.loads(tool_call)
            goal_call_id = str(uuid.uuid4())

            goal_result = await session.call_tool(
                goal_call["tool"],
                arguments=goal_call["arguments"]
            )
            calories = extract_tool_result(goal_result)

            messages.append({"role": "assistant", "content": tool_call})
            messages.append({"role": "tool", "content": json.dumps(calories), "tool_call_id": goal_call_id})

            # ---- STEP 4: MACROS ----
            tool_call = ask_llm(messages)
            macro_call = json.loads(tool_call)
            macro_call_id = str(uuid.uuid4())

            macro_result = await session.call_tool(
                macro_call["tool"],
                arguments=macro_call["arguments"]
            )
            macros = extract_tool_result(macro_result)

            messages.append({"role": "assistant", "content": tool_call})
            messages.append({"role": "tool", "content": json.dumps(macros), "tool_call_id": macro_call_id})

            # ---- STEP 5: MEAL PLAN ----
            tool_call = ask_llm(messages)
            plan_call = json.loads(tool_call)
            plan_call_id = str(uuid.uuid4())

            plan_result = await session.call_tool(
                plan_call["tool"],
                arguments=plan_call["arguments"]
            )
            meal_plan = extract_tool_result(plan_result)

            messages.append({"role": "assistant", "content": tool_call})
            messages.append({"role": "tool", "content": json.dumps(meal_plan), "tool_call_id": plan_call_id})

            # ---- FINAL EXPLANATION ----
            final_answer = ask_llm([
                {
                    "role": "system",
                    "content": "Explain the diet plan clearly using calories and macros."
                },
                {
                    "role": "user",
                    "content": json.dumps({
                        "calories": calories,
                        "macros": macros,
                        "meal_plan": meal_plan
                    })
                }
            ])

            print("\n🥗 FINAL DIET PLAN:\n")
            print(final_answer)


asyncio.run(main())
