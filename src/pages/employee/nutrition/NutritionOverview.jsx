import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Apple,
  Droplets,
  CalendarCheck,
  ScanLine,
  History,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Info,
  User,
  CheckCircle2
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import NutritionNavigation from '../../../components/nutrition/NutritionNavigation'
import { useNutrition } from '../../../context/useNutrition'

export default function NutritionOverview() {
  const { profile, dailySummary, logHydration } = useNutrition()
  const [showHydrationSuccess, setShowHydrationSuccess] = useState(false)

  const handleQuickHydration = (amount) => {
    logHydration(amount)
    setShowHydrationSuccess(true)
    setTimeout(() => setShowHydrationSuccess(false), 2000)
  }

  return (
    <PageContainer
      title="Nutritional Wellness & Meal Planning"
      subtitle="Personalized, evidence-informed metabolic fuel, hydration targets, and self-guided nutrition planning"
      badge={
        <Badge variant="purple" size="md">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/employee/nutrition/profile"
            className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>{profile.isConfigured ? 'Edit Nutrition Profile' : 'Set Up Profile'}</span>
          </Link>
        </div>
      }
    >
      <NutritionNavigation />

      <div className="space-y-6">
        {/* Row 1: Profile Status Banner */}
        {!profile.isConfigured ? (
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Nutrition Profile Unconfigured</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                    Setup Required
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                  Configure your dietary preference, daily activity level, and vitality goals to unlock tailored calorie estimates, recipe recommendations, and allergen filters.
                </p>
              </div>
            </div>

            <Link
              to="/employee/nutrition/profile"
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Configure Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Nutrition Profile Active</span>
                  <Badge variant="sage" size="sm">Session Active</Badge>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Preference: <strong className="text-slate-700">{profile.dietaryPreference || 'General'}</strong> · Activity: <strong className="text-slate-700">{profile.activityLevel || 'Not specified'}</strong> · Goal: <strong className="text-slate-700">{profile.nutritionGoal || 'Maintain'}</strong>
                </p>
              </div>
            </div>

            <Link
              to="/employee/nutrition/profile"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline shrink-0"
            >
              Update Preferences →
            </Link>
          </div>
        )}

        {/* Row 2: Daily Nutrition & Calorie Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Calorie Intake Summary (Displayed only when actual session logs exist; otherwise clean empty state) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Daily Caloric Energy</h3>
                    <p className="text-[11px] text-slate-400">Actual Session Intake</p>
                  </div>
                </div>
                <Badge variant={dailySummary.hasLogs ? 'amber' : 'slate'} size="sm">
                  {dailySummary.hasLogs ? 'Logged' : 'No Data'}
                </Badge>
              </div>

              {dailySummary.hasLogs && dailySummary.calories !== null ? (
                <div className="py-6 space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {dailySummary.calories}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">kcal consumed</span>
                    {dailySummary.targetCalories && (
                      <p className="text-xs text-slate-400 mt-1">
                        Target: {dailySummary.targetCalories} kcal
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Apple className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700">No Meals Logged Today</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    SYNC FLOW never displays fabricated calorie intake. Log your meals in upcoming Step 6.2 to view your daily caloric energy balance.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Zero-Fabrication Metric</span>
              <span>Session In-Memory</span>
            </div>
          </div>

          {/* Card 2: Macronutrient Breakdown (Carbs, Protein, Fats) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Macronutrient Fuel</h3>
                    <p className="text-[11px] text-slate-400">Carbs · Protein · Healthy Fats</p>
                  </div>
                </div>
                <Badge variant={dailySummary.hasLogs ? 'purple' : 'slate'} size="sm">
                  {dailySummary.hasLogs ? 'Calculated' : 'Pending Logs'}
                </Badge>
              </div>

              {dailySummary.hasLogs && (dailySummary.carbsGrams || dailySummary.proteinGrams || dailySummary.fatGrams) ? (
                <div className="py-4 space-y-3">
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Carbohydrates</span>
                      <span className="font-bold text-slate-900">{dailySummary.carbsGrams || 0}g</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Protein</span>
                      <span className="font-bold text-slate-900">{dailySummary.proteinGrams || 0}g</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  {/* Fat */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Fats</span>
                      <span className="font-bold text-slate-900">{dailySummary.fatGrams || 0}g</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700">No Macronutrient Records</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Macronutrient distributions will automatically calculate when foods are logged or scanned.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Metabolic Fuel Pacing</span>
              <span>Non-Diagnostic</span>
            </div>
          </div>

          {/* Card 3: Hydration Tracking Entry Point */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Hydration Pacing</h3>
                    <p className="text-[11px] text-slate-400">Daily Water Consumption</p>
                  </div>
                </div>
                <Badge variant={dailySummary.hydrationLiters ? 'teal' : 'slate'} size="sm">
                  {dailySummary.hydrationLiters ? 'Active' : 'Unlogged'}
                </Badge>
              </div>

              <div className="py-4 space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-teal-700">
                    {dailySummary.hydrationLiters !== null ? dailySummary.hydrationLiters : '0.0'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    / {dailySummary.targetHydrationLiters || 2.5} L
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Recommended daily target for cellular hydration
                  </p>
                </div>

                {/* Quick Add Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                    Quick Log Water
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickHydration(0.25)}
                      className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                    >
                      +250 ml
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickHydration(0.5)}
                      className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                    >
                      +500 ml
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickHydration(0.75)}
                      className="py-1.5 px-2 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                    >
                      +750 ml
                    </button>
                  </div>
                </div>

                {showHydrationSuccess && (
                  <p className="text-center text-[11px] text-teal-700 font-bold animate-pulse">
                    Water logged to current session!
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Cellular Hydration</span>
              <span>Session Log</span>
            </div>
          </div>
        </div>

        {/* Row 3: Module Feature Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Entry Point 1: Meal Planner */}
          <Link
            to="/employee/nutrition/meal-planner"
            className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between group text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Step 6.2
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Meal Planner Co-Pilot
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Evidence-informed meal schedules and recipe ideas tailored to your profile goals and energy rhythms.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Explore Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Entry Point 2: Food Scanner */}
          <Link
            to="/employee/nutrition/food-scanner"
            className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between group text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 group-hover:scale-105 transition-transform">
                  <ScanLine className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Step 6.3
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Food Scanner & Analysis
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Smart ingredient recognition, macronutrient breakdown, and allergen cross-referencing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>View Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Entry Point 3: Nutrition History */}
          <Link
            to="/employee/nutrition/history"
            className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between group text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
                  <History className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Logs
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                Nutrition History & Trends
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Chronological log of recorded daily foods, hydration milestones, and self-guided dietary reflections.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Open History</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Row 4: Confidentiality & Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-start gap-3">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              Employee Privacy & Medical Boundary Policy:
            </p>
            <p className="leading-relaxed text-slate-500">
              Nutrition preferences, meal logs, and hydration counts remain completely private to your employee account and are never shared with Team Leaders or used for workplace task evaluations. Nutrition suggestions provide lifestyle awareness and do not replace personalized medical advice, clinical dietetics, or allergy management from a licensed physician.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
