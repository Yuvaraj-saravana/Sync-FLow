import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  accentColor = 'purple',
  to,
}) {
  const iconBackgrounds = {
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    sage: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }

  const CardWrapper = to ? Link : 'div'
  const wrapperProps = to ? { to, className: 'block group focus:outline-hidden' } : {}

  return (
    <CardWrapper {...wrapperProps}>
      <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all duration-200 relative overflow-hidden ${to ? 'hover:border-purple-300 hover:shadow-sm' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
              {to && <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />}
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
              {badgeText && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>}
          </div>

          {Icon && (
            <div className={`p-2.5 rounded-xl border ${iconBackgrounds[accentColor] || iconBackgrounds.purple}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
