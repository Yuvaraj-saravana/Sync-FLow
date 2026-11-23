import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  Bell,
  ChevronRight,
  HelpCircle
} from 'lucide-react'
import { ROLE_CONFIG, ROLES } from '../../routes/navConfig'

export default function TopHeader({
  currentRole,
  onOpenMobileSidebar,
}) {
  const location = useLocation()
  const roleMeta = ROLE_CONFIG[currentRole] || ROLE_CONFIG[ROLES.EMPLOYEE]
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)

  // Compute breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentPathLabel = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ')
    : 'Home'

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left Area: Mobile Trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm">
          <Link
            to={roleMeta.homePath}
            className="font-medium text-slate-500 hover:text-purple-700 capitalize transition-colors"
          >
            {roleMeta.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 capitalize truncate max-w-[140px] sm:max-w-xs">
            {currentPathLabel}
          </span>
        </nav>
      </div>

      {/* Right Area: Portal Badge, Notification, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Portal Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/70 text-purple-800 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
          {roleMeta.badge} Mode
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => setHasUnreadNotifications(false)}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Help / Guide Link */}
        <Link
          to="/"
          className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-slate-100 transition-colors"
          title="Back to SYNC FLOW Public Portal"
        >
          <HelpCircle className="w-5 h-5" />
        </Link>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-slate-200" />

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <img
            src={roleMeta.user.avatar}
            alt={roleMeta.user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-none">
              {roleMeta.user.name}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
              {roleMeta.user.team}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
