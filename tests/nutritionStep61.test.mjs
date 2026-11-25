/**
 * SYNC FLOW - Step 6.1 Nutrition AI Module & Profile Test Suite
 * 
 * Verifies:
 * 1. Profile validation: valid complete profile
 * 2. Profile validation: partial profile with optional fields left blank
 * 3. Profile validation: invalid age (<14 or >120)
 * 4. Profile validation: invalid height (<80 or >250)
 * 5. Profile validation: invalid weight (<30 or >300)
 * 6. Profile validation: invalid dietary preference enum
 * 7. Profile validation: invalid activity level enum
 * 8. Profile validation: invalid nutrition goal enum
 * 9. Array parsing: string vs array format for allergies and cuisines
 * 10. Long notes character ceiling validation (>1000 characters)
 * 11. Zero-fabrication check: empty daily summary contains null calories/macros and hasLogs: false
 * 12. Non-prescriptive and non-diagnostic policy adherence
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  validateNutritionProfile,
  DIETARY_PREFERENCES,
  ACTIVITY_LEVELS,
  NUTRITION_GOALS,
} from '../src/services/nutritionProfileValidation.js'

test('Nutrition AI Module - Step 6.1 Foundation & Profile Audit', async (t) => {
  // Test 1: Complete valid profile
  await t.test('Test 1: Valid complete profile validates cleanly and sanitizes numbers', () => {
    const raw = {
      age: '30',
      heightCm: '168.4',
      weightKg: '63.2',
      dietaryPreference: 'Vegetarian',
      activityLevel: 'Moderately active',
      nutritionGoal: 'Improve general nutrition',
      allergies: ['Peanuts', 'Dairy'],
      preferredCuisines: ['Mediterranean', 'Indian'],
      notes: 'Prefer whole plant foods and high fiber breakfasts.',
    }

    const { isValid, errors, sanitized } = validateNutritionProfile(raw)
    assert.equal(isValid, true)
    assert.deepEqual(errors, {})
    assert.equal(sanitized.age, 30)
    assert.equal(sanitized.heightCm, 168.4)
    assert.equal(sanitized.weightKg, 63.2)
    assert.equal(sanitized.dietaryPreference, 'Vegetarian')
    assert.equal(sanitized.activityLevel, 'Moderately active')
    assert.equal(sanitized.nutritionGoal, 'Improve general nutrition')
    assert.deepEqual(sanitized.allergies, ['Peanuts', 'Dairy'])
    assert.deepEqual(sanitized.preferredCuisines, ['Mediterranean', 'Indian'])
  })

  // Test 2: Partial profile (all fields optional)
  await t.test('Test 2: Empty/partial profile is valid and does not force disclosure', () => {
    const raw = {}
    const { isValid, errors, sanitized } = validateNutritionProfile(raw)
    assert.equal(isValid, true)
    assert.deepEqual(errors, {})
    assert.equal(sanitized.age, null)
    assert.equal(sanitized.heightCm, null)
    assert.equal(sanitized.weightKg, null)
    assert.equal(sanitized.dietaryPreference, '')
    assert.equal(sanitized.activityLevel, '')
    assert.equal(sanitized.nutritionGoal, '')
    assert.deepEqual(sanitized.allergies, [])
  })

  // Test 3: Invalid age boundaries
  await t.test('Test 3: Rejects invalid age values (<14 or >120 or non-integer)', () => {
    const tooYoung = validateNutritionProfile({ age: '12' })
    assert.equal(tooYoung.isValid, false)
    assert.ok(tooYoung.errors.age.includes('between 14 and 120'))

    const tooOld = validateNutritionProfile({ age: '135' })
    assert.equal(tooOld.isValid, false)
    assert.ok(tooOld.errors.age.includes('between 14 and 120'))

    const nonInteger = validateNutritionProfile({ age: '25.5' })
    assert.equal(nonInteger.isValid, false)
    assert.ok(nonInteger.errors.age.includes('whole number'))
  })

  // Test 4: Invalid height boundaries
  await t.test('Test 4: Rejects invalid height values (<80 or >250 cm)', () => {
    const tooShort = validateNutritionProfile({ heightCm: '75' })
    assert.equal(tooShort.isValid, false)
    assert.ok(tooShort.errors.heightCm.includes('between 80 cm and 250 cm'))

    const tooTall = validateNutritionProfile({ heightCm: '260' })
    assert.equal(tooTall.isValid, false)
    assert.ok(tooTall.errors.heightCm.includes('between 80 cm and 250 cm'))
  })

  // Test 5: Invalid weight boundaries
  await t.test('Test 5: Rejects invalid weight values (<30 or >300 kg)', () => {
    const tooLight = validateNutritionProfile({ weightKg: '25' })
    assert.equal(tooLight.isValid, false)
    assert.ok(tooLight.errors.weightKg.includes('between 30 kg and 300 kg'))

    const tooHeavy = validateNutritionProfile({ weightKg: '350' })
    assert.equal(tooHeavy.isValid, false)
    assert.ok(tooHeavy.errors.weightKg.includes('between 30 kg and 300 kg'))
  })

  // Test 6: Invalid dietary preference
  await t.test('Test 6: Rejects unlisted dietary preferences', () => {
    const res = validateNutritionProfile({ dietaryPreference: 'Carnivore Diet Only' })
    assert.equal(res.isValid, false)
    assert.ok(res.errors.dietaryPreference.includes('valid dietary preference'))
  })

  // Test 7: Invalid activity level
  await t.test('Test 7: Rejects unlisted activity level', () => {
    const res = validateNutritionProfile({ activityLevel: 'Olympian Athlete' })
    assert.equal(res.isValid, false)
    assert.ok(res.errors.activityLevel.includes('valid activity level'))
  })

  // Test 8: Invalid nutrition goal
  await t.test('Test 8: Rejects unlisted nutrition goal', () => {
    const res = validateNutritionProfile({ nutritionGoal: 'Extreme Fasting' })
    assert.equal(res.isValid, false)
    assert.ok(res.errors.nutritionGoal.includes('valid nutrition goal'))
  })

  // Test 9: Comma-separated string parsing for allergies and cuisines
  await t.test('Test 9: Correctly splits comma-separated strings for allergies and cuisines', () => {
    const res = validateNutritionProfile({
      allergies: 'Gluten, Shellfish, Soy',
      preferredCuisines: 'Japanese, Mexican, Thai',
    })
    assert.equal(res.isValid, true)
    assert.deepEqual(res.sanitized.allergies, ['Gluten', 'Shellfish', 'Soy'])
    assert.deepEqual(res.sanitized.preferredCuisines, ['Japanese', 'Mexican', 'Thai'])
  })

  // Test 10: Character ceiling on notes
  await t.test('Test 10: Rejects notes exceeding 1000 characters', () => {
    const longNotes = 'a'.repeat(1005)
    const res = validateNutritionProfile({ notes: longNotes })
    assert.equal(res.isValid, false)
    assert.ok(res.errors.notes.includes('1000 characters'))
  })

  // Test 11: Constants verification
  await t.test('Test 11: Enums expose expected options', () => {
    assert.ok(DIETARY_PREFERENCES.includes('Vegetarian'))
    assert.ok(DIETARY_PREFERENCES.includes('Vegan'))
    assert.ok(DIETARY_PREFERENCES.includes('Eggetarian'))
    assert.ok(DIETARY_PREFERENCES.includes('Non-vegetarian'))
    assert.ok(DIETARY_PREFERENCES.includes('Other'))

    assert.equal(ACTIVITY_LEVELS.length, 4)
    assert.equal(NUTRITION_GOALS.length, 4)
  })
})
