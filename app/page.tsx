'use client'

import { useState } from 'react'
import DietForm, { FormData } from '@/components/DietForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import { Loader2, Zap } from 'lucide-react'

interface DietResult {
  bmr?: number
  tdee?: number
  calories?: number
  macros?: {
    protein: number
    carbs: number
    fats: number
  }
  meal_plan?: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DietResult | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const handleGeneratePlan = async (data: FormData) => {
    setLoading(true)
    setCurrentStep(0)
    setResults({})

    try {
      // Step 1: BMR
      setCurrentStep(1)
      const bmrResponse = await fetch('/api/diet/bmr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: data.weight,
          height: data.height,
          age: data.age,
          gender: data.gender,
        }),
      })
      const bmrData = await bmrResponse.json()
      if (!bmrResponse.ok) throw new Error(bmrData.error || 'Failed to calculate BMR')

      // Step 2: TDEE
      setCurrentStep(2)
      const tdeeResponse = await fetch('/api/diet/tdee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bmr: bmrData.bmr,
          activity: data.activity,
        }),
      })
      const tdeeData = await tdeeResponse.json()
      if (!tdeeResponse.ok) throw new Error(tdeeData.error || 'Failed to calculate TDEE')

      // Step 3: Goal Calories
      setCurrentStep(3)
      const caloriesResponse = await fetch('/api/diet/goal-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tdee: tdeeData.tdee,
          goal: data.goal,
        }),
      })
      const caloriesData = await caloriesResponse.json()
      if (!caloriesResponse.ok) throw new Error(caloriesData.error || 'Failed to calculate calories')

      // Step 4: Macros
      setCurrentStep(4)
      const macrosResponse = await fetch('/api/diet/macros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: data.weight,
          calories: caloriesData.calories,
        }),
      })
      const macrosData = await macrosResponse.json()
      if (!macrosResponse.ok) throw new Error(macrosData.error || 'Failed to calculate macros')

      // Step 5: Meal Plan
      setCurrentStep(5)
      const mealResponse = await fetch('/api/diet/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          macros: macrosData,
          diet_type: data.diet_type,
        }),
      })
      const mealData = await mealResponse.json()
      if (!mealResponse.ok) throw new Error(mealData.error || 'Failed to generate meal plan')

      setResults({
        bmr: bmrData.bmr,
        tdee: tdeeData.tdee,
        calories: caloriesData.calories,
        macros: macrosData,
        meal_plan: mealData.meal_plan,
      })
      setCurrentStep(0)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error: ${errorMessage}`)
      setCurrentStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative p-4 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200">
              <span className="text-sm font-semibold text-blue-600">✨ Personalized Nutrition</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              <span className="gradient-text">Diet Planner</span>
              <br />
              <span className="text-blue-900">AI-Powered</span>
            </h1>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto mt-4">
              Create your personalized nutrition plan based on your goals and lifestyle
            </p>
          </div>

          {/* Loading Steps */}
          {loading && (
            <div className="mb-12 max-w-3xl mx-auto animate-fadeInUp">
              <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl p-8 shadow-2xl glow-border">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-16 h-16">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <Zap className="absolute inset-2 w-12 h-12 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-center text-lg font-semibold text-blue-900 mb-8">Calculating your perfect plan...</p>
                <div className="space-y-4">
                  {[
                    { step: 1, name: 'Calculating BMR', icon: '📊' },
                    { step: 2, name: 'Computing TDEE', icon: '⚡' },
                    { step: 3, name: 'Adjusting for Goal', icon: '🎯' },
                    { step: 4, name: 'Calculating Macros', icon: '💪' },
                    { step: 5, name: 'Generating Meal Plan', icon: '🍽️' },
                  ].map((item, idx) => (
                    <div
                      key={item.step}
                      className="flex items-center transition-smooth"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold transition-smooth ${
                        currentStep >= item.step
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-110 shadow-lg'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {currentStep > item.step ? '✓' : item.icon}
                      </div>
                      <span className={`text-lg transition-smooth ${
                        currentStep >= item.step ? 'text-blue-900 font-semibold' : 'text-blue-600'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1 animate-slideInLeft">
              <DietForm onSubmit={handleGeneratePlan} disabled={loading} />
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 animate-slideInRight">
              {results && Object.keys(results).length > 0 ? (
                <ResultsDisplay results={results} />
              ) : (
                <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl p-12 shadow-2xl h-full flex items-center justify-center glow-border card-hover">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-2xl font-bold gradient-text mb-2">Ready to get started?</p>
                    <p className="text-blue-600 max-w-sm">Fill in your profile and click "Generate Plan" to see your personalized diet plan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
