import { ShieldCheck, Lock, EyeOff, Info } from 'lucide-react'

export default function CyclePrivacyNotice() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Privacy & Non-Medical Notice
          </h3>
          <p className="text-xs text-slate-500">
            Employee-controlled data boundaries and non-diagnostic commitments
          </p>
        </div>
      </div>

      <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100/70">
          <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Strict Employee Confidentiality</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All cycle and wellness check-in entries are private to you. Team leaders and administrators have zero access to your cycle records.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <EyeOff className="w-4 h-4 text-slate-600" />
            <span>No Workplace Task Coupling</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Cycle information is never used to determine workplace task assignments, deadlines, or performance reviews.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <Info className="w-4 h-4 text-slate-600" />
            <span>Non-Medical Wellness Estimates</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All phase projections are mathematical estimates based on user-entered dates. They do not constitute medical advice or confirmed ovulation.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Session Storage Active · Cloud Persistence Pending Implementation</span>
        <span>SYNC FLOW v1.0 Foundation</span>
      </div>
    </div>
  )
}
