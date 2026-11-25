import { useState } from 'react'
import { NutritionContext } from './nutritionContextDef'
import { validateNutritionProfile } from '../services/nutritionProfileValidation'

export function NutritionProvider({ children }) {
  // 1. Session-only in-memory nutrition profile
  const [profile, setProfile] = useState({
    isConfigured: false,
    age: null,
    heightCm: null,
    weightKg: null,
    dietaryPreference: '',
    activityLevel: '',
    nutritionGoal: '',
    allergies: [],
    preferredCuisines: [],
    notes: '',
  })

  // 2. Daily nutrition metrics for the current session (zero fabricated logs)
  const [dailySummary, setDailySummary] = useState({
    calories: null,
    targetCalories: null,
    carbsGrams: null,
    proteinGrams: null,
    fatGrams: null,
    hydrationLiters: null,
    targetHydrationLiters: 2.5,
    mealsCount: 0,
    hasLogs: false,
  })

  // Save / Update profile with validation
  const saveProfile = (rawProfileData) => {
    const { isValid, errors, sanitized } = validateNutritionProfile(rawProfileData)
    if (!isValid) {
      return { success: false, errors }
    }

    setProfile({
      ...sanitized,
      isConfigured: true,
      updatedAt: new Date().toISOString(),
    })

    return { success: true, profile: sanitized }
  }

  // Reset profile to default unconfigured state
  const resetProfile = () => {
    setProfile({
      isConfigured: false,
      age: null,
      heightCm: null,
      weightKg: null,
      dietaryPreference: '',
      activityLevel: '',
      nutritionGoal: '',
      allergies: [],
      preferredCuisines: [],
      notes: '',
    })
    setDailySummary({
      calories: null,
      targetCalories: null,
      carbsGrams: null,
      proteinGrams: null,
      fatGrams: null,
      hydrationLiters: null,
      targetHydrationLiters: 2.5,
      mealsCount: 0,
      hasLogs: false,
    })
  }

  // Quick session-only hydration logger entry point
  const logHydration = (amountLiters) => {
    const num = Number(amountLiters)
    if (isNaN(num) || num <= 0) return
    setDailySummary((prev) => {
      const current = prev.hydrationLiters || 0
      const nextVal = Math.round((current + num) * 10) / 10
      return {
        ...prev,
        hydrationLiters: nextVal,
        hasLogs: true,
      }
    })
  }

  return (
    <NutritionContext.Provider
      value={{
        profile,
        dailySummary,
        saveProfile,
        resetProfile,
        logHydration,
        isSessionOnly: true,
      }}
    >
      {children}
    </NutritionContext.Provider>
  )
}
