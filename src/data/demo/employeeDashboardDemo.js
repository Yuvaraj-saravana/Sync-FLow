/**
 * SYNC FLOW - Temporary Demo Dataset for Employee Dashboard
 * 
 * IMPORTANT:
 * - This file contains visual mock data ONLY.
 * - Do not store real user data here.
 * - When real module stores/APIs are connected, this file will be retired.
 */

export const IS_DEMO_DATASET = true

export const DEMO_WELLNESS_OVERVIEW = {
  energy: {
    label: 'Self-Reported Energy',
    value: 'High (88%)',
    subtitle: 'Optimal for self-selected deep work',
    badgeText: 'Energy High',
    badgeVariant: 'purple',
    accentColor: 'purple',
  },
  wellnessBalance: {
    label: 'Wellness Balance',
    value: '92/100',
    subtitle: 'Hydration and mobility on track',
    badgeText: 'Balanced',
    badgeVariant: 'teal',
    accentColor: 'teal',
  },
  cycleInsight: {
    label: 'Cycle Insight (Private)',
    value: 'Follicular',
    subtitle: 'Day 9 · Confidential to you',
    badgeText: 'Private',
    badgeVariant: 'purple',
    accentColor: 'purple',
  },
  workload: {
    label: 'Project Workload',
    value: '3 Tasks',
    subtitle: '2 high-priority deliverables',
    badgeText: 'On Schedule',
    badgeVariant: 'amber',
    accentColor: 'amber',
  },
}

export const DEMO_CYCLE_WELLNESS = {
  currentDay: 9,
  phaseName: 'Follicular Window',
  phaseKey: 'follicular',
  isConfidential: true,
  phases: [
    { key: 'menstrual', name: 'Menstrual', days: 'Days 1 - 5', isActive: false },
    { key: 'follicular', name: 'Follicular', days: 'Days 6 - 13 (Active)', isActive: true },
    { key: 'ovulatory', name: 'Ovulatory', days: 'Days 14 - 17', isActive: false },
    { key: 'luteal', name: 'Luteal', days: 'Days 18 - 28', isActive: false },
  ],
  bioRhythmSummary:
    'Estrogen rise during the follicular window often correlates with higher energy and verbal fluency. Use this personal awareness whenever choosing how to plan your own breaks, self-care, or study hours.',
  awarenessMetric: 'Self-Awareness Metric',
}

export const DEMO_NUTRITION_SUMMARY = {
  targetPercentage: 78,
  hydrationCurrent: 2.1,
  hydrationTarget: 2.7,
  nutrientPriorities: [
    'Zinc & Pumpkin Seeds',
    'Fermented Foods',
    'Omega-3 Salmon',
  ],
  suggestedLunch:
    'Mediterranean salmon grain bowl with seeds and avocado.',
}

export const DEMO_FITNESS_SUMMARY = {
  intensityBadge: 'Self-Paced',
  activeBurnKcal: 460,
  targetBurnKcal: 550,
  movementOptions: [
    { label: 'Cardio & Intervals', isPrimary: true },
    { label: 'Functional Strength', isPrimary: false },
    { label: 'Posture Reset', isPrimary: false },
  ],
  breaksLogged: 3,
  breaksTotal: 4,
  nextStretchTime: '3:15 PM',
}

export const DEMO_WORKPLACE_TASKS = [
  {
    id: 'task-1',
    title: 'Lead Q4 SYNC FLOW Design Architecture Kickoff',
    project: 'Design Platform',
    time: '10:00 AM - 11:30 AM',
    requirement: 'High Priority · Milestone Deadline (Today 12 PM)',
    badgeVariant: 'purple',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Executive Presentation Deck for Leadership Review',
    project: 'Core Strategy',
    time: '2:00 PM - 3:15 PM',
    requirement: 'Project Deliverable · Employee-Selected Focus Block',
    badgeVariant: 'teal',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Asynchronous Code & UI Spec Verification',
    project: 'Engineering Alignment',
    time: '4:30 PM - 5:30 PM',
    requirement: 'Review Deliverable · Self-Paced Deep Work',
    badgeVariant: 'slate',
    completed: false,
  },
]

export const DEMO_MOBILITY_AI_BANNER = {
  title: 'Mobility AI Assistant Ready',
  prompt: 'Ask Mobility AI about personal wellness suggestions, draft a task update, or plan an ergonomic break.',
  linkText: 'Open Assistant',
}
