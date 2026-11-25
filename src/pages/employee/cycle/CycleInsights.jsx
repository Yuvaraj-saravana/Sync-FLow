import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MoonStar,
  CheckCircle2,
  Lock,
  Info,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Smile,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  PlusCircle,
  FileText
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'
import {
  calculateCycleHistoryAnalytics,
  calculateDurationAnalytics,
  calculateWellnessAnalytics,
  calculateMonthlySummary,
  generatePersonalInsights
} from '../../../services/cycleAnalytics.js'

export default function CycleInsights() {
  const { profile, periods, checkIns } = useCycle()

  // Track selected month for monthly summary
  const [selectedMonthDate, setSelectedMonthDate] = useState(() => new Date())

  // Compute Analytics
  const cycleAnalytics = useMemo(() => {
    return calculateCycleHistoryAnalytics(periods, profile)
  }, [periods, profile])

  const durationAnalytics = useMemo(() => {
    return calculateDurationAnalytics(periods)
  }, [periods])

  const wellnessAnalytics = useMemo(() => {
    return calculateWellnessAnalytics(checkIns)
  }, [checkIns])

  const monthlySummary = useMemo(() => {
    const y = selectedMonthDate.getFullYear()
    const m = selectedMonthDate.getMonth()
    return calculateMonthlySummary(y, m, checkIns, periods)
  }, [selectedMonthDate, checkIns, periods])

  const personalInsights = useMemo(() => {
    return generatePersonalInsights({
      cycleAnalytics,
      durationAnalytics,
      wellnessAnalytics,
      profile,
    })
  }, [cycleAnalytics, durationAnalytics, wellnessAnalytics, profile])

  // Month navigation handlers
  const handlePrevMonth = () => {
    setSelectedMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleResetMonth = () => {
    const today = new Date()
    setSelectedMonthDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const selectedMonthName = selectedMonthDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <PageContainer
      title="Personal Cycle Insights & Wellness Trends"
      subtitle="Objective pattern analysis derived strictly from your self-reported logs"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/employee/cycle/history"
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Records</span>
          </Link>
          <Link
            to="/employee/cycle/check-in"
            className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Record Daily Entry</span>
          </Link>
        </div>
      }
    >
      <CycleNavigation />

      <div className="space-y-6">
        {/* Row 1: High-Level Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Cycle Baseline */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Cycle Interval
                </span>
                <Badge variant={cycleAnalytics.hasEnoughData ? 'purple' : 'slate'} size="sm">
                  {cycleAnalytics.hasEnoughData ? `${cycleAnalytics.validIntervalCount} Intervals` : 'Pending'}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {cycleAnalytics.averageInterval ? `~${cycleAnalytics.averageInterval} Days` : '—'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {cycleAnalytics.hasEnoughData
                ? `Range: ${cycleAnalytics.shortestInterval}–${cycleAnalytics.longestInterval} days`
                : 'Requires 2+ recorded period dates'}
            </p>
          </div>

          {/* Card 2: Menstrual Duration */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Average Flow Duration
                </span>
                <Badge variant={durationAnalytics.hasEnoughData ? 'rose' : 'slate'} size="sm">
                  {durationAnalytics.hasEnoughData ? `${durationAnalytics.completedPeriodsCount} Logged` : 'Pending'}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {durationAnalytics.averageDuration ? `~${durationAnalytics.averageDuration} Days` : '—'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {durationAnalytics.hasEnoughData
                ? `Range: ${durationAnalytics.shortestDuration}–${durationAnalytics.longestDuration} days`
                : 'Requires completed period with end date'}
            </p>
          </div>

          {/* Card 3: Rest & Sleep */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Average Sleep
                </span>
                <Badge variant={wellnessAnalytics.averageSleep ? 'teal' : 'slate'} size="sm">
                  {wellnessAnalytics.sleepTrend.length > 0 ? `${wellnessAnalytics.sleepTrend.length} Entries` : 'Pending'}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {wellnessAnalytics.averageSleep ? `${wellnessAnalytics.averageSleep} hrs` : '—'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {wellnessAnalytics.sleepRange
                ? `Range: ${wellnessAnalytics.sleepRange.min}–${wellnessAnalytics.sleepRange.max} hrs/night`
                : 'Log daily check-ins with sleep'}
            </p>
          </div>

          {/* Card 4: Check-in Consistency */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Wellness Entries
                </span>
                <Badge variant={wellnessAnalytics.totalCheckIns >= 3 ? 'sage' : 'purple'} size="sm">
                  {wellnessAnalytics.totalCheckIns >= 3 ? 'Consistent' : 'Establishing'}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {wellnessAnalytics.totalCheckIns} Total Logs
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {wellnessAnalytics.totalCheckIns > 0
                ? `Dominant mood: ${wellnessAnalytics.mostFrequentMood || 'Balanced'}`
                : 'Begin logging daily check-ins'}
            </p>
          </div>
        </div>

        {/* Row 2: Cycle Interval Trends & Period Duration Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Cycle Interval History */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Cycle Interval History</h3>
                    <p className="text-xs text-slate-500">Days elapsed between recorded period start dates</p>
                  </div>
                </div>
                <Badge variant={cycleAnalytics.hasEnoughData ? 'purple' : 'slate'} size="sm">
                  {cycleAnalytics.hasEnoughData ? 'Actual Records' : 'No History'}
                </Badge>
              </div>

              {cycleAnalytics.hasEnoughData ? (
                <div className="pt-4 space-y-4">
                  {/* Clean SVG Interval Bar Chart */}
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Interval (Days)</span>
                      <span className="font-semibold text-purple-700">
                        Average: {cycleAnalytics.averageInterval} Days
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {cycleAnalytics.intervals.map((item, idx) => {
                        const maxVal = Math.max(40, cycleAnalytics.longestInterval + 5)
                        const barWidthPercent = Math.min(100, Math.max(10, (item.days / maxVal) * 100))

                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 font-medium truncate max-w-xs">
                                Cycle {item.cycleIndex}: {item.from} → {item.to}
                              </span>
                              <span className="font-bold text-slate-900 shrink-0">
                                {item.days} days
                              </span>
                            </div>
                            <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${barWidthPercent}%` }}
                                className="h-full bg-purple-600 rounded-full transition-all"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Regularity Observation Banner */}
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{cycleAnalytics.regularityObservation}</span>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">
                    Insufficient Cycle History
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Cycle intervals are calculated between consecutive period start dates. No fictional or default 28-day intervals are generated.
                  </p>
                  <Link
                    to="/employee/cycle/history"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log Period Records</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Period Duration Trends */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Period Duration Trends</h3>
                    <p className="text-xs text-slate-500">Duration in days for completed menstrual flow records</p>
                  </div>
                </div>
                <Badge variant={durationAnalytics.hasEnoughData ? 'rose' : 'slate'} size="sm">
                  {durationAnalytics.hasEnoughData ? 'Completed' : 'No Completed Periods'}
                </Badge>
              </div>

              {durationAnalytics.hasEnoughData ? (
                <div className="pt-4 space-y-4">
                  {/* Clean SVG Duration Bar Chart */}
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Flow Duration (Days)</span>
                      <span className="font-semibold text-rose-700">
                        Average: {durationAnalytics.averageDuration} Days
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {durationAnalytics.durations.map((item) => {
                        const maxVal = Math.max(10, durationAnalytics.longestDuration + 2)
                        const barWidthPercent = Math.min(100, Math.max(15, (item.duration / maxVal) * 100))

                        return (
                          <div key={item.id} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 font-medium">
                                {item.startDate} {item.endDate ? `to ${item.endDate}` : ''}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge variant="rose" size="sm">
                                  {item.flowIntensity}
                                </Badge>
                                <span className="font-bold text-slate-900">
                                  {item.duration} {item.duration === 1 ? 'day' : 'days'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${barWidthPercent}%` }}
                                className="h-full bg-rose-500 rounded-full transition-all"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {durationAnalytics.ongoingPeriodsCount > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                      <strong>Active Period Note:</strong> You have {durationAnalytics.ongoingPeriodsCount} active/ongoing period recorded. Ongoing periods are excluded from duration averages until completed with an end date.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">
                    No Completed Periods Logged
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Period duration requires both start and end dates. Ongoing periods are logged without assuming duration.
                  </p>
                  <Link
                    to="/employee/cycle/history"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Record or Update Period</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Wellness Trends (Sleep, Energy, Mood) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Self-Reported Wellness Trends</h3>
                <p className="text-xs text-slate-500">Sleep, energy, and comfort patterns across logged check-ins</p>
              </div>
            </div>

            <Badge variant="purple" size="sm">
              {wellnessAnalytics.totalCheckIns} Total Check-ins
            </Badge>
          </div>

          {wellnessAnalytics.hasData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1: Sleep Trend Chart */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MoonStar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Sleep Duration Over Time (Hours)</span>
                  </span>
                  {wellnessAnalytics.averageSleep && (
                    <span className="font-bold text-indigo-700">
                      Avg: {wellnessAnalytics.averageSleep} hrs
                    </span>
                  )}
                </div>

                {wellnessAnalytics.sleepTrend.length > 0 ? (
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                    {/* SVG Line / Bar visualization */}
                    <div className="h-36 flex items-end gap-2 pt-6 pb-2 px-1 border-b border-slate-200">
                      {wellnessAnalytics.sleepTrend.map((entry, idx) => {
                        const heightPct = Math.min(100, Math.max(15, (entry.sleepHours / 12) * 100))
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Hover tooltip */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded-md pointer-events-none transition-opacity whitespace-nowrap z-10">
                              {entry.sleepHours} hrs ({entry.date})
                            </div>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-colors"
                            />
                            <span className="text-[9px] text-slate-400 truncate w-full text-center">
                              {entry.date.slice(5)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span>0 hrs</span>
                      <span>Target: ~7.5–8 hrs</span>
                      <span>12 hrs</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                    No sleep duration entries logged yet.
                  </div>
                )}
              </div>

              {/* Col 2: Energy & Mood Breakdown */}
              <div className="space-y-4">
                {/* Energy Distribution */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Energy Frequency</span>
                  </span>
                  <div className="space-y-1.5 mt-2">
                    {Object.entries(wellnessAnalytics.energyDistribution).map(([label, count]) => {
                      const pct = Math.round((count / wellnessAnalytics.totalCheckIns) * 100)
                      return (
                        <div key={label} className="text-xs">
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-slate-700 font-medium">{label}</span>
                            <span className="text-slate-500 font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-purple-600 rounded-full"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mood Frequency */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-teal-500" />
                    <span>Reported Moods</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(wellnessAnalytics.moodDistribution).map(([m, count]) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80"
                      >
                        <span>{m}</span>
                        <span className="bg-teal-200/60 px-1 rounded-full text-[10px]">
                          {count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">
                No Daily Wellness Check-ins Logged
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Log daily check-ins to observe patterns in your physical comfort, sleep duration, and self-reported energy over time.
              </p>
              <Link
                to="/employee/cycle/check-in"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log Your First Check-in</span>
              </Link>
            </div>
          )}
        </div>

        {/* Row 4: Monthly Wellness Summary */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Wellness Summary</h3>
              <p className="text-xs text-slate-500">Aggregated logs for {selectedMonthName}</p>
            </div>

            {/* Month Switcher Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetMonth}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Jump to current month"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-700 select-none">
                  {selectedMonthName}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {monthlySummary.hasData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Check-ins Completed
                  </span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {monthlySummary.checkInCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Periods in Month
                  </span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {monthlySummary.periodsCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Average Sleep
                  </span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {monthlySummary.averageSleep ? `${monthlySummary.averageSleep} hrs` : '—'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Dominant Energy
                  </span>
                  <span className="text-xs font-bold text-purple-800 mt-1 block truncate">
                    {monthlySummary.dominantEnergy || '—'}
                  </span>
                </div>
              </div>

              {/* Personal Notes Logged in this Month */}
              {monthlySummary.notesList.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Notes Logged in {selectedMonthName}</span>
                  </span>
                  <div className="space-y-2">
                    {monthlySummary.notesList.map((n, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700 flex items-start justify-between gap-3"
                      >
                        <p className="italic">&ldquo;{n.text}&rdquo;</p>
                        <Badge variant={n.isPeriodNote ? 'rose' : 'purple'} size="sm">
                          {n.date}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No check-ins or period records logged for {selectedMonthName}.
            </div>
          )}
        </div>

        {/* Row 5: Rule-Based Personal Observations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Rule-Based Observations</h3>
                <p className="text-xs text-slate-500">Cautious pattern summaries derived strictly from validated logs</p>
              </div>
            </div>
            <Badge variant="purple" size="sm">
              {personalInsights.length} Observations
            </Badge>
          </div>

          {personalInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {personalInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{insight.title}</span>
                    <Badge variant="purple" size="sm">
                      {insight.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-500">
              Additional check-ins and completed period records will populate objective personal observations here. No assumptions are generated.
            </div>
          )}
        </div>

        {/* Row 6: Evidence-Informed Reference & Privacy Firewall */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <MoonStar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Evidence-Informed Bio-Rhythm Reference
                </h3>
                <p className="text-xs text-slate-500">
                  General physiological tendencies across biological cycle phases
                </p>
              </div>
            </div>
            <Badge variant="slate" size="sm">Non-Diagnostic</Badge>
          </div>

          <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Menstrual Phase (Days 1 - 5)
                </span>
                <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Restorative Window
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hormone levels are at baseline. Lower physical energy is natural. Focus on restorative self-care, intuitive pacing, and lower physical strain.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Follicular Phase (Days 6 - 13)
                </span>
                <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  Rising Energy
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estrogen rises steadily. Many individuals experience higher cognitive stamina, verbal fluency, and creative ideation during this period.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Ovulatory Phase (Days 14 - 17)
                </span>
                <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Peak Hormone Mid-Point
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Luteinizing hormone and estrogen peak. Communication confidence is typically strong. Ideal for collaborative touchpoints and social engagement.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Luteal Phase (Days 18 - 28)
                </span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Progesterone Pacing
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Progesterone peaks and metabolic demand rises. Attention turns naturally toward detailed, contemplative tasks with increased hydration and rest.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Every body is unique. Biological timelines are generalized reference points and do not replace personalized healthcare or medical diagnosis. All trends remain confidential to your private account.
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
