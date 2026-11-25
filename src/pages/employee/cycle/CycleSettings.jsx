import { useState } from 'react'
import {
  Calendar,
  Lock,
  RotateCcw,
  CheckCircle2,
  Shield,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'
import { formatDateString } from '../../../services/cycleCalculator'

export default function CycleSettings() {
  const { profile, saveProfile, resetProfile } = useCycle()

  const [lastPeriodStart, setLastPeriodStart] = useState(profile?.lastPeriodStart || '')
  const [cycleLength, setCycleLength] = useState(
    profile?.cycleLengthDays !== null && profile?.cycleLengthDays !== undefined
      ? String(profile.cycleLengthDays)
      : ''
  )
  const [periodDuration, setPeriodDuration] = useState(
    profile?.periodLengthDays !== null && profile?.periodLengthDays !== undefined
      ? String(profile.periodLengthDays)
      : ''
  )
  const [regularity, setRegularity] = useState(profile?.regularity || 'regular')
  const [previousPeriodStarts, setPreviousPeriodStarts] = useState(
    profile?.previousPeriodStarts || []
  )
  const [newPastDate, setNewPastDate] = useState('')
  const [pastDateError, setPastDateError] = useState('')
  const [errors, setErrors] = useState({})
  const [isSaved, setIsSaved] = useState(false)

  // Avoid pure date calls during render
  const [todayStr] = useState(() => formatDateString(new Date()))

  const handleAddPastDate = (e) => {
    e.preventDefault()
    setPastDateError('')

    if (!newPastDate) {
      setPastDateError('Please pick a date first.')
      return
    }

    if (newPastDate > todayStr) {
      setPastDateError('Historical dates cannot be in the future.')
      return
    }

    if (previousPeriodStarts.includes(newPastDate) || newPastDate === lastPeriodStart) {
      setPastDateError('This date is already in your period log or profile.')
      return
    }

    const updated = [...previousPeriodStarts, newPastDate].sort().reverse()
    setPreviousPeriodStarts(updated)
    setNewPastDate('')
  }

  const handleRemovePastDate = (dateToRemove) => {
    setPreviousPeriodStarts((prev) => prev.filter((d) => d !== dateToRemove))
  }

  const handleSave = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (lastPeriodStart && lastPeriodStart > todayStr) {
      newErrors.lastPeriodStart = 'Last period start date cannot be in the future.'
    }

    if (cycleLength.trim() !== '') {
      const num = Number(cycleLength)
      if (isNaN(num) || num < 18 || num > 60) {
        newErrors.cycleLength = 'Average cycle length must be between 18 and 60 days.'
      }
    }

    if (periodDuration.trim() !== '') {
      const num = Number(periodDuration)
      if (isNaN(num) || num < 1 || num > 15) {
        newErrors.periodDuration = 'Average period duration must be between 1 and 15 days.'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    saveProfile({
      lastPeriodStart: lastPeriodStart || null,
      cycleLengthDays: cycleLength.trim() !== '' ? Number(cycleLength) : null,
      periodLengthDays: periodDuration.trim() !== '' ? Number(periodDuration) : null,
      regularity,
      previousPeriodStarts,
    })

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3500)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your cycle configuration and all period records from memory?')) {
      resetProfile()
      setLastPeriodStart('')
      setCycleLength('')
      setPeriodDuration('')
      setRegularity('regular')
      setPreviousPeriodStarts([])
      setErrors({})
    }
  }

  return (
    <PageContainer
      title="Cycle & Wellness Settings"
      subtitle="Manage your personal cycle profile, regularity preferences, and session data"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
    >
      <CycleNavigation />

      <div className="max-w-3xl space-y-6">
        {/* Save confirmation banner */}
        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Personal cycle profile updated successfully in your active session.</span>
          </div>
        )}

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Cycle Profile</h3>
                <p className="text-xs text-slate-500">
                  Voluntary configuration. Leave any fields blank if unknown.
                </p>
              </div>
            </div>
            <Badge variant="slate" size="sm">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Session Only</span>
            </Badge>
          </div>

          {/* Section: Regularity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Cycle Regularity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'regular',
                  label: 'Regular',
                  desc: 'Predictable interval month-to-month (~21–35 days)',
                  badge: 'purple',
                },
                {
                  id: 'irregular',
                  label: 'Irregular',
                  desc: 'Varies widely; phase estimates will be paused',
                  badge: 'amber',
                },
                {
                  id: 'not_sure',
                  label: 'Not Sure',
                  desc: 'Exploring or tracking baseline patterns',
                  badge: 'slate',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRegularity(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    regularity === opt.id
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    <Badge variant={opt.badge} size="sm">
                      {opt.id === regularity ? 'Selected' : 'Option'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Baseline Dates & Durations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Last Period Start Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                First Day of Last Period
              </label>
              <input
                type="date"
                max={todayStr}
                value={lastPeriodStart}
                onChange={(e) => setLastPeriodStart(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:outline-hidden focus:bg-white ${
                  errors.lastPeriodStart
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-slate-200 focus:border-purple-600'
                }`}
              />
              {errors.lastPeriodStart ? (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.lastPeriodStart}</span>
                </p>
              ) : (
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Optional. Leave blank if unknown or newly tracking.
                </span>
              )}
            </div>

            {/* Average Cycle Length */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Average Cycle Length (Days)
              </label>
              <input
                type="number"
                min="18"
                max="60"
                placeholder="e.g. 29 (leave blank if unknown)"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:outline-hidden focus:bg-white ${
                  errors.cycleLength
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-slate-200 focus:border-purple-600'
                }`}
              />
              {errors.cycleLength ? (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.cycleLength}</span>
                </p>
              ) : (
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Optional. We do not assume a default 28-day cycle.
                </span>
              )}
            </div>

            {/* Average Period Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Average Period Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                placeholder="e.g. 5 (leave blank if unknown)"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 focus:outline-hidden focus:bg-white ${
                  errors.periodDuration
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-slate-200 focus:border-purple-600'
                }`}
              />
              {errors.periodDuration ? (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.periodDuration}</span>
                </p>
              ) : (
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Duration of menstrual flow (typically 3–7 days).
                </span>
              )}
            </div>
          </div>

          {/* Section: Optional Previous Period Dates */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Optional Previous Period Start Dates
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Entering 1 or more past start dates allows SYNC FLOW to compute your personal average cycle length automatically without guessing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="date"
                max={todayStr}
                value={newPastDate}
                onChange={(e) => {
                  setNewPastDate(e.target.value)
                  setPastDateError('')
                }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white flex-1"
              />
              <button
                type="button"
                onClick={handleAddPastDate}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Past Date</span>
              </button>
            </div>

            {pastDateError && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pastDateError}</span>
              </p>
            )}

            {previousPeriodStarts.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {previousPeriodStarts.map((dateStr) => (
                  <span
                    key={dateStr}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span>{dateStr}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePastDate(dateStr)}
                      className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                      aria-label={`Remove date ${dateStr}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                No past dates added yet. (Skipping is completely supported)
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Predictions are non-diagnostic estimates and never shared with management.</span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Privacy & Role Isolation Policy */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Privacy & Access Guarantees</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <strong className="block text-slate-800">Team Leader & Manager Firewall</strong>
                <span className="text-slate-500">
                  Cycle details, flow, symptoms, and dates are completely hidden from all Team Leader and Admin roles.
                </span>
              </div>
              <Badge variant="sage" size="sm">Strict Firewall</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <strong className="block text-slate-800">Session-Only Storage</strong>
                <span className="text-slate-500">
                  Data resides strictly in browser memory during your active session. Closing the tab cleans all records.
                </span>
              </div>
              <Badge variant="purple" size="sm">Active</Badge>
            </div>
          </div>
        </div>

        {/* Reset Session Data */}
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-900">Reset Session Cycle Records</h4>
            <p className="text-xs text-rose-600 mt-0.5">
              Permanently clear your configured cycle profile, recorded periods, and check-in logs from memory.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session Data</span>
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
