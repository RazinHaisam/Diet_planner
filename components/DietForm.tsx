'use client'

import { FormEvent, ChangeEvent, useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { Loader2 } from 'lucide-react'

interface FormData {
  age: number
  gender: string
  height: number
  weight: number
  activity: string
  goal: string
  diet_type: string
}

interface DietFormProps {
  onSubmit: (data: FormData) => Promise<void>
  disabled: boolean
}

export default function DietForm({ onSubmit, disabled }: DietFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activity: 'moderate',
    goal: 'loss',
    diet_type: 'non-veg',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl shadow-2xl overflow-hidden glow-border card-hover">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold">Your Profile</h2>
          <p className="text-blue-100 text-sm mt-2">Enter your details to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🎂</span> Age
            </label>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">👥</span> Gender
            </label>
            <Select name="gender" value={formData.gender} onChange={handleChange} disabled={disabled}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">📏</span> Height (cm)
            </label>
            <Input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">⚖️</span> Weight (kg)
            </label>
            <Input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
            <span className="text-lg mr-2">⚡</span> Activity Level
          </label>
          <Select name="activity" value={formData.activity} onChange={handleChange} disabled={disabled}>
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="very_active">Very Active (6-7 days/week)</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🎯</span> Goal
            </label>
            <Select name="goal" value={formData.goal} onChange={handleChange} disabled={disabled}>
              <option value="loss">Weight Loss</option>
              <option value="gain">Weight Gain</option>
              <option value="maintain">Maintain</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🥗</span> Diet Type
            </label>
            <Select name="diet_type" value={formData.diet_type} onChange={handleChange} disabled={disabled}>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={disabled} className="w-full mt-8 py-3 text-lg font-bold">
          {disabled ? (
            <>
              <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            '✨ Generate My Plan'
          )}
        </Button>
      </form>
    </div>
  )
}
