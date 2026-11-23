import {
  LayoutDashboard,
  MoonStar,
  Apple,
  Activity,
  Bot,
  CheckSquare,
  Calendar,
  Sparkles,
  ShieldCheck,
  Settings,
  Users,
  Briefcase,
  BarChart3,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  Sliders,
  UserCog
} from 'lucide-react'

export const ROLES = {
  EMPLOYEE: 'employee',
  LEADER: 'leader',
  ADMIN: 'admin',
}

export const ROLE_CONFIG = {
  [ROLES.EMPLOYEE]: {
    name: 'Employee',
    label: 'Wellness Portal',
    badge: 'Employee',
    homePath: '/employee/dashboard',
    themeColor: 'purple',
    user: {
      name: 'Elena Rostova',
      roleTitle: 'Senior Product Designer',
      team: 'UX Innovation',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    },
  },
  [ROLES.LEADER]: {
    name: 'Team Leader',
    label: 'Leadership Hub',
    badge: 'Team Lead',
    homePath: '/leader/dashboard',
    themeColor: 'teal',
    user: {
      name: 'Dr. Sarah Jenkins',
      roleTitle: 'VP of Product Engineering',
      team: 'Core Platform',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    },
  },
  [ROLES.ADMIN]: {
    name: 'Admin',
    label: 'Admin Console',
    badge: 'Enterprise Admin',
    homePath: '/admin/dashboard',
    themeColor: 'slate',
    user: {
      name: 'Claire Vance',
      roleTitle: 'Chief People & Operations Officer',
      team: 'Enterprise Ops',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    },
  },
}

export const NAVIGATION_ITEMS = {
  [ROLES.EMPLOYEE]: [
    {
      title: 'Dashboard',
      path: '/employee/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      title: 'Cycle & Wellness',
      path: '/employee/cycle',
      icon: MoonStar,
      badge: 'Confidential',
    },
    {
      title: 'Nutrition',
      path: '/employee/nutrition',
      icon: Apple,
    },
    {
      title: 'Fitness & Movement',
      path: '/employee/fitness',
      icon: Activity,
    },
    {
      title: 'Mobility AI Assistant',
      path: '/employee/mobility/assistant',
      icon: Bot,
      badge: 'AI Co-Pilot',
    },
    {
      title: 'Tasks & Projects',
      path: '/employee/tasks',
      icon: CheckSquare,
    },
    {
      title: 'Schedule & Calendar',
      path: '/employee/calendar',
      icon: Calendar,
    },
    {
      title: 'Personal Insights',
      path: '/employee/insights',
      icon: Sparkles,
    },
    {
      title: 'Privacy & Consent Centre',
      path: '/employee/privacy',
      icon: ShieldCheck,
      badge: 'Employee-Controlled',
    },
    {
      title: 'Settings',
      path: '/employee/settings',
      icon: Settings,
    },
  ],
  [ROLES.LEADER]: [
    {
      title: 'Leader Dashboard',
      path: '/leader/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Team Availability & Members',
      path: '/leader/team',
      icon: Users,
    },
    {
      title: 'Tasks & Sprints',
      path: '/leader/tasks',
      icon: CheckSquare,
    },
    {
      title: 'Workload & Capacity',
      path: '/leader/workload',
      icon: Briefcase,
    },
    {
      title: 'Shared Insights',
      path: '/leader/shared-insights',
      icon: BarChart3,
      badge: 'Aggregated & Consented',
    },
    {
      title: 'Team Messages',
      path: '/leader/messages',
      icon: MessageSquare,
    },
    {
      title: 'Settings',
      path: '/leader/settings',
      icon: Settings,
    },
  ],
  [ROLES.ADMIN]: [
    {
      title: 'Admin Console',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Employee Directory',
      path: '/admin/employees',
      icon: Users,
    },
    {
      title: 'Teams & Departments',
      path: '/admin/teams',
      icon: Briefcase,
    },
    {
      title: 'Roles & Hierarchy',
      path: '/admin/roles',
      icon: UserCog,
    },
    {
      title: 'Access Permissions',
      path: '/admin/permissions',
      icon: UserCheck,
    },
    {
      title: 'Enterprise Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Security & Governance',
      path: '/admin/security',
      icon: ShieldAlert,
      badge: 'Architecture',
    },
    {
      title: 'System Settings',
      path: '/admin/settings',
      icon: Sliders,
    },
  ],
}
