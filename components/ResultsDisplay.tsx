'use client'

interface Macros {
  protein: number
  carbs: number
  fats: number
}

interface DietResult {
  bmr?: number
  tdee?: number
  calories?: number
  macros?: Macros
  meal_plan?: string
}

interface ResultsDisplayProps {
  results: DietResult
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const safeResults = results || {}

  return (
    <div className="space-y-8">
      {/* Nutrition Overview */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl shadow-2xl overflow-hidden glow-border card-hover animate-fadeInUp">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 p-8">
          <h3 className="text-3xl font-bold gradient-text">📊 Nutrition Overview</h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {safeResults.bmr && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 card-hover transition-smooth">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Basal Metabolic Rate</p>
                <p className="text-4xl font-bold text-blue-900 mt-3">{Math.round(safeResults.bmr)}</p>
                <p className="text-sm text-blue-500 mt-2">kcal/day at rest</p>
              </div>
            )}
            {safeResults.tdee && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-6 rounded-xl border-2 border-cyan-200 card-hover transition-smooth">
                <p className="text-xs text-cyan-600 font-bold uppercase tracking-wider">Daily Energy Expenditure</p>
                <p className="text-4xl font-bold text-cyan-900 mt-3">{Math.round(safeResults.tdee)}</p>
                <p className="text-sm text-cyan-500 mt-2">kcal with activity</p>
              </div>
            )}
            {safeResults.calories && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl border-2 border-teal-200 card-hover transition-smooth">
                <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">Daily Goal</p>
                <p className="text-4xl font-bold text-teal-900 mt-3">{Math.round(safeResults.calories)}</p>
                <p className="text-sm text-teal-500 mt-2">target intake</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Macros */}
      {safeResults.macros && (
        <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl shadow-2xl overflow-hidden glow-border card-hover animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 p-8">
            <h3 className="text-3xl font-bold gradient-text">💪 Macronutrients Breakdown</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-2 border-blue-300 card-hover transition-smooth text-center">
                <p className="text-5xl mb-2">🥚</p>
                <p className="text-sm text-blue-600 font-bold uppercase mb-2">Protein</p>
                <p className="text-4xl font-bold text-blue-900">{Math.round(safeResults.macros.protein)}g</p>
                <p className="text-xs text-blue-500 mt-3 bg-blue-100 py-1 px-2 rounded">
                  {safeResults.calories ? Math.round((safeResults.macros.protein * 4 / safeResults.calories) * 100) : 0}% of calories
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl border-2 border-amber-300 card-hover transition-smooth text-center">
                <p className="text-5xl mb-2">🌾</p>
                <p className="text-sm text-amber-600 font-bold uppercase mb-2">Carbs</p>
                <p className="text-4xl font-bold text-amber-900">{Math.round(safeResults.macros.carbs)}g</p>
                <p className="text-xs text-amber-500 mt-3 bg-amber-100 py-1 px-2 rounded">
                  {safeResults.calories ? Math.round((safeResults.macros.carbs * 4 / safeResults.calories) * 100) : 0}% of calories
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border-2 border-orange-300 card-hover transition-smooth text-center">
                <p className="text-5xl mb-2">🥑</p>
                <p className="text-sm text-orange-600 font-bold uppercase mb-2">Fats</p>
                <p className="text-4xl font-bold text-orange-900">{Math.round(safeResults.macros.fats)}g</p>
                <p className="text-xs text-orange-500 mt-3 bg-orange-100 py-1 px-2 rounded">
                  {safeResults.calories ? Math.round((safeResults.macros.fats * 9 / safeResults.calories) * 100) : 0}% of calories
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Plan */}
      {safeResults.meal_plan && (
        <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl shadow-2xl overflow-hidden glow-border card-hover animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 p-8">
            <h3 className="text-3xl font-bold gradient-text">🍽️ Your Meal Plan</h3>
          </div>
          <div className="p-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 text-blue-900 whitespace-pre-wrap text-sm sm:text-base leading-relaxed font-medium">
              {typeof safeResults.meal_plan === 'string' ? safeResults.meal_plan : JSON.stringify(safeResults.meal_plan, null, 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
