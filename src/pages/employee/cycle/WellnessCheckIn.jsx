import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Smile,
  Moon,
  Info,
  Lock,
  ArrowRight
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'
import { formatDateString } from '../../../services/cycleCalculator.js'

export default function WellnessCheckIn() {
  const { recordCheckIn } = useCycle()
  const [searchParams] = useSearchParams()
  const queryDate = searchParams.get('date')

  const [date, setDate] = useState(() => queryDate || formatDateString(new Date()))
  const [energy, setEnergy] = useState('Moderate Energy')
  const [comfort, setComfort] = useState('Comfortable')
  const [mood, setMood] = useState('Focused & Steady')
  const [sleepHours, setSleepHours] = useState('7.5')
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    recordCheckIn({
      date,
      energy,
      comfort,
      mood,
      sleepHours: Number(sleepHours),
      notes,
    })
    setIsSubmitted(true)
  }

  return (
    <PageContainer
      title="Daily Wellness Check-in"
      subtitle="Log your self-reported physical comfort and energy to identify personal bio-rhythm patterns"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
    >
      <CycleNavigation />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Session Notice Banner */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Session Interaction Mode:</strong> Check-in data logged during this step is maintained in memory for your current session. Your responses are strictly confidential and never visible to managers or used to assign tasks.
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Wellness Check-in Recorded for {date}
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you for recording your daily metrics. Consistent check-ins generate personalized insights in your History and Trends sections.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Log Another Day
              </button>

              <Link
                to="/employee/cycle"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
              >
                <span>Back to Overview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Check-in Date
              </label>
              <div className="relative max-w-xs">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>Self-Reported Energy</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Restorative (Low)', 'Moderate Energy', 'High Energy', 'Peak Vitality'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergy(level)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      energy === level
                        ? 'bg-purple-50 border-purple-400 text-purple-800 shadow-2xs font-bold ring-1 ring-purple-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Comfort */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Physical Comfort & Symptoms</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Comfortable & Balanced',
                  'Mild Cramping',
                  'Lower Back Tension',
                  'Bloating / Water Retention',
                  'Headache / Sensitivity',
                  'Restorative Needs',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setComfort(item)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      comfort === item
                        ? 'bg-purple-50 border-purple-400 text-purple-800 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood & Cognitive Readiness */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-purple-600" />
                <span>Mood & Mental Readiness</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Focused & Steady', 'Creative & Inspired', 'Reflective & Quiet', 'Sensitive / Overwhelmed', 'Social & Collaborative'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      mood === m
                        ? 'bg-purple-50 border-purple-400 text-purple-800 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-600" />
                <span>Sleep Duration (Hours)</span>
              </label>
              <div className="flex items-center gap-3 max-w-xs">
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="14"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-24 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                />
                <span className="text-xs text-slate-500 font-medium">hours of restorative sleep</span>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Personal Notes (Private)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any personal observations, hydration notes, or lifestyle reflections..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Responses are stored in session memory
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs shadow-purple-600/30 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Daily Check-in</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </PageContainer>
  )
}
