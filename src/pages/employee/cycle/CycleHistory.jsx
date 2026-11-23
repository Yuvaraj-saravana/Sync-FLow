import { Link } from 'react-router-dom'
import {
  History,
  CheckCircle2,
  PlusCircle,
  Inbox,
  Lock
} from 'lucide-react'
import PageContainer from '../../../components/layout/PageContainer'
import Badge from '../../../components/common/Badge'
import CycleNavigation from '../../../components/cycle/CycleNavigation'
import { useCycle } from '../../../context/useCycle'

export default function CycleHistory() {
  const { profile, checkIns } = useCycle()
  const isConfigured = Boolean(profile?.isConfigured && profile?.lastPeriodStart)

  return (
    <PageContainer
      title="Cycle & Wellness History"
      subtitle="Chronological log of recorded periods, cycle lengths, and daily check-ins"
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
          <span>New Check-in</span>
        </Link>
      }
    >
      <CycleNavigation />

      <div className="space-y-6">
        {/* Past Cycles Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recorded Cycle Logs</h3>
                <p className="text-xs text-slate-500">Historical period dates and verified lengths</p>
              </div>
            </div>

            <Badge variant="slate" size="sm">
              {isConfigured ? '1 Cycle Active' : '0 Recorded Cycles'}
            </Badge>
          </div>

          <div className="py-6">
            {!isConfigured ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No Historical Cycles Recorded Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Historical cycle comparisons are calculated only from genuine recorded period start dates. No fictional cycle data is generated.
                </p>
                <Link
                  to="/employee/cycle"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Configure Baseline Start Date</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2 px-3">Cycle Period</th>
                      <th className="py-2 px-3">Start Date</th>
                      <th className="py-2 px-3">Length</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-800">Current Active Cycle</td>
                      <td className="py-3 px-3 text-slate-600">
                        {new Date(profile.lastPeriodStart).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 text-slate-600">~{profile.cycleLengthDays} days (Expected)</td>
                      <td className="py-3 px-3">
                        <Badge variant="purple" size="sm">In Progress</Badge>
                      </td>
                    </tr>
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

          <div className="py-6">
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
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Energy</th>
                      <th className="py-2 px-3">Comfort / Symptoms</th>
                      <th className="py-2 px-3">Mood</th>
                      <th className="py-2 px-3">Sleep</th>
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
    </PageContainer>
  )
}
