import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info,
  Apple,
  Save,
  ArrowRight,
  Plus,
  X
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import NutritionNavigation from '../../../components/nutrition/NutritionNavigation'
import { useNutrition } from '../../../context/useNutrition'
import {
  DIETARY_PREFERENCES,
  ACTIVITY_LEVELS,
  NUTRITION_GOALS,
} from '../../../services/nutritionProfileValidation'

export default function NutritionProfile() {
  const { profile, saveProfile, resetProfile } = useNutrition()

  // Form State
  const [age, setAge] = useState(() => (profile.age !== null ? String(profile.age) : ''))
  const [heightCm, setHeightCm] = useState(() => (profile.heightCm !== null ? String(profile.heightCm) : ''))
  const [weightKg, setWeightKg] = useState(() => (profile.weightKg !== null ? String(profile.weightKg) : ''))
  const [dietaryPreference, setDietaryPreference] = useState(() => profile.dietaryPreference || '')
  const [activityLevel, setActivityLevel] = useState(() => profile.activityLevel || '')
  const [nutritionGoal, setNutritionGoal] = useState(() => profile.nutritionGoal || '')
  
  // Array items: Allergies & Preferred Cuisines
  const [allergies, setAllergies] = useState(() => profile.allergies || [])
  const [newAllergy, setNewAllergy] = useState('')
  
  const [preferredCuisines, setPreferredCuisines] = useState(() => profile.preferredCuisines || [])
  const [newCuisine, setNewCuisine] = useState('')

  const [notes, setNotes] = useState(() => profile.notes || '')
  
  const [errors, setErrors] = useState({})
  const [isSaved, setIsSaved] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Allergen Tag Handlers
  const handleAddAllergy = (e) => {
    e.preventDefault()
    const trimmed = newAllergy.trim()
    if (!trimmed) return
    if (!allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed])
    }
    setNewAllergy('')
  }

  const handleRemoveAllergy = (itemToRemove) => {
    setAllergies(allergies.filter((a) => a !== itemToRemove))
  }

  // Cuisine Tag Handlers
  const handleAddCuisine = (e) => {
    e.preventDefault()
    const trimmed = newCuisine.trim()
    if (!trimmed) return
    if (!preferredCuisines.includes(trimmed)) {
      setPreferredCuisines([...preferredCuisines, trimmed])
    }
    setNewCuisine('')
  }

  const handleRemoveCuisine = (itemToRemove) => {
    setPreferredCuisines(preferredCuisines.filter((c) => c !== itemToRemove))
  }

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaved(false)
    setErrors({})

    const payload = {
      age,
      heightCm,
      weightKg,
      dietaryPreference,
      activityLevel,
      nutritionGoal,
      allergies,
      preferredCuisines,
      notes,
    }

    const result = saveProfile(payload)
    if (!result.success) {
      setErrors(result.errors || {})
      return
    }

    setIsSaved(true)
  }

  const handleReset = () => {
    resetProfile()
    setAge('')
    setHeightCm('')
    setWeightKg('')
    setDietaryPreference('')
    setActivityLevel('')
    setNutritionGoal('')
    setAllergies([])
    setNewAllergy('')
    setPreferredCuisines([])
    setNewCuisine('')
    setNotes('')
    setErrors({})
    setIsSaved(false)
    setIsResetConfirmOpen(false)
  }

  return (
    <PageContainer
      title="Personal Nutrition Profile"
      subtitle="Configure your dietary habits, activity levels, and vitality preferences with employee-controlled privacy"
      badge={
        <Badge variant="purple" size="md">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          {profile.isConfigured && (
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Profile</span>
            </button>
          )}
          <Link
            to="/employee/nutrition"
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Back to Overview</span>
          </Link>
        </div>
      }
    >
      <NutritionNavigation />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Temporary Session Notice */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="font-semibold">Session Interaction Mode:</strong> Nutrition profile attributes configured here are retained in memory for your current session. Data is private to you and never shared with Team Leaders or Admins.
            </p>
            <p className="text-[11px] text-purple-800/80">
              Non-prescriptive: Profile settings provide baseline context for upcoming recipe ideas and do not make clinical dietary suitability claims.
            </p>
          </div>
        </div>

        {/* Save Confirmation Banner */}
        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-sm block">Nutrition Profile Updated Successfully</span>
                <span className="text-emerald-700">Your preferences are active for your current session.</span>
              </div>
            </div>
            <Link
              to="/employee/nutrition"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
            >
              <span>View Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
          {/* Section 1: Physical Baseline Metrics (Optional) */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Physical Baseline Attributes</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Optional indicators to calibrate caloric metabolic baseline estimates.
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">All fields optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age (Years) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="14"
                  max="120"
                  placeholder="e.g. 29"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                    errors.age ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-rose-600 mt-1">{errors.age}</p>}
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Height (cm) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="80"
                  max="250"
                  step="0.5"
                  placeholder="e.g. 168"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                    errors.heightCm ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
                {errors.heightCm && <p className="text-[11px] text-rose-600 mt-1">{errors.heightCm}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="0.5"
                  placeholder="e.g. 62"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                    errors.weightKg ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
                {errors.weightKg && <p className="text-[11px] text-rose-600 mt-1">{errors.weightKg}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Dietary Preference */}
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Apple className="w-4 h-4 text-purple-600" />
                <span>Dietary Preference</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your general lifestyle eating pattern to filter recipe recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {DIETARY_PREFERENCES.map((pref) => {
                const isSelected = dietaryPreference === pref
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setDietaryPreference(isSelected ? '' : pref)}
                    className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-purple-300 hover:bg-purple-50/40'
                    }`}
                  >
                    {pref}
                  </button>
                )
              })}
            </div>
            {errors.dietaryPreference && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.dietaryPreference}</p>
            )}
          </div>

          {/* Section 3: Activity Level */}
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Physical Activity Level</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reflects your typical weekly movement expenditure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTIVITY_LEVELS.map((act) => {
                const isSelected = activityLevel === act.key
                return (
                  <button
                    key={act.key}
                    type="button"
                    onClick={() => setActivityLevel(isSelected ? '' : act.key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-500 text-purple-950 ring-1 ring-purple-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{act.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </button>
                )
              })}
            </div>
            {errors.activityLevel && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.activityLevel}</p>
            )}
          </div>

          {/* Section 4: Nutrition Goal */}
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Primary Nutrition Goal</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aligns macronutrient suggestions with your personal objective.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NUTRITION_GOALS.map((goal) => {
                const isSelected = nutritionGoal === goal.key
                return (
                  <button
                    key={goal.key}
                    type="button"
                    onClick={() => setNutritionGoal(isSelected ? '' : goal.key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-500 text-purple-950 ring-1 ring-purple-500 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{goal.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {goal.description}
                    </p>
                  </button>
                )
              })}
            </div>
            {errors.nutritionGoal && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.nutritionGoal}</p>
            )}
          </div>

          {/* Section 5: Allergies & Preferred Cuisines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Allergies */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Food Allergies or Restrictions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Gluten, Peanuts, Dairy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddAllergy(e)
                    }
                  }}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
                  title="Add restriction"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {allergies.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(item)}
                      className="hover:text-rose-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Cuisines */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Preferred Cuisines <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mediterranean, Japanese, Mexican"
                  value={newCuisine}
                  onChange={(e) => setNewCuisine(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCuisine(e)
                    }
                  }}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddCuisine}
                  className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
                  title="Add cuisine"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {preferredCuisines.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-medium"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCuisine(item)}
                      className="hover:text-teal-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Additional Personal Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Additional Notes or Preferences <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Prefer high-fiber breakfasts; avoid caffeine after 3 PM; sensitive to ultra-processed sugars."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-purple-600"
            />
            {errors.notes && <p className="text-[11px] text-rose-600 mt-1">{errors.notes}</p>}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Changes apply immediately to your active session.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Nutrition Profile</span>
            </button>
          </div>
        </form>

        {/* Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h4 className="text-base font-bold text-slate-900">Reset Nutrition Profile?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will clear all self-reported profile preferences, dietary choices, and session metrics back to an unconfigured state.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
