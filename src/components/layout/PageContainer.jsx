export default function PageContainer({
  title,
  subtitle,
  badge,
  actions,
  children,
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  )
}
