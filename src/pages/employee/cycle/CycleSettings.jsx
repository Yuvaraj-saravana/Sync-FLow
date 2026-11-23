import { useState } from 'react'
import {
  Calendar,
  Lock,
  RotateCcw,
  CheckCircle2,
  Shield
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'

export default function CycleSettings() {
  const { profile, configureProfile, resetProfile } = useCycle()

  const [lastPeriodStart, setLastPeriodStart] = useState(profile?.lastPeriodStart || '')
  const [cycleLength, setCycleLength] = useState(profile?.cycleLengthDays || 28)
  const [periodLength, setPeriodLength] = useState(profile?.periodLengthDays || 5)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    configureProfile({
      lastPeriodStart: lastPeriodStart || null,
      cycleLengthDays: Number(cycleLength) || 28,
      periodLengthDays: Number(periodLength) || 5,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your cycle configuration from this session?')) {
      resetProfile()
      setLastPeriodStart('')
      setCycleLength(28)
      setPeriodLength(5)
    }
  }

  return (
    <PageContainer
      title="Cycle & Wellness Settings"
      subtitle="Manage baseline cycle parameters, privacy preferences, and session data"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
    >
      <CycleNavigation />

      <div className="max-w-3xl space-y-6">
        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cycle configuration updated successfully in current session.</span>
          </div>
        )}

        {/* Baseline Parameters Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Baseline Cycle Parameters</h3>
              <p className="text-xs text-slate-500">Provide baseline numbers to generate estimated phase windows</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                First Day of Last Period
              </label>
              <input
                type="date"
                value={lastPeriodStart}
                onChange={(e) => setLastPeriodStart(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Leave blank if unknown</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Average Cycle Length (Days)
              </label>
              <input
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Typically between 24 and 35 days</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Average Period Duration (Days)
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={periodLength}
                onChange={(e) => setPeriodLength(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Duration of menstrual flow</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Session only · No cloud sync at this stage
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
            >
              Save Parameters
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
                <strong className="block text-slate-800">Manager & Leader Access Firewall</strong>
                <span className="text-slate-500">Cycle data is permanently hidden from Team Leader & Admin dashboards.</span>
              </div>
              <Badge variant="sage" size="sm">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <strong className="block text-slate-800">Voluntary Tracking Policy</strong>
                <span className="text-slate-500">Cycle logging is 100% voluntary and never required by workplace policies.</span>
              </div>
              <Badge variant="purple" size="sm">Guaranteed</Badge>
            </div>
          </div>
        </div>

        {/* Reset Session Data */}
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-900">Reset Session Cycle Records</h4>
            <p className="text-xs text-rose-600 mt-0.5">
              Permanently clear your configured cycle start date and check-in logs from memory.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
