import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRightLeft
} from 'lucide-react'
import { NAVIGATION_ITEMS, ROLES, ROLE_CONFIG } from '../../routes/navConfig'

export default function Sidebar({
  currentRole,
  onRoleChange,
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = NAVIGATION_ITEMS[currentRole] || []
  const roleMeta = ROLE_CONFIG[currentRole] || ROLE_CONFIG[ROLES.EMPLOYEE]

  const handleRoleSwitch = (newRole) => {
    if (onRoleChange) {
      onRoleChange(newRole)
    }
    const targetConfig = ROLE_CONFIG[newRole]
    if (targetConfig) {
      navigate(targetConfig.homePath)
    }
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out lg:static
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand & Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 shrink-0">
          <NavLink
            to="/"
            className="flex items-center gap-3 overflow-hidden group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white flex items-center justify-center shadow-sm shadow-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  SYNC FLOW
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-700">
                  {roleMeta.label}
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Switcher Toolbar (Development & Multi-Persona Navigation) */}
        <div className={`p-3 border-b border-slate-200/60 bg-slate-50/70 shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-purple-600" /> Active Persona
                </span>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-100/70 px-1.5 py-0.5 rounded">
                  Dev Preview Only
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(ROLES.EMPLOYEE)}
                  className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                    currentRole === ROLES.EMPLOYEE
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(ROLES.LEADER)}
                  className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                    currentRole === ROLES.LEADER
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Leader
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(ROLES.ADMIN)}
                  className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                    currentRole === ROLES.ADMIN
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                title="Switch Role"
                onClick={() => {
                  const roles = [ROLES.EMPLOYEE, ROLES.LEADER, ROLES.ADMIN]
                  const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length
                  handleRoleSwitch(roles[nextIndex])
                }}
                className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center hover:bg-purple-100 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Navigation
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                title={isCollapsed ? item.title : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-purple-50 text-purple-800 font-semibold shadow-2xs border border-purple-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.title}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-purple-200/70 text-purple-900 border-purple-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-700 rounded-r-full" />
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-slate-200/80 bg-white shrink-0">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-200/70 ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <img
              src={roleMeta.user.avatar}
              alt={roleMeta.user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-200 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {roleMeta.user.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {roleMeta.user.roleTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
