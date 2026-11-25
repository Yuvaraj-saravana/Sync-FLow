import { Link } from 'react-router-dom'
import {
  MoonStar,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react'
import Badge from '../common/Badge'

export default function CycleStatusCard({ cycleSummary, onOpenPeriodModal }) {
  const isConfigured = Boolean(cycleSummary?.isConfigured && cycleSummary?.latestPeriodStart)
  const phaseInfo = cycleSummary?.phaseInfo
  const currentCycleDay = cycleSummary?.currentCycleDay

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
              Welcome to Your Personal Cycle Profile
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              No cycle information has been recorded yet. Cycle tracking is completely voluntary and confidential. Setting up your profile or logging your latest period allows you to view non-diagnostic phase estimates and track personal wellness trends over time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onOpenPeriodModal && (
                <button
                  type="button"
                  onClick={onOpenPeriodModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Record Period</span>
                </button>
              )}

              <Link
                to="/employee/cycle/settings"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <span>Set Up Cycle Profile</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-72 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>How We Handle Your Data:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-500">
              <li>No default 28-day assumptions</li>
              <li>Zero employer or manager visibility</li>
              <li>Never used for task assignments</li>
              <li>All phase estimates are non-medical</li>
            </ul>
          </div>
        </div>
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

            <Badge variant={phaseInfo?.badge || 'purple'} size="md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{phaseInfo?.name || 'Cycle Active'}</span>
            </Badge>

            {cycleSummary.isIrregular && (
              <Badge variant="amber" size="sm">
                Irregular Cycle
              </Badge>
            )}

            <span className="text-xs font-semibold text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              Last Recorded Start: {cycleSummary.latestPeriodStart}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Cycle Day {currentCycleDay || '—'}
              </h2>
              {cycleSummary.effectiveCycleLength && (
                <span className="text-xs text-slate-500 font-medium">
                  of ~{cycleSummary.effectiveCycleLength}-day cycle
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {phaseInfo?.description || 'Track your symptoms and physical comfort daily to build personal trend insights.'}
            </p>
          </div>

          {/* Estimates & Indicators */}
          <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
            {cycleSummary.estimatedNextPeriod ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  Estimated Next Period: <strong>{cycleSummary.estimatedNextPeriod}</strong>
                  {cycleSummary.daysUntilNext !== null && (
                    <span className="text-slate-500 font-normal ml-1">
                      ({cycleSummary.daysUntilNext > 0 ? `~${cycleSummary.daysUntilNext} days away` : 'expected today'})
                    </span>
                  )}
                </span>
              </div>
            ) : cycleSummary.isIrregular ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Next period estimation paused (Irregular cycle)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Next period calculable after entering average cycle length</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50/50 border border-purple-100 text-purple-800">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Private to Employee</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
          {onOpenPeriodModal && (
            <button
              type="button"
              onClick={onOpenPeriodModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Period</span>
            </button>
          )}

          <Link
            to="/employee/cycle/check-in"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Daily Check-in</span>
          </Link>

          <Link
            to="/employee/cycle/calendar"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Open Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
