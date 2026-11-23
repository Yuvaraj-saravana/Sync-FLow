import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'

export default function CycleCalendar() {
  const { profile, checkIns } = useCycle()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate())
  const [todayDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const todayD = todayDate.getDate()
  const todayM = todayDate.getMonth()
  const todayY = todayDate.getFullYear()

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysArray = []
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isConfigured = Boolean(profile?.isConfigured && profile?.lastPeriodStart)

  return (
    <PageContainer
      title="Cycle Calendar"
      subtitle="Monthly schedule, estimated bio-rhythm windows, and personal check-in logs"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
      actions={
        <Link
          to="/employee/cycle/check-in"
          className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Log Daily Check-in</span>
        </Link>
      }
    >
      <CycleNavigation />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar View (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          {/* Calendar Header with Month Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{monthName}</h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-3">
            {daysOfWeek.map((day) => (
              <span key={day} className="py-1">{day}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={idx} className="h-14 sm:h-16 rounded-xl bg-transparent" />
              }

              const isSelected = day === selectedDay
              const isToday = day === todayD && month === todayM && year === todayY

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`h-14 sm:h-16 p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all text-left ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 shadow-2xs ring-1 ring-purple-600'
                      : isToday
                      ? 'border-purple-300 bg-purple-50/20'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isToday ? 'bg-purple-700 text-white' : 'text-slate-800'
                    }`}
                  >
                    {day}
                  </span>

                  <span className="text-[10px] text-slate-400 truncate w-full">
                    {/* Placeholder marker if check-in exists */}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Phase Color Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              Mathematical Estimates:
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Menstrual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Follicular
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Ovulatory
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Luteal
            </span>
          </div>
        </div>

        {/* Selected Date Details Sidebar (1 Col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                Selected Date
              </p>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                {new Date(year, month, selectedDay).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h4>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Estimated Phase Status:
                </span>
                <p className="text-slate-500">
                  {isConfigured
                    ? 'Phase window is calculated mathematically based on your recorded start date.'
                    : 'Configure your cycle baseline in settings to see estimated phase windows.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Wellness Check-in for this Date:
                </span>
                <p className="text-slate-500">
                  {checkIns.length > 0 ? 'Check-in data logged.' : 'No check-in entries recorded for this date.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/employee/cycle/check-in"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Entry for this Date</span>
            </Link>

            <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>Calendar dates are strictly confidential to your account.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
