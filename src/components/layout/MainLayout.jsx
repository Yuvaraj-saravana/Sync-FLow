import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import { ROLES } from '../../routes/navConfig'

export default function MainLayout() {
  const location = useLocation()
  
  // Derive current role directly from active route path
  const getRoleFromPath = (path) => {
    if (path.startsWith('/leader')) return ROLES.LEADER
    if (path.startsWith('/admin')) return ROLES.ADMIN
    return ROLES.EMPLOYEE
  }

  const currentRole = getRoleFromPath(location.pathname)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#fcfbfe] flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRole={currentRole}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          currentRole={currentRole}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
