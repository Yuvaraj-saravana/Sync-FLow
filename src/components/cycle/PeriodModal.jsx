import { useState } from 'react'
import { X, Calendar, AlertCircle, Droplets, CheckCircle2 } from 'lucide-react'
import { formatDateString } from '../../services/cycleCalculator'

function PeriodForm({ initialData, onClose, onSubmit }) {
  const [todayStr] = useState(() => formatDateString(new Date()))
  const [startDate, setStartDate] = useState(() => initialData?.startDate || todayStr)
  const [endDate, setEndDate] = useState(() => initialData?.endDate || '')
  const [isOngoing, setIsOngoing] = useState(() => (initialData ? !initialData.endDate : true))
  const [flowIntensity, setFlowIntensity] = useState(() => initialData?.flowIntensity || 'Medium')
  const [notes, setNotes] = useState(() => initialData?.notes || '')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const handleOngoingToggle = (e) => {
    const checked = e.target.checked
    setIsOngoing(checked)
    if (checked) {
      setEndDate('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    setServerError('')

    const payload = {
      startDate,
      endDate: isOngoing ? null : endDate || null,
      flowIntensity,
      notes: notes.trim(),
    }

    const result = onSubmit(payload)
    if (result && !result.success) {
      if (result.errors) {
        setErrors(result.errors)
        if (result.errors.general) {
          setServerError(result.errors.general)
        }
      }
    } else {
      onClose()
    }
  }

  return (
    <div>
      {/* Error Alert */}
      {serverError && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            max={todayStr}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
          />
          {errors.startDate && (
            <p className="text-xs text-rose-600 mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              End Date (Optional)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={handleOngoingToggle}
                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Ongoing / Active</span>
            </label>
          </div>
          {!isOngoing && (
            <>
              <input
                type="date"
                min={startDate || undefined}
                max={todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
              {errors.endDate && (
                <p className="text-xs text-rose-600 mt-1">{errors.endDate}</p>
              )}
            </>
          )}
        </div>

        {/* Flow Intensity */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-purple-600" />
            <span>Flow Intensity</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Light', desc: 'Minimal flow' },
              { label: 'Medium', desc: 'Standard flow' },
              { label: 'Heavy', desc: 'Intense flow' },
            ].map((flow) => (
              <button
                key={flow.label}
                type="button"
                onClick={() => setFlowIntensity(flow.label)}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  flowIntensity === flow.label
                    ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold ring-1 ring-purple-400 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs block font-semibold">{flow.label}</span>
                <span className="text-[10px] text-slate-400 block">{flow.desc}</span>
              </button>
            ))}
          </div>
          {errors.flowIntensity && (
            <p className="text-xs text-rose-600 mt-1">{errors.flowIntensity}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Personal Notes (Private)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional observations (cramps, symptoms, flow changes)..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-purple-600 focus:bg-white resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{initialData ? 'Update Period' : 'Save Period'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default function PeriodModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  title = 'Record Period',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keyed inner form avoids useEffect and synchronous setState warnings */}
        <PeriodForm
          key={initialData?.id || (isOpen ? 'new-period' : 'closed')}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
