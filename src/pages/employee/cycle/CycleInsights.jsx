import { Link } from 'react-router-dom'
import {
  MoonStar,
  CheckCircle2,
  Lock,
  Info
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'

export default function CycleInsights() {
  const { checkIns } = useCycle()

  return (
    <PageContainer
      title="Personal Cycle Insights"
      subtitle="Bio-rhythmic trends and self-reported wellness correlations"
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
          <span>Record Daily Entry</span>
        </Link>
      }
    >
      <CycleNavigation />

      <div className="space-y-6">
        {/* Trend Analysis Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Recorded Data Volume
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{checkIns.length} Check-ins</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              {checkIns.length >= 7 ? 'Preliminary trends calculable' : '7+ entries needed for trends'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Cycle Regularity Metric
            </p>
            <h3 className="text-2xl font-bold text-slate-900">Pending History</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Requires 3+ recorded cycles for variation index
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Privacy Boundary
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-lg mt-0.5">
              <span>Employee-Controlled</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Zero visibility to management or team leads
            </p>
          </div>
        </div>

        {/* Phase Pacing & Physiological Reference (Educational / Evidence-Informed) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
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

          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Disclaimer: Every body is unique. Biological timelines are generalized reference points and do not replace personalized healthcare or medical diagnosis.
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
