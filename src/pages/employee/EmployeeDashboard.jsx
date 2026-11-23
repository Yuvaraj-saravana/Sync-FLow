import { Link } from 'react-router-dom'
import {
  Sparkles,
  MoonStar,
  Activity,
  Apple,
  CheckSquare,
  Clock,
  Droplets,
  ShieldCheck,
  Zap,
  Info,
  Lock,
  ArrowRight,
  Bot
} from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import DataStateWrapper from '../../components/common/DataStateWrapper'
import { useEmployeeDashboard } from '../../hooks/useEmployeeDashboard'

export default function EmployeeDashboard() {
  const {
    isDemo,
    status,
    overview,
    cycle,
    nutrition,
    fitness,
    tasks,
    mobility,
  } = useEmployeeDashboard()

  return (
    <PageContainer
      title="Employee Wellness & Productivity"
      subtitle="Personalized wellness metrics and project task organization with employee-controlled privacy"
      badge={
        <Badge variant="purple" size="md">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>{cycle.phaseName} · Day {cycle.currentDay}</span>
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/employee/insights"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Insights</span>
          </Link>
          <Badge variant="sage" size="md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Employee-Controlled Privacy</span>
          </Badge>
        </div>
      }
    >
      {/* 1. Temporary Demo Notice Banner */}
      {isDemo && (
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <p>
              <strong className="font-semibold">Isolated Demo Data:</strong> Dashboard displays visual mock datasets isolated from live user storage. Cycle information is strictly confidential and never shared with team leads or used to assign tasks.
            </p>
          </div>
          <span className="shrink-0 font-medium text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200/70 shadow-2xs">
            Demo Store v1.0
          </span>
        </div>
      )}

      {/* 2. Mobility AI Quick Access Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-purple-300 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">{mobility.title}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Central Assistant
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5 max-w-xl">
              {mobility.prompt}
            </p>
          </div>
        </div>

        <Link
          to="/employee/mobility/assistant"
          className="relative z-10 shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-purple-50 transition-all shadow-xs hover:shadow-sm"
        >
          <span>{mobility.linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
        </Link>
      </div>

      {/* 3. Today's Wellness & Workload Overview Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Today's Wellness & Workload Overview
          </h2>
          <Link
            to="/employee/insights"
            className="text-xs text-purple-700 hover:text-purple-800 font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>View Trend Insights</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <DataStateWrapper status={status.overview} loadingMessage="Loading wellness overview...">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={overview.energy.label}
              value={overview.energy.value}
              subtitle={overview.energy.subtitle}
              badgeText={overview.energy.badgeText}
              icon={Zap}
              accentColor={overview.energy.accentColor}
              to="/employee/insights"
            />
            <StatCard
              title={overview.wellnessBalance.label}
              value={overview.wellnessBalance.value}
              subtitle={overview.wellnessBalance.subtitle}
              badgeText={overview.wellnessBalance.badgeText}
              icon={Sparkles}
              accentColor={overview.wellnessBalance.accentColor}
              to="/employee/insights"
            />
            <StatCard
              title={overview.cycleInsight.label}
              value={overview.cycleInsight.value}
              subtitle={overview.cycleInsight.subtitle}
              badgeText={overview.cycleInsight.badgeText}
              icon={MoonStar}
              accentColor={overview.cycleInsight.accentColor}
              to="/employee/cycle"
            />
            <StatCard
              title={overview.workload.label}
              value={overview.workload.value}
              subtitle={overview.workload.subtitle}
              badgeText={overview.workload.badgeText}
              icon={CheckSquare}
              accentColor={overview.workload.accentColor}
              to="/employee/tasks"
            />
          </div>
        </DataStateWrapper>
      </section>

      {/* 4. Cycle & Wellness Section (Private to Employee) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <MoonStar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Cycle & Personal Wellness Insights
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  <Lock className="w-3 h-3 text-purple-600" /> Private to Employee
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Personal wellness trends to help you understand your rhythms. Never accessible to managers or used for task assignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="rose" size="md">
              Cycle Day {cycle.currentDay} · {cycle.phaseName}
            </Badge>
            <Link
              to="/employee/cycle"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
            >
              <span>View Cycle & Wellness</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <DataStateWrapper status={status.cycle} loadingMessage="Loading cycle analytics...">
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-4 gap-2 mb-2 text-center text-xs">
              {cycle.phases.map((p) => (
                <div
                  key={p.key}
                  className={`py-1 px-2 rounded-lg border ${
                    p.isActive
                      ? 'bg-purple-50 border-2 border-purple-600 text-purple-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="block flex items-center justify-center gap-1">
                    {p.isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />}
                    {p.name}
                  </span>
                  <span className={`text-[10px] ${p.isActive ? 'text-purple-700' : 'text-slate-400'}`}>
                    {p.days}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-800">
                  Personal Bio-Rhythm Summary (Confidential):
                </p>
                <p className="text-sm text-slate-700">
                  {cycle.bioRhythmSummary}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-800">
                  {cycle.awarenessMetric}
                </span>
              </div>
            </div>
          </div>
        </DataStateWrapper>
      </section>

      {/* 5. Nutrition & Fitness Summaries (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Summary */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nutrition & Metabolic Fuel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Optional evidence-informed nutrition ideas for daily vitality
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="teal" size="sm">{nutrition.targetPercentage}% Target</Badge>
                <Link
                  to="/employee/nutrition"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>Nutrition AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <DataStateWrapper status={status.nutrition} loadingMessage="Loading nutrition metrics...">
              <div className="py-4 space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-teal-600" /> Daily Hydration Goal
                  </span>
                  <span className="font-bold text-slate-800">{nutrition.hydrationCurrent}L / {nutrition.hydrationTarget}L</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${nutrition.targetPercentage}%` }}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Optional Nutrient Support:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nutrition.nutrientPriorities.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DataStateWrapper>
          </div>

          <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl text-xs text-teal-900 mt-2">
            <strong>Suggested Lunch Idea:</strong> {nutrition.suggestedLunch}
          </div>
        </div>

        {/* Fitness Summary */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fitness & Movement
                  </h3>
                  <p className="text-xs text-slate-500">
                    Movement routines tailored to your personal physical comfort
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="rose" size="sm">{fitness.intensityBadge}</Badge>
                <Link
                  to="/employee/fitness"
                  className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>Fitness AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <DataStateWrapper status={status.fitness} loadingMessage="Loading fitness metrics...">
              <div className="py-4 space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-rose-500" /> Active Burn
                  </span>
                  <span className="font-bold text-slate-800">{fitness.activeBurnKcal} / {fitness.targetBurnKcal} kcal</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((fitness.activeBurnKcal / fitness.targetBurnKcal) * 100)}%` }}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Suggested Movement Options:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {fitness.movementOptions.map((opt, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg ${
                          opt.isPrimary
                            ? 'bg-rose-50 border border-rose-200 text-rose-800 font-medium'
                            : 'bg-slate-50 border border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DataStateWrapper>
          </div>

          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-xs text-rose-900 mt-2">
            <strong>Desk Micro-break:</strong> {fitness.breaksLogged} of {fitness.breaksTotal} breaks logged today. Next ergonomic stretch suggested at {fitness.nextStretchTime}.
          </div>
        </div>
      </div>

      {/* 6. Today's Workplace Tasks Section */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Today's Workplace Tasks
              </h3>
              <p className="text-xs text-slate-500">
                Organized by project requirements, deadlines, workload, and self-reported availability & preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="purple" size="sm">{tasks.length} Tasks Active</Badge>
            <Link
              to="/employee/tasks"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Manage Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <DataStateWrapper
          status={status.tasks}
          isEmpty={tasks.length === 0}
          emptyTitle="No tasks scheduled"
          emptyDescription="You have no workplace tasks on your schedule for today."
          loadingMessage="Loading workplace tasks..."
        >
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={task.completed}
                    className="mt-1 sm:mt-0 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <div>
                    <Link
                      to="/employee/tasks"
                      className="text-sm font-semibold text-slate-800 hover:text-purple-700 transition-colors"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {task.time}
                      </span>
                      <span>·</span>
                      <span className="text-purple-700 font-medium">
                        {task.project}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant={task.badgeVariant} size="sm">
                    {task.requirement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DataStateWrapper>
      </section>
    </PageContainer>
  )
}
