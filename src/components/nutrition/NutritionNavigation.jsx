import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  ScanLine,
  History
} from 'lucide-react'

export default function NutritionNavigation() {
  const navTabs = [
    {
      name: 'Overview',
      path: '/employee/nutrition',
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: 'Nutrition Profile',
      path: '/employee/nutrition/profile',
      icon: User,
    },
    {
      name: 'Meal Planner',
      path: '/employee/nutrition/meal-planner',
      icon: CalendarCheck,
    },
    {
      name: 'Food Scanner',
      path: '/employee/nutrition/food-scanner',
      icon: ScanLine,
    },
    {
      name: 'History & Logs',
      path: '/employee/nutrition/history',
      icon: History,
    },
  ]

  return (
    <nav
      aria-label="Nutrition navigation"
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
