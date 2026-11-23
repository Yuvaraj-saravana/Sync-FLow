import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Shield,
  MoonStar,
  Users,
  Activity,
  Heart,
  Lock,
  ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-900 flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white flex items-center justify-center shadow-sm shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                SYNC FLOW
              </span>
              <span className="text-[10px] font-semibold text-purple-700 tracking-wider uppercase block">
                Enterprise Wellness
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-purple-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl shadow-xs shadow-purple-600/30 transition-all hover:shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Personal AI Wellness & Modern Workplace Productivity</span>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
              Every Phase Has Power.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-rose-600">
                Every Woman Has Strength.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SYNC FLOW provides personal cycle and wellness insights kept strictly confidential to each employee, while organizing workplace tasks by project deliverables, deadlines, and employee-selected availability.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/employee/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-sm shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Explore Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/leader/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-all hover:scale-[1.02]"
              >
                <span>Team Leader Hub</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all hover:scale-[1.02]"
              >
                <span>Admin Console</span>
              </Link>
            </div>

            {/* Trust & Privacy Pill */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" /> Employee-Controlled Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Strict Role Boundaries
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" /> Evidence-Informed Wellness
              </span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-white border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Built for High-Performing Teams & Empowered Women
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                A unified platform combining biological self-awareness, project task clarity, and organizational empathy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#fcfbfe] border border-purple-100 hover:border-purple-200 transition-all shadow-2xs hover:shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center mb-4">
                  <MoonStar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Personal Cycle Insights
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Private bio-rhythmic self-awareness across menstrual, follicular, ovulatory, and luteal phases. Kept strictly confidential and never used to assign or prioritize workplace tasks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#fcfbfe] border border-rose-100 hover:border-rose-200 transition-all shadow-2xs hover:shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Personalized Nutrition & Movement
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Evidence-informed nutrient ideas, hydration goals, and mobility routines designed for desk comfort and personal energy pacing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#fcfbfe] border border-teal-100 hover:border-teal-200 transition-all shadow-2xs hover:shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Privacy-First Team Harmony
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Leaders receive aggregated workload and availability details explicitly shared by employees. Personal health information is never visible to management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SYNC FLOW Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium text-slate-600">
            <Link to="/employee/privacy" className="hover:text-purple-700">Privacy & Consent</Link>
            <Link to="/employee/settings" className="hover:text-purple-700">Terms of Service</Link>
            <Link to="/admin/security" className="hover:text-purple-700">Security Architecture</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
