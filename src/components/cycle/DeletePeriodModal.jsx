import { AlertTriangle, Trash2 } from 'lucide-react'

export default function DeletePeriodModal({ isOpen, onClose, onConfirm, period }) {
  if (!isOpen || !period) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-sm shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Delete Period Record?
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to remove the period record for{' '}
            <strong className="text-slate-800">
              {period.startDate} {period.endDate ? `to ${period.endDate}` : '(ongoing)'}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(period.id)
              onClose()
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>
        </div>
      </div>
    </div>
  )
}
