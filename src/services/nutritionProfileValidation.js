/**
 * SYNC FLOW - Nutrition Profile Validation Service
 * 
 * Validates self-reported employee nutrition profile attributes.
 * 
 * Rules:
 * - Age, height, weight are optional; when provided, must fall in physiological ranges.
 * - Dietary preferences, activity levels, and nutrition goals must match valid options if provided.
 * - Sensitive information is never forced; all fields can be skipped or left blank.
 * - Does not make medical or dietary suitability claims.
 */

export const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Eggetarian',
  'Non-vegetarian',
  'Other',
]

export const ACTIVITY_LEVELS = [
  {
    key: 'Sedentary',
    label: 'Sedentary',
    description: 'Desk-focused work with little to no deliberate physical exercise',
  },
  {
    key: 'Lightly active',
    label: 'Lightly active',
    description: 'Light daily movement or intentional exercise 1-3 days per week',
  },
  {
    key: 'Moderately active',
    label: 'Moderately active',
    description: 'Moderate physical exercise or sports 3-5 days per week',
  },
  {
    key: 'Very active',
    label: 'Very active',
    description: 'Vigorous daily physical training, sports, or physical job activity',
  },
]

export const NUTRITION_GOALS = [
  {
    key: 'Maintain weight',
    label: 'Maintain weight',
    description: 'Nourish energy and maintain current body equilibrium',
  },
  {
    key: 'Improve general nutrition',
    label: 'Improve general nutrition',
    description: 'Focus on balanced micronutrients, whole foods, and vitality',
  },
  {
    key: 'Weight management',
    label: 'Weight management',
    description: 'Mindful, balanced portioning and metabolic support',
  },
  {
    key: 'Build muscle',
    label: 'Build muscle',
    description: 'Support muscular strength with adequate protein and fuel',
  },
]

/**
 * Validates a nutrition profile payload
 * 
 * @param {object} profileData - Raw user input
 * @returns {object} { isValid: boolean, errors: object, sanitized: object }
 */
export function validateNutritionProfile(profileData = {}) {
  const errors = {}
  const sanitized = {
    age: null,
    heightCm: null,
    weightKg: null,
    dietaryPreference: '',
    activityLevel: '',
    nutritionGoal: '',
    allergies: [],
    preferredCuisines: [],
    notes: '',
  }

  // 1. Age (Optional, 14 - 120)
  if (profileData.age !== undefined && profileData.age !== null && String(profileData.age).trim() !== '') {
    const ageNum = Number(profileData.age)
    if (isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 14 || ageNum > 120) {
      errors.age = 'Age must be a valid whole number between 14 and 120 years.'
    } else {
      sanitized.age = ageNum
    }
  }

  // 2. Height (Optional, 80 - 250 cm)
  if (profileData.heightCm !== undefined && profileData.heightCm !== null && String(profileData.heightCm).trim() !== '') {
    const hNum = Number(profileData.heightCm)
    if (isNaN(hNum) || hNum < 80 || hNum > 250) {
      errors.heightCm = 'Height must be between 80 cm and 250 cm.'
    } else {
      sanitized.heightCm = Math.round(hNum * 10) / 10
    }
  }

  // 3. Weight (Optional, 30 - 300 kg)
  if (profileData.weightKg !== undefined && profileData.weightKg !== null && String(profileData.weightKg).trim() !== '') {
    const wNum = Number(profileData.weightKg)
    if (isNaN(wNum) || wNum < 30 || wNum > 300) {
      errors.weightKg = 'Weight must be between 30 kg and 300 kg.'
    } else {
      sanitized.weightKg = Math.round(wNum * 10) / 10
    }
  }

  // 4. Dietary Preference (Optional, enum)
  if (profileData.dietaryPreference) {
    const pref = String(profileData.dietaryPreference).trim()
    if (pref && !DIETARY_PREFERENCES.includes(pref)) {
      errors.dietaryPreference = `Please select a valid dietary preference (${DIETARY_PREFERENCES.join(', ')}).`
    } else {
      sanitized.dietaryPreference = pref
    }
  }

  // 5. Activity Level (Optional, enum)
  if (profileData.activityLevel) {
    const act = String(profileData.activityLevel).trim()
    const validActKeys = ACTIVITY_LEVELS.map((a) => a.key)
    if (act && !validActKeys.includes(act)) {
      errors.activityLevel = 'Please select a valid activity level option.'
    } else {
      sanitized.activityLevel = act
    }
  }

  // 6. Nutrition Goal (Optional, enum)
  if (profileData.nutritionGoal) {
    const goal = String(profileData.nutritionGoal).trim()
    const validGoalKeys = NUTRITION_GOALS.map((g) => g.key)
    if (goal && !validGoalKeys.includes(goal)) {
      errors.nutritionGoal = 'Please select a valid nutrition goal option.'
    } else {
      sanitized.nutritionGoal = goal
    }
  }

  // 7. Allergies / Restrictions (Optional array or comma-separated string)
  if (profileData.allergies) {
    if (Array.isArray(profileData.allergies)) {
      sanitized.allergies = profileData.allergies.map((a) => String(a).trim()).filter(Boolean)
    } else if (typeof profileData.allergies === 'string') {
      sanitized.allergies = profileData.allergies.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }

  // 8. Preferred Cuisines (Optional array or comma-separated string)
  if (profileData.preferredCuisines) {
    if (Array.isArray(profileData.preferredCuisines)) {
      sanitized.preferredCuisines = profileData.preferredCuisines.map((c) => String(c).trim()).filter(Boolean)
    } else if (typeof profileData.preferredCuisines === 'string') {
      sanitized.preferredCuisines = profileData.preferredCuisines.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }

  // 9. Notes (Optional string, max 1000 characters)
  if (profileData.notes) {
    const n = String(profileData.notes).trim()
    if (n.length > 1000) {
      errors.notes = 'Personal notes cannot exceed 1000 characters.'
    } else {
      sanitized.notes = n
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}
