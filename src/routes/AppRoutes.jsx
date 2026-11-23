import { Routes, Route, Navigate } from 'react-router-dom'
import {
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
  UserCog,
  LayoutDashboard
} from 'lucide-react'

import MainLayout from '../components/layout/MainLayout'
import PlaceholderPage from '../components/common/PlaceholderPage'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'

// Cycle & Wellness AI Module Pages
import { CycleProvider } from '../context/CycleContext'
import CycleOverview from '../pages/employee/cycle/CycleOverview'
import CycleCalendar from '../pages/employee/cycle/CycleCalendar'
import WellnessCheckIn from '../pages/employee/cycle/WellnessCheckIn'
import CycleHistory from '../pages/employee/cycle/CycleHistory'
import CycleInsights from '../pages/employee/cycle/CycleInsights'
import CycleSettings from '../pages/employee/cycle/CycleSettings'

export default function AppRoutes() {
  return (
    <CycleProvider>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Internal Protected Shell Routes */}
      <Route element={<MainLayout />}>
        {/* Employee Portal Routes */}
        <Route path="/employee">
          <Route index element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="cycle" element={<CycleOverview />} />
          <Route path="cycle/calendar" element={<CycleCalendar />} />
          <Route path="cycle/check-in" element={<WellnessCheckIn />} />
          <Route path="cycle/history" element={<CycleHistory />} />
          <Route path="cycle/insights" element={<CycleInsights />} />
          <Route path="cycle/settings" element={<CycleSettings />} />
          <Route
            path="nutrition"
            element={
              <PlaceholderPage
                title="Nutritional Wellness & Meal Ideas"
                description="Optional evidence-informed metabolic fuel, hydration targets, and self-guided nutrition planning."
                role="Employee"
                icon={Apple}
                tags={['Micronutrient Guidance', 'Hydration Target', 'Anti-Inflammatory Ideas', 'Personal Meal Notes']}
              />
            }
          />
          <Route
            path="fitness"
            element={
              <PlaceholderPage
                title="Fitness & Movement Hub"
                description="Movement routines and ergonomic resets tailored to your personal physical comfort and energy."
                role="Employee"
                icon={Activity}
                tags={['Desk Ergonomics', 'Cardio & Strength', 'Restorative Movement', 'Posture Resets']}
              />
            }
          />
          <Route
            path="mobility/assistant"
            element={
              <PlaceholderPage
                title="Mobility AI – Personal AI Assistant"
                description="Central personal AI assistant supporting text and voice conversations, wellness, nutrition, fitness, schedule, task updates, and employee-approved communication drafting."
                role="Employee"
                icon={Bot}
                tags={['Voice & Text Chat', 'Wellness & Cycle Queries', 'Task Updates', 'Drafting Co-Pilot', 'Cross-Module Insights']}
              />
            }
          />
          <Route
            path="tasks"
            element={
              <PlaceholderPage
                title="Workplace Tasks & Deliverables"
                description="Workplace task management organized by project requirements, deadlines, workload, and self-reported employee availability."
                role="Employee"
                icon={CheckSquare}
                tags={['Project Milestones', 'Deadline Tracking', 'Workload Balancing', 'Self-Selected Focus Blocks']}
              />
            }
          />
          <Route
            path="calendar"
            element={
              <PlaceholderPage
                title="Schedule & Work Calendar"
                description="Calendar integration showing meetings, deliverables, and self-selected focus hours."
                role="Employee"
                icon={Calendar}
                tags={['Meeting Load Balancer', 'Self-Selected Focus Time', 'Rest Breaks', 'Deliverable Milestones']}
              />
            }
          />
          <Route
            path="insights"
            element={
              <PlaceholderPage
                title="Personal Wellness Insights"
                description="Holistic personal metrics correlating self-reported energy, sleep, movement, and wellness habits."
                role="Employee"
                icon={Sparkles}
                tags={['Personal Trends', 'Wellness Correlations', 'Habit Tracker', 'Energy Journal']}
              />
            }
          />
          <Route
            path="privacy"
            element={
              <PlaceholderPage
                title="Privacy & Consent Centre"
                description="Employee-controlled privacy settings and explicit consent management. Cycle and personal health data remain strictly private to the employee."
                role="Employee"
                icon={ShieldCheck}
                tags={['Employee Consent Controls', 'Data Boundary Firewall', 'Explicit Sharing Toggles', 'Audit Log']}
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Employee Account & Preferences"
                description="Configure notifications, wearable integrations, schedule synchronization, and privacy preferences."
                role="Employee"
                icon={Settings}
                tags={['Notifications', 'Wearable Integrations', 'Theme & Density', 'Language & Locale']}
              />
            }
          />
        </Route>

        {/* Team Leader Hub Routes */}
        <Route path="/leader">
          <Route index element={<Navigate to="/leader/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <PlaceholderPage
                title="Team Leadership & Workload Hub"
                description="Team project delivery tracking, sustainable capacity planning, and empathetic management guidance. Personal cycle data is completely inaccessible."
                role="Team Leader"
                icon={LayoutDashboard}
                tags={['Team Capacity Overview', 'Deliverable Milestones', 'Workload Balancing', 'Support Cues']}
              />
            }
          />
          <Route
            path="team"
            element={
              <PlaceholderPage
                title="Team Members & Work Availability"
                description="Overview of squad availability and focus hours explicitly shared by employees. No private health information is visible."
                role="Team Leader"
                icon={Users}
                tags={['Roster Management', 'Consented Availability', 'Focus Hours', 'Check-In Schedules']}
              />
            }
          />
          <Route
            path="tasks"
            element={
              <PlaceholderPage
                title="Team Task & Sprint Distribution"
                description="Equitable project assignment based on project requirements, deadlines, team capacity, and employee availability."
                role="Team Leader"
                icon={CheckSquare}
                tags={['Sprint Planning', 'Task Velocity', 'Burnout Prevention', 'Dependency Mapping']}
              />
            }
          />
          <Route
            path="workload"
            element={
              <PlaceholderPage
                title="Workload & Capacity Analysis"
                description="Objective indicators of operational workload across team projects, deliverables, and delivery schedules."
                role="Team Leader"
                icon={Briefcase}
                tags={['Capacity Distribution', 'Overtime Prevention', 'Resource Planning', 'Workplace Cadence']}
              />
            }
          />
          <Route
            path="shared-insights"
            element={
              <PlaceholderPage
                title="Shared Team Availability & Capacity Insights"
                description="Aggregated team availability and work preferences explicitly shared by employees. No cycle or private health details are accessible."
                role="Team Leader"
                icon={BarChart3}
                tags={['Explicitly Consented Availability', 'Aggregated Capacity', 'Sprint Velocity', 'Workplace Cadence']}
              />
            }
          />
          <Route
            path="messages"
            element={
              <PlaceholderPage
                title="Team Communication & Check-Ins"
                description="Supportive touchpoints, asynchronous check-ins, and proactive team appreciation channels."
                role="Team Leader"
                icon={MessageSquare}
                tags={['Async Check-Ins', 'Kudos Wall', 'Support Channels', 'Meeting Reductions']}
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Leadership Hub Preferences"
                description="Configure team alerts, calendar thresholds, and meeting cadence rules."
                role="Team Leader"
                icon={Settings}
                tags={['Threshold Alerts', 'Sprint Rules', 'Export Reports', 'Integrations']}
              />
            }
          />
        </Route>

        {/* Enterprise Admin Console Routes */}
        <Route path="/admin">
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <PlaceholderPage
                title="Enterprise Administration Console"
                description="Organization-wide seat utilization, department structures, governance policies, and platform controls."
                role="Admin"
                icon={LayoutDashboard}
                tags={['Enterprise Pulse', 'Seat Utilization', 'Policy Status', 'Department Overview']}
              />
            }
          />
          <Route
            path="employees"
            element={
              <PlaceholderPage
                title="Employee & Identity Directory"
                description="Directory management with SCIM provisioning, SSO status, and department affiliations."
                role="Admin"
                icon={Users}
                tags={['SCIM / Okta Sync', 'User Roster', 'De-provisioning', 'License Allocation']}
              />
            }
          />
          <Route
            path="teams"
            element={
              <PlaceholderPage
                title="Departments & Teams Structure"
                description="Hierarchy configuration across engineering, design, marketing, operations, and leadership."
                role="Admin"
                icon={Briefcase}
                tags={['Org Hierarchy', 'Cross-Functional Units', 'Department Leads', 'Location Clusters']}
              />
            }
          />
          <Route
            path="roles"
            element={
              <PlaceholderPage
                title="Role-Based Access Management"
                description="Define operational roles with strict scope limits and role separation principles."
                role="Admin"
                icon={UserCog}
                tags={['Role Definitions', 'Role Boundaries', 'Scope Configuration', 'Role Assignments']}
              />
            }
          />
          <Route
            path="permissions"
            element={
              <PlaceholderPage
                title="Data Boundaries & Privacy Permissions"
                description="Strict firewall enforcing that managers cannot view individual health or cycle details under any circumstances."
                role="Admin"
                icon={UserCheck}
                tags={['Boundary Policies', 'Employee Privacy Firewall', 'Consent Verification', 'Access Matrix']}
              />
            }
          />
          <Route
            path="analytics"
            element={
              <PlaceholderPage
                title="Enterprise Workforce Analytics"
                description="Aggregated organizational workload trends, engagement indices, and retention indicators."
                role="Admin"
                icon={BarChart3}
                tags={['Workload Trends', 'Productivity Metrics', 'Retention Indicators', 'Engagement Index']}
              />
            }
          />
          <Route
            path="security"
            element={
              <PlaceholderPage
                title="Security & Governance Architecture"
                description="Target enterprise security standards, data segregation policies, and immutable system audit logging."
                role="Admin"
                icon={ShieldAlert}
                tags={['Data Segregation', 'Audit Logging', 'Target Governance', 'Policy Controls']}
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Enterprise System Configuration"
                description="Tenant configurations, SSO SAML 2.0 settings, and global policy defaults."
                role="Admin"
                icon={Sliders}
                tags={['SAML 2.0 SSO', 'Domain Verification', 'Custom Branding', 'API Gateway']}
              />
            }
          />
        </Route>
      </Route>

      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </CycleProvider>
  )
}
