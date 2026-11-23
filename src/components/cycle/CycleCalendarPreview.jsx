import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Info } from 'lucide-react'

export default function CycleCalendarPreview({ profile }) {
  const isConfigured = Boolean(profile?.isConfigured && profile?.lastPeriodStart)
  const [today] = useState(() => new Date())
  const currentMonthName = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  // Days of week header
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Days in current month
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const daysArray = []
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d)
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentMonthName}</h3>
              <p className="text-[11px] text-slate-400">Monthly Cycle Preview</p>
            </div>
          </div>

          <Link
            to="/employee/cycle/calendar"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Full Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Calendar Grid */}
        <div className="py-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
            {daysOfWeek.map((day, idx) => (
              <span key={idx} className="py-1">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <span key={idx} className="h-7" />
              }
              const isToday = day === today.getDate()
              return (
                <div
                  key={idx}
                  className={`h-7 rounded-lg flex items-center justify-center font-medium transition-colors ${
                    isToday
                      ? 'bg-purple-700 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase Color Legend */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Phase Guide (Mathematical Estimates):
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Menstrual Window
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Follicular Window
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Ovulatory Window
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Luteal Window
            </span>
          </div>
        </div>
      </div>

      {!isConfigured && (
        <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Configure last period date to highlight estimated monthly windows.</span>
        </div>
      )}
    </div>
  )
}
