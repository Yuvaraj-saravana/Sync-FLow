import { Sparkles, ShieldCheck } from 'lucide-react'
import PageContainer from '../layout/PageContainer'
import Badge from './Badge'

export default function PlaceholderPage({
  title,
  description,
  role = 'Employee',
  icon: Icon = Sparkles,
  tags = [],
  step = 'Ready for upcoming steps',
}) {
  return (
    <PageContainer
      title={title}
      subtitle={description}
      badge={<Badge variant="purple">{role} Area</Badge>}
    >
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70">
                Route Established
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Status: {step}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Architecture</p>
            <p className="text-sm font-semibold text-slate-800">React Router v7</p>
            <p className="text-xs text-slate-500 mt-1">Mounted and ready in application shell</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Privacy & Governance</p>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Employee-Controlled
            </p>
            <p className="text-xs text-slate-500 mt-1">Strict role and consent boundaries</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Design System</p>
            <p className="text-sm font-semibold text-slate-800">SYNC FLOW Enterprise</p>
            <p className="text-xs text-slate-500 mt-1">Tailwind CSS v4 & Lucide Icons</p>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500">Scheduled modules:</span>
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-purple-50/70 text-purple-700 border border-purple-100 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
