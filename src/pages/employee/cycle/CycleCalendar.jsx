import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Droplets,
  Lock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Smile,
  Moon,
  Zap,
  RotateCcw
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'
import {
  formatDateString,
  getDateCycleStatus
} from '../../../services/cycleCalculator.js'

export default function CycleCalendar() {
  const { profile, periods, checkIns, cycleSummary } = useCycle()

  // Track calendar view month/year
  const [viewDate, setViewDate] = useState(() => new Date())
  // Today's immutable date string (YYYY-MM-DD)
  const [todayStr] = useState(() => formatDateString(new Date()))
  // Currently selected date string (defaults to today)
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatDateString(new Date()))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const monthName = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  // Leap-year safe days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // 0 = Sunday, 1 = Monday, ...
  const firstDayIndex = new Date(year, month, 1).getDay()

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Navigation Handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleGoToToday = () => {
    const today = new Date()
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDateStr(todayStr)
  }

  // Pre-calculate days grid for current view month
  const calendarDays = useMemo(() => {
    const days = []
    // Pad previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(d).padStart(2, '0')
      const dateStr = `${year}-${monthStr}-${dayStr}`
      const status = getDateCycleStatus(dateStr, profile, periods, checkIns)

      days.push({
        dayNumber: d,
        dateStr,
        isToday: dateStr === todayStr,
        ...status,
      })
    }
    return days
  }, [year, month, daysInMonth, firstDayIndex, todayStr, profile, periods, checkIns])

  // Count recorded periods occurring in this view month
  const monthRecordedPeriodCount = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
    return periods.filter(p => p.startDate.startsWith(monthPrefix)).length
  }, [periods, year, month])

  // Selected date status for inspector
  const selectedStatus = useMemo(() => {
    return getDateCycleStatus(selectedDateStr, profile, periods, checkIns)
  }, [selectedDateStr, profile, periods, checkIns])

  // Selected date formatted for display
  const selectedFormatted = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    return dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [selectedDateStr])

  // Phase badge color mapper
  const getPhaseBadge = (phaseKey) => {
    switch (phaseKey) {
      case 'menstrual':
        return { variant: 'rose', label: 'Menstrual (Estimated)' }
      case 'follicular':
        return { variant: 'purple', label: 'Follicular (Estimated)' }
      case 'ovulatory':
        return { variant: 'teal', label: 'Ovulatory (Estimated)' }
      case 'luteal':
        return { variant: 'amber', label: 'Luteal (Estimated)' }
      default:
        return { variant: 'slate', label: 'Unestimated' }
    }
  }

  return (
    <PageContainer
      title="Cycle Calendar"
      subtitle="Interactive monthly schedule, mathematical phase estimates, and confidential check-in logs"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoToToday}
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Today</span>
          </button>
          <Link
            to={`/employee/cycle/check-in?date=${selectedDateStr}`}
            className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Log Daily Check-in</span>
          </Link>
        </div>
      }
    >
      <CycleNavigation />

      {/* 1. Cycle Phase Timeline / Mathematical Status Header */}
      <div className="mb-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Cycle Phase Overview
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              (Mathematical Window Estimates)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cycleSummary.isConfigured ? (
              <Badge variant={cycleSummary.isIrregular ? 'amber' : 'purple'} size="sm">
                {cycleSummary.isIrregular
                  ? 'Irregular Cycle (Estimates Paused)'
                  : cycleSummary.effectiveCycleLength
                  ? `~${cycleSummary.effectiveCycleLength} Day Cycle (Estimated)`
                  : 'Cycle Length Needed'}
              </Badge>
            ) : (
              <Badge variant="slate" size="sm">
                Unconfigured Baseline
              </Badge>
            )}

            {cycleSummary.currentCycleDay && !cycleSummary.isIrregular && (
              <Badge variant="teal" size="sm">
                Current: Day {cycleSummary.currentCycleDay} (Estimated)
              </Badge>
            )}
          </div>
        </div>

        {/* Phase Progress Bar */}
        {cycleSummary.hasSufficientData ? (
          <div>
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5">
              {/* Menstrual Phase segment */}
              <div
                style={{
                  width: `${Math.min(30, ((cycleSummary.periodDuration || 5) / cycleSummary.effectiveCycleLength) * 100)}%`,
                }}
                className="h-full bg-rose-400 rounded-l-full"
                title="Menstrual Phase (Estimated)"
              />
              {/* Follicular Phase segment */}
              <div
                style={{
                  width: `${Math.max(15, (Math.max(2, (cycleSummary.effectiveCycleLength - 14 - (cycleSummary.periodDuration || 5))) / cycleSummary.effectiveCycleLength) * 100)}%`,
                }}
                className="h-full bg-purple-500"
                title="Follicular Phase (Estimated)"
              />
              {/* Ovulatory Phase segment */}
              <div
                style={{
                  width: `${(3 / cycleSummary.effectiveCycleLength) * 100}%`,
                }}
                className="h-full bg-teal-500"
                title="Ovulatory Window (Estimated Mid-cycle)"
              />
              {/* Luteal Phase segment */}
              <div
                className="h-full bg-amber-400 rounded-r-full flex-1"
                title="Luteal Phase (Estimated)"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 px-0.5">
              <span className="flex items-center gap-1 font-medium text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Menstrual (Days 1–{cycleSummary.periodDuration || 5})
              </span>
              <span className="flex items-center gap-1 font-medium text-purple-700">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Follicular
              </span>
              <span className="flex items-center gap-1 font-medium text-teal-700">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Ovulatory (~Day {Math.max(6, cycleSummary.effectiveCycleLength - 14)})
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Luteal (Days {Math.max(8, cycleSummary.effectiveCycleLength - 12)}–{cycleSummary.effectiveCycleLength})
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              {cycleSummary.isIrregular ? (
                <span>
                  <strong>Phase estimates are currently paused:</strong> Because your cycle is marked as irregular, calendar predictions are paused to avoid displaying inaccurate estimates.
                </span>
              ) : !cycleSummary.effectiveCycleLength ? (
                <span>
                  <strong>Cycle length needed:</strong> Record 2 or more periods or provide an average cycle length in <Link to="/employee/cycle/settings" className="text-purple-700 font-semibold underline">Cycle Settings</Link> to generate phase window estimates.
                </span>
              ) : (
                <span>
                  <strong>No start date recorded:</strong> <Link to="/employee/cycle" className="text-purple-700 font-semibold underline">Record a period</Link> or configure your baseline date in Settings to visualize estimated phase windows.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Calendar Layout: Calendar Grid (2 Cols) + Selected Date Inspector (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar View (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Calendar Month Header & Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{monthName}</h3>
                  <p className="text-xs text-slate-400">
                    {monthRecordedPeriodCount > 0
                      ? `${monthRecordedPeriodCount} recorded period ${monthRecordedPeriodCount === 1 ? 'log' : 'logs'} this month`
                      : 'No recorded periods this month'}
                  </p>
                </div>
              </div>

              {/* Month Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors hidden sm:inline-block"
                >
                  Current Month
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
                  <div className="w-[1px] h-4 bg-slate-200" />
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

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-3">
              {daysOfWeek.map((day) => (
                <span key={day} className="py-1">{day}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {calendarDays.map((cell, idx) => {
                if (cell === null) {
                  return <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
                }

                const isSelected = cell.dateStr === selectedDateStr

                // Cell styling based on recorded period vs estimated period vs neutral
                let cellBgStyle = 'border-slate-100 hover:border-purple-300 hover:bg-slate-50/50'

                if (cell.isRecordedPeriod) {
                  cellBgStyle = 'border-rose-200 bg-rose-50/80 hover:bg-rose-100/70'
                } else if (cell.isEstimatedPeriod) {
                  cellBgStyle = 'border-dashed border-rose-300 bg-rose-50/30 hover:bg-rose-50/70'
                }

                if (isSelected) {
                  cellBgStyle = `${cellBgStyle} ring-2 ring-purple-600 border-purple-600 shadow-xs`
                }

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all text-left relative overflow-hidden ${cellBgStyle}`}
                  >
                    {/* Top Row: Date Number and Status Tags */}
                    <div className="w-full flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          cell.isToday
                            ? 'bg-purple-700 text-white shadow-2xs'
                            : cell.isRecordedPeriod
                            ? 'text-rose-950 font-extrabold'
                            : 'text-slate-800'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {/* Small badge or indicator */}
                      {cell.isRecordedPeriod && (
                        <span className="p-0.5 rounded-md bg-rose-100 text-rose-700" title="Recorded Period Flow">
                          <Droplets className="w-3 h-3" />
                        </span>
                      )}

                      {!cell.isRecordedPeriod && cell.isEstimatedPeriod && (
                        <span
                          className="px-1 py-0.2 rounded text-[9px] font-bold text-rose-600 bg-rose-100/70 border border-dashed border-rose-300"
                          title="Estimated Period Window"
                        >
                          Est
                        </span>
                      )}
                    </div>

                    {/* Bottom Indicators: Phase dot & Check-in Dot */}
                    <div className="w-full flex items-center justify-between mt-auto pt-1">
                      {/* Phase Dot Indicator (if not in menstrual flow) */}
                      {!cell.isRecordedPeriod && cell.phaseInfo && !cell.phaseInfo.isPaused && (
                        <span className="flex items-center gap-0.5">
                          {cell.phaseInfo.phaseKey === 'follicular' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Follicular Phase (Estimated)" />
                          )}
                          {cell.phaseInfo.phaseKey === 'ovulatory' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" title="Ovulatory Window (Estimated)" />
                          )}
                          {cell.phaseInfo.phaseKey === 'luteal' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Luteal Phase (Estimated)" />
                          )}
                        </span>
                      )}

                      {/* Check-in Indicator */}
                      {cell.hasCheckIn && (
                        <span
                          className="ml-auto flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300"
                          title="Wellness Check-in logged"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Calendar Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Calendar Visual Legend:
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-200 border border-rose-300 flex items-center justify-center text-rose-700">
                  <Droplets className="w-2 h-2" />
                </span>
                <span>Recorded Period</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-50 border border-dashed border-rose-400 text-[8px] font-bold text-rose-600 flex items-center justify-center">
                  Est
                </span>
                <span>Estimated Period</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Follicular (Est)</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Ovulatory (Est)</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Luteal (Est)</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white" />
                <span>Wellness Check-in</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-purple-600" />
                <span>Selected Date</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Date Details Inspector (1 Col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Day Inspector
                </p>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedFormatted}
                </h4>
              </div>
              {selectedDateStr === todayStr && (
                <Badge variant="purple" size="sm">
                  Today
                </Badge>
              )}
            </div>

            {/* Section A: Recorded or Estimated Period Status */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Menstrual Period Status
              </span>

              {selectedStatus?.isRecordedPeriod ? (
                <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5 text-xs text-rose-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Droplets className="w-4 h-4 text-rose-600" />
                      <span>Recorded Period</span>
                    </div>
                    <Badge variant="rose" size="sm">
                      {selectedStatus.recordedPeriod.flowIntensity} Flow
                    </Badge>
                  </div>
                  <p className="text-rose-800 text-[11px]">
                    {selectedStatus.recordedPeriod.endDate
                      ? `Period window: ${selectedStatus.recordedPeriod.startDate} to ${selectedStatus.recordedPeriod.endDate}`
                      : `Ongoing flow (started ${selectedStatus.recordedPeriod.startDate})`}
                  </p>
                  {selectedStatus.recordedPeriod.notes && (
                    <div className="pt-1.5 border-t border-rose-200/60 text-[11px] text-rose-900 italic">
                      Notes: &ldquo;{selectedStatus.recordedPeriod.notes}&rdquo;
                    </div>
                  )}
                </div>
              ) : selectedStatus?.isEstimatedPeriod ? (
                <div className="p-3.5 rounded-xl bg-rose-50/40 border border-dashed border-rose-300 space-y-1.5 text-xs text-rose-900">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-rose-600" />
                      <span>Estimated Period Window</span>
                    </span>
                    <Badge variant="rose" size="sm">
                      Estimated
                    </Badge>
                  </div>
                  <p className="text-rose-700 text-[11px]">
                    Upcoming period projected mathematically from your historical interval of ~{cycleSummary.effectiveCycleLength} days. Non-diagnostic.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  No menstrual period recorded for this date.
                </div>
              )}
            </div>

            {/* Section B: Estimated Phase Status */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Bio-Rhythm Phase
              </span>

              {selectedStatus?.phaseInfo && !selectedStatus.phaseInfo.isPaused ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={getPhaseBadge(selectedStatus.phaseInfo.phaseKey).variant}
                      size="sm"
                    >
                      {getPhaseBadge(selectedStatus.phaseInfo.phaseKey).label}
                    </Badge>

                    {selectedStatus.cycleDay && (
                      <span className="font-semibold text-slate-700">
                        Cycle Day {selectedStatus.cycleDay} (Est)
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {selectedStatus.phaseInfo.description}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  {selectedStatus?.phaseInfo?.description || 'Phase estimates are unavailable for this date.'}
                </div>
              )}
            </div>

            {/* Section C: Daily Wellness Check-in */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Daily Wellness Log
              </span>

              {selectedStatus?.checkIn ? (
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2 text-xs text-slate-800">
                  <div className="flex items-center justify-between pb-1.5 border-b border-purple-100">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Check-in Recorded</span>
                    </span>
                    <Badge variant="purple" size="sm">
                      {selectedStatus.checkIn.date}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span><strong>Energy:</strong> {selectedStatus.checkIn.energy}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Smile className="w-3 h-3 text-teal-500 shrink-0" />
                      <span><strong>Comfort:</strong> {selectedStatus.checkIn.comfort}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                      <span><strong>Mood:</strong> {selectedStatus.checkIn.mood}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Moon className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span><strong>Sleep:</strong> {selectedStatus.checkIn.sleepHours} hrs</span>
                    </div>
                  </div>

                  {selectedStatus.checkIn.notes && (
                    <div className="pt-1.5 border-t border-purple-100 text-[11px] text-slate-600 italic">
                      Notes: &ldquo;{selectedStatus.checkIn.notes}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>No check-in entry for this date.</span>
                  <Link
                    to={`/employee/cycle/check-in?date=${selectedDateStr}`}
                    className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Log</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Inspector Footer Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Link
              to={`/employee/cycle/check-in?date=${selectedDateStr}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{selectedStatus?.checkIn ? 'Update Check-in for this Date' : 'Log Check-in for this Date'}</span>
            </Link>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>Cycle dates, flow details, and check-in logs are employee-only and strictly confidential.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
