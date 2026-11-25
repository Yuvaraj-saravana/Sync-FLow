import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  PlusCircle,
  History,
  Bot
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import CycleStatusCard from '../../../components/cycle/CycleStatusCard'
import CycleCalendarPreview from '../../../components/cycle/CycleCalendarPreview'
import CyclePrivacyNotice from '../../../components/cycle/CyclePrivacyNotice'
import PeriodModal from '../../../components/cycle/PeriodModal'
import CycleWellnessAssistant from '../../../components/cycle/CycleWellnessAssistant'
import { useCycle } from '../../../context/useCycle'

export default function CycleOverview() {
  const { profile, cycleSummary, addPeriod, periods, checkIns } = useCycle()
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false)

  const handlePeriodSubmit = (periodData) => {
    return addPeriod(periodData)
  }

  return (
    <PageContainer
      title="Cycle & Wellness AI"
      subtitle="Confidential bio-rhythmic self-awareness and personal wellness pacing"
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
            onClick={() => setIsPeriodModalOpen(true)}
            className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Period</span>
          </button>
        </div>
      }
    >
      {/* Sub-Navigation */}
      <CycleNavigation />

      <div className="space-y-6">
        {/* 1. Cycle Status Card */}
        <CycleStatusCard
          cycleSummary={cycleSummary}
          onOpenPeriodModal={() => setIsPeriodModalOpen(true)}
        />

        {/* 2. Quick Access Tool Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setIsPeriodModalOpen(true)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Record Period</h4>
                <p className="text-xs text-slate-500">Log start & flow intensity</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </button>

          <Link
            to="/employee/cycle/check-in"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Daily Check-in</h4>
                <p className="text-xs text-slate-500">Record energy & comfort</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            to="/employee/cycle/history"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 group-hover:scale-105 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Period History</h4>
                <p className="text-xs text-slate-500">{periods.length} recorded period{periods.length === 1 ? '' : 's'}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            to="/employee/cycle/calendar"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Cycle Calendar</h4>
                <p className="text-xs text-slate-500">View monthly schedule</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </Link>
        </div>

        {/* 3. Two-Column Grid: Calendar Preview & Personal Trends Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CycleCalendarPreview profile={profile} />

          {/* Personal Wellness Trends Preview */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Personal Wellness Trends</h3>
                    <p className="text-[11px] text-slate-400">Self-Reported Correlation Preview</p>
                  </div>
                </div>

                <Link
                  to="/employee/cycle/insights"
                  className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="py-6 text-center space-y-3">
                {checkIns.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50/70 border border-dashed border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">No Check-ins Logged Yet</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Log your daily physical comfort and energy to generate personalized bio-rhythm correlations over consecutive cycles.
                    </p>
                    <Link
                      to="/employee/cycle/check-in"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Complete Today's Check-in</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 text-left">
                    <p className="text-xs font-semibold text-slate-700">Recent Logged Check-ins ({checkIns.length}):</p>
                    {checkIns.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800">{entry.date}</span>
                        <span className="text-purple-700 font-semibold">{entry.energy || 'Logged'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Trends require 2+ logged cycles</span>
              <span>Non-Diagnostic Metric</span>
            </div>
          </div>
        </div>

        {/* 4. Integrated Cycle & Wellness AI Assistant */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cycle & Wellness AI Assistant
                </h3>
                <p className="text-xs text-slate-500">
                  Instant, context-aware answers grounded in your confidential records
                </p>
              </div>
            </div>
            <Link
              to="/employee/cycle/assistant"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Full Assistant View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CycleWellnessAssistant compact={true} />
        </div>

        {/* 5. Privacy & Consent Notice */}
        <CyclePrivacyNotice />
      </div>

      {/* Record Period Modal */}
      <PeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onSubmit={handlePeriodSubmit}
        title="Record Period"
      />
    </PageContainer>
  )
}
