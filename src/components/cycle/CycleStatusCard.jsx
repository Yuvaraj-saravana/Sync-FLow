import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MoonStar,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  PlusCircle,
  HelpCircle
} from 'lucide-react'
import Badge from '../common/Badge'

export default function CycleStatusCard({ profile, onConfigure }) {
  const [showQuickSetup, setShowQuickSetup] = useState(false)
  const [setupDate, setSetupDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [now] = useState(() => Date.now())

  const isConfigured = Boolean(profile?.isConfigured && profile?.lastPeriodStart)

  const handleQuickSetupSubmit = (e) => {
    e.preventDefault()
    if (!setupDate) return
    if (onConfigure) {
      onConfigure({
        lastPeriodStart: setupDate,
        cycleLengthDays: Number(cycleLength) || 28,
        periodLengthDays: 5,
      })
    }
    setShowQuickSetup(false)
  }

  // Calculate cycle estimates when valid recorded date exists
  let currentCycleDay = null
  let estimatedPhase = null
  let estimatedNextPeriod = null

  if (isConfigured && profile.lastPeriodStart) {
    const start = new Date(profile.lastPeriodStart)
    const diffTime = now - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1

    if (diffDays >= 1 && diffDays <= 60) {
      currentCycleDay = diffDays
      const cycleLen = profile.cycleLengthDays || 28

      // Estimated phase calculation
      if (diffDays <= (profile.periodLengthDays || 5)) {
        estimatedPhase = {
          name: 'Menstrual Phase (Estimated)',
          description: 'Restorative phase. Energy and physical comfort may fluctuate.',
          badge: 'rose',
        }
      } else if (diffDays < Math.floor(cycleLen / 2) - 1) {
        estimatedPhase = {
          name: 'Follicular Phase (Estimated)',
          description: 'Energy and verbal fluency often gradually rise during this window.',
          badge: 'purple',
        }
      } else if (diffDays <= Math.floor(cycleLen / 2) + 2) {
        estimatedPhase = {
          name: 'Ovulatory Phase (Estimated)',
          description: 'Mid-cycle window. Estrogen peaks before transition.',
          badge: 'teal',
        }
      } else {
        estimatedPhase = {
          name: 'Luteal Phase (Estimated)',
          description: 'Post-ovulatory window. Rest and ergonomic pacing recommended.',
          badge: 'amber',
        }
      }

      // Estimated next period date
      const nextDate = new Date(start)
      nextDate.setDate(start.getDate() + cycleLen)
      estimatedNextPeriod = nextDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  // 1. UNCONFIGURED / ONBOARDING STATE
  if (!isConfigured) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                <MoonStar className="w-5 h-5" />
              </span>
              <Badge variant="purple" size="md">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>Private to Employee</span>
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome to Your Cycle & Wellness Hub
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              No cycle information has been recorded yet. Cycle tracking is completely optional and strictly confidential. By setting up your baseline, you can view estimated cycle phases and track personal wellness trends over time.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowQuickSetup(!showQuickSetup)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showQuickSetup ? 'Cancel Setup' : 'Set Up Baseline Profile'}</span>
              </button>

              <Link
                to="/employee/cycle/settings"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <span>Cycle Settings</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-72 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>How We Handle Your Data:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-500">
              <li>Zero employer or manager visibility</li>
              <li>Never used for task assignments</li>
              <li>Estimated phases are mathematical guides</li>
              <li>No medical claims or diagnostic labels</li>
            </ul>
          </div>
        </div>

        {/* Quick Setup Form Drawer */}
        {showQuickSetup && (
          <form
            onSubmit={handleQuickSetupSubmit}
            className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-purple-50/40 p-4 rounded-xl border border-purple-100"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Day of Last Period
              </label>
              <input
                type="date"
                required
                value={setupDate}
                onChange={(e) => setSetupDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Typical Cycle Length (Days)
              </label>
              <input
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-2xs"
            >
              Save Baseline (Session)
            </button>
          </form>
        )}
      </div>
    )
  }

  // 2. CONFIGURED CYCLE STATUS
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Main Status Indicator */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
              <MoonStar className="w-5 h-5" />
            </span>
            <Badge variant={estimatedPhase?.badge || 'purple'} size="md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{estimatedPhase?.name || 'Cycle Active'}</span>
            </Badge>
            <span className="text-xs font-semibold text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              Recorded Start: {new Date(profile.lastPeriodStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Cycle Day {currentCycleDay || '—'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                of ~{profile.cycleLengthDays || 28}-day cycle
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {estimatedPhase?.description || 'Track your symptoms and physical comfort daily to build personal trend insights.'}
            </p>
          </div>

          {/* Estimates Card */}
          <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Estimated Next Period: <strong>{estimatedNextPeriod || 'Calculable after history'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50/50 border border-purple-100 text-purple-800">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Private to Employee</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
          <Link
            to="/employee/cycle/check-in"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Daily Wellness Check-in</span>
          </Link>

          <Link
            to="/employee/cycle/calendar"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Open Cycle Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
