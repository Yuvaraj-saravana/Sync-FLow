import { Lock } from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import CycleWellnessAssistant from '../../../components/cycle/CycleWellnessAssistant'

export default function CycleAssistantPage() {
  return (
    <PageContainer
      title="Cycle & Wellness AI Assistant"
      subtitle="Ask contextual questions about your cycle records, intervals, energy, and wellness patterns"
      badge={
        <Badge variant="purple" size="md">
          <Lock className="w-3 h-3 text-purple-600" />
          <span>Private to Employee</span>
        </Badge>
      }
    >
      <CycleNavigation />

      <div className="max-w-4xl mx-auto space-y-6">
        <CycleWellnessAssistant compact={false} />

        {/* Informational Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
              Zero Fabrication
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every statistic, date, and phase reference is computed strictly from your actual recorded periods and check-ins.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
              Non-Diagnostic AI
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculations are mathematical estimations for bio-rhythmic self-awareness and never replace clinical medical care.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
              Complete Privacy
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your conversations and health records remain in memory during your active session and are never shared with Team Leaders.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
