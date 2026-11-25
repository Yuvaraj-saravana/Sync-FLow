import { useContext } from 'react'
import { NutritionContext } from './nutritionContextDef'

export function useNutrition() {
  const context = useContext(NutritionContext)
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider')
  }
  return context
}

export default useNutrition
