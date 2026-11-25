import {
  CalendarCheck,
  ScanLine,
  History,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import NutritionNavigation from '../../../components/nutrition/NutritionNavigation'

export function MealPlannerPlaceholder() {
  return (
    <PageContainer
      title="Meal Planner"
      subtitle="Personalized, evidence-informed meal suggestions aligned with your self-reported dietary preferences"
      badge={
        <Badge variant="purple" size="md">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>Nutrition AI Module</span>
        </Badge>
      }
    >
      <NutritionNavigation />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-2xs">
            <CalendarCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Scheduled for Step 6.2
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-3">
              Interactive Meal Planner Coming Soon
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
              In upcoming development steps, the Meal Planner will generate daily nutrient ideas, recipe suggestions, and macro targets strictly tailored to your personal Nutrition Profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-xs text-slate-500 flex items-start gap-2.5 text-left">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              Get ready by setting up your Nutrition Profile now. Your dietary preferences, food allergies, and vitality goals will directly guide meal suggestions.
            </span>
          </div>

          <div className="pt-2">
            <Link
              to="/employee/nutrition/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
            >
              <span>Set Up Nutrition Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export function FoodScannerPlaceholder() {
  return (
    <PageContainer
      title="Food Scanner & Macro Estimation"
      subtitle="Visual nutritional breakdowns and ingredient identification co-pilot"
      badge={
        <Badge variant="purple" size="md">
          <ScanLine className="w-3 h-3 text-purple-600" />
          <span>Vision & Analysis</span>
        </Badge>
      }
    >
      <NutritionNavigation />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
            <ScanLine className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Scheduled for Step 6.3
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-3">
              Food Scanner & Meal Analysis Tooling
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
              The camera-based scanner and text meal analyzer will allow you to quickly log meals, estimate macronutrients, and verify dietary allergens in your food.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-xs text-slate-500 flex items-start gap-2.5 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All nutrition scans and food entries are completely confidential to you and stored only in your session memory.
            </span>
          </div>

          <div className="pt-2">
            <Link
              to="/employee/nutrition"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Back to Nutrition Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export function NutritionHistoryPlaceholder() {
  return (
    <PageContainer
      title="Nutrition History & Logs"
      subtitle="Historical timeline of logged meals, daily calorie consumption, and hydration pacing"
      badge={
        <Badge variant="purple" size="md">
          <History className="w-3 h-3 text-purple-600" />
          <span>Personal Logs</span>
        </Badge>
      }
    >
      <NutritionNavigation />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
            <History className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Session-Only Log Storage
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-3">
              No Historical Meal Records Yet
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
              SYNC FLOW maintains zero fabricated meal logs. Once meal tracking is completed in the next stage, your logged daily foods and hydration entries will be displayed here in chronological order.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/employee/nutrition/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
            >
              <span>Configure Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
