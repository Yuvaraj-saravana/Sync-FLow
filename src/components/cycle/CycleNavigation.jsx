import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  History,
  Sparkles,
  Settings,
  Bot
} from 'lucide-react'

export default function CycleNavigation() {
  const navTabs = [
    {
      name: 'Overview',
      path: '/employee/cycle',
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: 'AI Assistant',
      path: '/employee/cycle/assistant',
      icon: Bot,
    },
    {
      name: 'Calendar',
      path: '/employee/cycle/calendar',
      icon: Calendar,
    },
    {
      name: 'Daily Check-in',
      path: '/employee/cycle/check-in',
      icon: CheckCircle2,
    },
    {
      name: 'Cycle History',
      path: '/employee/cycle/history',
      icon: History,
    },
    {
      name: 'Personal Insights',
      path: '/employee/cycle/insights',
      icon: Sparkles,
    },
    {
      name: 'Settings',
      path: '/employee/cycle/settings',
      icon: Settings,
    },
  ]

  return (
    <nav
      aria-label="Cycle & Wellness navigation"
      className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs mb-6 overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-1 min-w-max">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs shadow-purple-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.name}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
