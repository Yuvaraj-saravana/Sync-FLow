import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react'

export function LoadingState({ message = 'Loading module data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[160px]">
      <Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-2" />
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  )
}

export function EmptyState({
  title = 'No data available',
  description = 'No active records found for this section yet.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[160px] bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
        <Inbox className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ErrorState({
  title = 'Unable to load data',
  description = 'An error occurred while retrieving information.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center min-h-[160px] bg-rose-50/40 rounded-xl border border-rose-200/70">
      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
      <p className="text-xs text-rose-700 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-white hover:bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  )
}

export default function DataStateWrapper({
  status = 'success',
  isLoading = false,
  error = null,
  isEmpty = false,
  loadingMessage,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  errorTitle,
  errorDescription,
  onRetry,
  children,
}) {
  if (status === 'loading' || isLoading) {
    return <LoadingState message={loadingMessage} />
  }

  if (status === 'error' || error) {
    return (
      <ErrorState
        title={errorTitle}
        description={errorDescription || (typeof error === 'string' ? error : undefined)}
        onRetry={onRetry}
      />
    )
  }

  if (status === 'empty' || isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    )
  }

  return children
}
