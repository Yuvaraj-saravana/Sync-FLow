import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  History,
  CheckCircle2,
  PlusCircle,
  Inbox,
  Lock,
  Edit2,
  Trash2,
  Droplets,
  Calendar
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import PeriodModal from '../../../components/cycle/PeriodModal'
import DeletePeriodModal from '../../../components/cycle/DeletePeriodModal'
import { useCycle } from '../../../context/useCycle'
import { parseDateString } from '../../../services/cycleCalculator'

export default function CycleHistory() {
  const { periods, addPeriod, updatePeriod, deletePeriod, checkIns } = useCycle()

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState(null)
  const [deletingPeriod, setDeletingPeriod] = useState(null)

  // Calculate duration helper
  const getDurationText = (startDateStr, endDateStr) => {
    const start = parseDateString(startDateStr)
    if (!start) return '—'

    if (!endDateStr) {
      const today = new Date()
      const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const diffDays = Math.max(1, Math.floor((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24)) + 1)
      return `Ongoing (Day ${diffDays})`
    }

    const end = parseDateString(endDateStr)
    if (!end) return '—'

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`
  }

  // Flow intensity badge helper
  const getFlowBadgeVariant = (intensity) => {
    switch (intensity) {
      case 'Heavy':
        return 'rose'
      case 'Light':
        return 'teal'
      case 'Medium':
      default:
        return 'purple'
    }
  }

  const handleOpenRecord = () => {
    setEditingPeriod(null)
    setIsPeriodModalOpen(true)
  }

  const handleOpenEdit = (period) => {
    setEditingPeriod(period)
    setIsPeriodModalOpen(true)
  }

  const handlePeriodSubmit = (data) => {
    if (editingPeriod) {
      return updatePeriod(editingPeriod.id, data)
    }
    return addPeriod(data)
  }

  const sortedPeriods = useMemo(() => {
    return [...periods].sort((a, b) => (b.startDate > a.startDate ? 1 : -1))
  }, [periods])

  return (
    <PageContainer
      title="Cycle & Wellness History"
      subtitle="Chronological log of recorded periods, flow intensity, and daily wellness check-ins"
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
            onClick={handleOpenRecord}
            className="text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Period</span>
          </button>
          <Link
            to="/employee/cycle/check-in"
            className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>New Check-in</span>
          </Link>
        </div>
      }
    >
      <CycleNavigation />

      <div className="space-y-6">
        {/* Period Records Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recorded Period Logs</h3>
                <p className="text-xs text-slate-500">Historical start/end dates, duration, and flow intensity</p>
              </div>
            </div>

            <Badge variant="slate" size="sm">
              {periods.length} {periods.length === 1 ? 'Period Logged' : 'Periods Logged'}
            </Badge>
          </div>

          <div className="py-4">
            {sortedPeriods.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No Period Records Logged Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Log your menstrual periods to enable personalized cycle length tracking and phase estimations without assuming a default 28-day cycle.
                </p>
                <button
                  type="button"
                  onClick={handleOpenRecord}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Record Your First Period</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Start Date</th>
                      <th className="py-2.5 px-3">End Date</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Flow Intensity</th>
                      <th className="py-2.5 px-3">Personal Notes</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedPeriods.map((period) => (
                      <tr key={period.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{period.startDate}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {period.endDate ? (
                            <span>{period.endDate}</span>
                          ) : (
                            <Badge variant="purple" size="sm">Ongoing</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-700">
                          {getDurationText(period.startDate, period.endDate)}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1">
                            <Badge variant={getFlowBadgeVariant(period.flowIntensity)} size="sm">
                              <Droplets className="w-3 h-3" />
                              <span>{period.flowIntensity || 'Medium'}</span>
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">
                          {period.notes ? (
                            <span title={period.notes}>{period.notes}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(period)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                              title="Edit period record"
                              aria-label="Edit period record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingPeriod(period)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete period record"
                              aria-label="Delete period record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Daily Check-in Logs Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Wellness Check-ins</h3>
                <p className="text-xs text-slate-500">Self-reported symptoms, energy, and physical comfort</p>
              </div>
            </div>

            <Badge variant="purple" size="sm">
              {checkIns.length} Entries Logged
            </Badge>
          </div>

          <div className="py-4">
            {checkIns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No Check-in Entries Recorded</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Daily logs help you observe correlations between your cycle phases, sleep, and physical comfort.
                </p>
                <Link
                  to="/employee/cycle/check-in"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Log Your First Check-in</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Energy</th>
                      <th className="py-2.5 px-3">Comfort / Symptoms</th>
                      <th className="py-2.5 px-3">Mood</th>
                      <th className="py-2.5 px-3">Sleep</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {checkIns.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-800">{item.date}</td>
                        <td className="py-3 px-3 text-purple-700 font-medium">{item.energy}</td>
                        <td className="py-3 px-3 text-slate-600">{item.comfort}</td>
                        <td className="py-3 px-3 text-slate-600">{item.mood}</td>
                        <td className="py-3 px-3 text-slate-600">{item.sleepHours} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onSubmit={handlePeriodSubmit}
        initialData={editingPeriod}
        title={editingPeriod ? 'Edit Period Record' : 'Record Period'}
      />

      <DeletePeriodModal
        isOpen={Boolean(deletingPeriod)}
        onClose={() => setDeletingPeriod(null)}
        onConfirm={deletePeriod}
        period={deletingPeriod}
      />
    </PageContainer>
  )
}
