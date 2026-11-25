/**
 * SYNC FLOW - Cycle & Wellness AI Assistant Service
 * 
 * Modular domain capability for cycle & wellness conversational queries.
 * Designed to plug into the future Central AI Orchestrator as a specialized skill.
 * 
 * Principles:
 * - Decoupled from external LLMs and backend APIs (transparent rule-based reasoning).
 * - Grounded strictly in validated employee records (profile, periods, checkIns).
 * - Zero fabricated dates, statistics, or biological assumptions (no default 28-day cycle).
 * - Non-diagnostic: does not diagnose, prescribe, or interpret estimates as confirmed ovulation.
 * - Privacy: employee-facing only, never exposed to Team Leaders or Admins.
 * - Context-aware: recalculates dynamically from latest state without duplicating logic.
 */

import {
  calculateCycleSummary,
} from './cycleCalculator.js'

import {
  calculateCycleHistoryAnalytics,
  calculateDurationAnalytics,
  calculateWellnessAnalytics,
  calculateMonthlySummary,
} from './cycleAnalytics.js'

/**
 * Supported Intents
 */
export const INTENTS = {
  ESTIMATED_PHASE: 'ESTIMATED_PHASE',
  LAST_PERIOD: 'LAST_PERIOD',
  CYCLE_INTERVAL: 'CYCLE_INTERVAL',
  CYCLE_HISTORY_SUMMARY: 'CYCLE_HISTORY_SUMMARY',
  ENERGY_TRENDS: 'ENERGY_TRENDS',
  WELLNESS_PATTERNS: 'WELLNESS_PATTERNS',
  MONTHLY_SUMMARY: 'MONTHLY_SUMMARY',
  WELLNESS_SUGGESTIONS: 'WELLNESS_SUGGESTIONS',
  MEDICAL_SYMPTOMS: 'MEDICAL_SYMPTOMS',
  GENERAL_HELP: 'GENERAL_HELP',
  UNKNOWN: 'UNKNOWN',
}

/**
 * Suggested Questions for UI Prompts
 */
export const SUGGESTED_QUESTIONS = [
  'What is my currently estimated cycle phase?',
  'When did my last recorded period start?',
  'What is my average recorded cycle interval?',
  'Summarize my recent cycle history',
  'How has my energy changed this month?',
  'What patterns appear in my wellness check-ins?',
  'Summarize my monthly wellness activity',
  'Give me general wellness suggestions',
]

/**
 * Detects user intent based on natural language keywords and query structure
 */
export function detectIntent(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') return INTENTS.UNKNOWN
  const q = rawQuery.toLowerCase().trim()

  // 1. Medical symptoms / concerning health questions
  const medicalKeywords = [
    'cramp', 'pain', 'severe', 'heavy bleeding', 'abnormal', 'infection',
    'fever', 'diagnosis', 'pregnant', 'pregnancy', 'endometriosis', 'pcos',
    'fibroid', 'medicine', 'medication', 'pill', 'prescribe', 'treatment',
    'doctor', 'bleeding a lot', 'emergency', 'sharp pain'
  ]
  if (medicalKeywords.some((kw) => q.includes(kw))) {
    return INTENTS.MEDICAL_SYMPTOMS
  }

  // 2. Currently estimated cycle phase & day
  if (
    q.includes('phase') ||
    q.includes('current phase') ||
    q.includes('cycle phase') ||
    q.includes('current day') ||
    q.includes('where am i in my cycle') ||
    q.includes('what day of my cycle')
  ) {
    return INTENTS.ESTIMATED_PHASE
  }

  // 3. Last recorded period start date
  if (
    (q.includes('last') && (q.includes('period') || q.includes('bleed') || q.includes('start'))) ||
    q.includes('when did my last') ||
    q.includes('latest period') ||
    q.includes('most recent period')
  ) {
    return INTENTS.LAST_PERIOD
  }

  // 4. Average recorded cycle interval / length
  if (
    (q.includes('average') || q.includes('mean') || q.includes('interval') || q.includes('length')) &&
    (q.includes('cycle') || q.includes('interval') || q.includes('duration of cycle')) &&
    !q.includes('period duration') &&
    !q.includes('bleed')
  ) {
    return INTENTS.CYCLE_INTERVAL
  }

  // 5. Recent cycle history summary
  if (
    q.includes('history') ||
    (q.includes('summarize') && q.includes('cycle')) ||
    q.includes('cycle summary') ||
    q.includes('past cycles') ||
    q.includes('recent cycles')
  ) {
    return INTENTS.CYCLE_HISTORY_SUMMARY
  }

  // 6. Energy changes & self-reported energy patterns
  if (
    q.includes('energy') ||
    q.includes('vitality') ||
    q.includes('tired') ||
    q.includes('fatigue') ||
    q.includes('energy changed')
  ) {
    return INTENTS.ENERGY_TRENDS
  }

  // 7. Patterns in wellness check-ins (sleep, comfort, mood)
  if (
    q.includes('wellness check-in') ||
    q.includes('wellness checkin') ||
    q.includes('wellness pattern') ||
    q.includes('sleep pattern') ||
    q.includes('mood pattern') ||
    q.includes('comfort pattern') ||
    q.includes('symptom pattern') ||
    (q.includes('pattern') && (q.includes('check-in') || q.includes('checkin') || q.includes('wellness')))
  ) {
    return INTENTS.WELLNESS_PATTERNS
  }

  // 8. Monthly wellness summary
  if (
    (q.includes('month') || q.includes('monthly')) &&
    (q.includes('summary') || q.includes('activity') || q.includes('wellness') || q.includes('overview'))
  ) {
    return INTENTS.MONTHLY_SUMMARY
  }

  // 9. General wellness suggestions
  if (
    q.includes('suggestion') ||
    q.includes('suggestions') ||
    q.includes('advice') ||
    q.includes('tips') ||
    q.includes('recommendation') ||
    q.includes('recommendations') ||
    q.includes('what should i do')
  ) {
    return INTENTS.WELLNESS_SUGGESTIONS
  }

  // 10. General Help / What can you do
  if (
    q.includes('help') ||
    q.includes('what can you do') ||
    q.includes('how to use') ||
    q.includes('capabilities') ||
    q.includes('who are you')
  ) {
    return INTENTS.GENERAL_HELP
  }

  return INTENTS.UNKNOWN
}

/**
 * Main Query Processor: Interprets natural language queries using application state
 * 
 * @param {string} query - Natural language query
 * @param {object} context - Context object containing { profile, periods, checkIns, asOfDate }
 * @returns {object} Structured response with message, cards, links, and intent
 */
export function processCycleWellnessQuery(query, context = {}) {
  const {
    profile = {},
    periods = [],
    checkIns = [],
    asOfDate = new Date(),
  } = context

  // 1. Compute dynamic mathematical metrics using existing services
  const summary = calculateCycleSummary(profile, periods, asOfDate)
  const cycleAnalytics = calculateCycleHistoryAnalytics(periods, profile)
  const durationAnalytics = calculateDurationAnalytics(periods)
  const wellnessAnalytics = calculateWellnessAnalytics(checkIns)

  const currentYear = asOfDate.getFullYear()
  const currentMonth = asOfDate.getMonth()
  const monthlySummary = calculateMonthlySummary(currentYear, currentMonth, checkIns, periods)

  // 2. Identify Intent
  const intent = detectIntent(query)

  // 3. Generate Context-Aware Response
  switch (intent) {
    case INTENTS.ESTIMATED_PHASE: {
      if (!summary.isConfigured || !summary.latestPeriodStart) {
        return {
          intent,
          title: 'Cycle Phase Estimation',
          response: 'You have not configured a cycle profile or recorded a period yet. To estimate your current cycle phase, please log your last period start date in your profile or record a new period.',
          dataStatus: 'insufficient_data',
          links: [
            { text: 'Set Up Cycle Profile', path: '/employee/cycle/settings' },
            { text: 'Record Period', path: '/employee/cycle' },
          ],
          tags: ['Unconfigured'],
        }
      }

      if (summary.isIrregular) {
        return {
          intent,
          title: 'Cycle Phase Estimation',
          response: `Your cycle is self-reported as irregular. Your latest recorded period started on ${summary.latestPeriodStart} (Day ${summary.currentCycleDay || '—'}), but automated phase predictions remain paused to avoid inaccurate biological assumptions.`,
          dataStatus: 'paused_for_irregularity',
          cards: [
            { label: 'Latest Period Start', value: summary.latestPeriodStart },
            { label: 'Current Cycle Day', value: summary.currentCycleDay ? `Day ${summary.currentCycleDay}` : 'Unknown' },
            { label: 'Phase Projections', value: 'Paused (Irregular Cycle)' },
          ],
          links: [
            { text: 'View Cycle Calendar', path: '/employee/cycle/calendar' },
            { text: 'Daily Check-in', path: '/employee/cycle/check-in' },
          ],
          tags: ['Irregular Cycle', 'Predictions Paused'],
        }
      }

      if (!summary.effectiveCycleLength) {
        return {
          intent,
          title: 'Cycle Phase Estimation',
          response: `Your latest recorded period started on ${summary.latestPeriodStart} (Day ${summary.currentCycleDay || '—'}). However, an average cycle length is not yet established. At least 2 recorded period start dates (or an average cycle length entered in settings) are needed to mathematically estimate cycle phases.`,
          dataStatus: 'insufficient_intervals',
          cards: [
            { label: 'Latest Period Start', value: summary.latestPeriodStart },
            { label: 'Current Cycle Day', value: summary.currentCycleDay ? `Day ${summary.currentCycleDay}` : '—' },
            { label: 'Cycle Length', value: 'Not Yet Established' },
          ],
          links: [
            { text: 'Record Another Period', path: '/employee/cycle' },
            { text: 'Update Settings', path: '/employee/cycle/settings' },
          ],
          tags: ['Single Date Only', 'No Default 28 Days'],
        }
      }

      // Sufficient data: Provide phase info with clear estimate labeling
      const phase = summary.phaseInfo
      return {
        intent,
        title: 'Estimated Cycle Phase',
        response: `Based on your latest recorded period on ${summary.latestPeriodStart} and an effective cycle interval of ${summary.effectiveCycleLength} days, you are currently at approximately Cycle Day ${summary.currentCycleDay}, within the estimated ${phase.name}.`,
        additionalNotes: `${phase.description} Note: This is a mathematical projection only, not a medically confirmed phase or confirmed ovulation.`,
        dataStatus: 'complete',
        cards: [
          { label: 'Estimated Phase', value: phase.name },
          { label: 'Current Cycle Day', value: `Day ${summary.currentCycleDay}` },
          { label: 'Effective Cycle Length', value: `${summary.effectiveCycleLength} Days` },
          { label: 'Estimated Next Period', value: summary.estimatedNextPeriod || 'Pending' },
        ],
        links: [
          { text: 'View Calendar Phase Projection', path: '/employee/cycle/calendar' },
          { text: 'Personal Trends & Insights', path: '/employee/cycle/insights' },
        ],
        tags: ['Mathematical Estimate', 'Non-Diagnostic'],
      }
    }

    case INTENTS.LAST_PERIOD: {
      if (!summary.latestPeriodStart) {
        return {
          intent,
          title: 'Latest Period Record',
          response: 'There are no period dates recorded in your account. You can log your first period or set a baseline start date in your profile settings.',
          dataStatus: 'empty_records',
          links: [
            { text: 'Record Period', path: '/employee/cycle' },
            { text: 'Cycle Profile Settings', path: '/employee/cycle/settings' },
          ],
        }
      }

      const latestRecord = summary.latestPeriodRecord
      const isOngoing = latestRecord && !latestRecord.endDate
      const details = latestRecord
        ? `Flow intensity was recorded as ${latestRecord.flowIntensity || 'Medium'}${latestRecord.endDate ? ` (ended on ${latestRecord.endDate})` : ' (ongoing)'}.${latestRecord.notes ? ` Personal note: "${latestRecord.notes}"` : ''}`
        : 'This was configured as your initial baseline date.'

      return {
        intent,
        title: 'Latest Period Record',
        response: `Your last recorded period started on ${summary.latestPeriodStart}. Today is approximately Cycle Day ${summary.currentCycleDay || '—'}. ${details}`,
        dataStatus: 'complete',
        cards: [
          { label: 'Start Date', value: summary.latestPeriodStart },
          { label: 'Status', value: isOngoing ? 'Ongoing Flow' : (latestRecord?.endDate ? `Ended ${latestRecord.endDate}` : 'Baseline Date') },
          { label: 'Current Day', value: summary.currentCycleDay ? `Day ${summary.currentCycleDay}` : '—' },
          { label: 'Recorded Flow', value: latestRecord?.flowIntensity || 'Medium' },
        ],
        links: [
          { text: 'View Period History', path: '/employee/cycle/history' },
          { text: 'Cycle Calendar', path: '/employee/cycle/calendar' },
        ],
        tags: ['Actual Record', 'Confidential'],
      }
    }

    case INTENTS.CYCLE_INTERVAL: {
      if (cycleAnalytics.validIntervalCount === 0) {
        if (summary.cycleLengthFromUser) {
          return {
            intent,
            title: 'Cycle Interval',
            response: `You entered an average cycle length of ${summary.cycleLengthFromUser} days in your profile settings, but no consecutive periods have been recorded yet to calculate an empirical historical average.`,
            cards: [
              { label: 'Profile Setting', value: `${summary.cycleLengthFromUser} Days` },
              { label: 'Recorded Intervals', value: '0 (Requires 2+ periods)' },
            ],
            links: [
              { text: 'Record Period', path: '/employee/cycle' },
              { text: 'Cycle History', path: '/employee/cycle/history' },
            ],
            tags: ['Self-Reported Only'],
          }
        }

        return {
          intent,
          title: 'Cycle Interval',
          response: 'There are not enough recorded period dates to determine a cycle interval. At least 2 recorded period start dates are required to calculate the elapsed days between cycles. SYNC FLOW never assumes a default 28-day cycle.',
          dataStatus: 'insufficient_data',
          links: [
            { text: 'Record Period', path: '/employee/cycle' },
            { text: 'Cycle History', path: '/employee/cycle/history' },
          ],
        }
      }

      if (cycleAnalytics.validIntervalCount === 1) {
        return {
          intent,
          title: 'Cycle Interval',
          response: `You have recorded 1 cycle interval so far, measuring ${cycleAnalytics.averageInterval} days (from ${cycleAnalytics.intervals[0].from} to ${cycleAnalytics.intervals[0].to}). Additional recorded cycles will establish your personal average.`,
          cards: [
            { label: 'Recorded Interval', value: `${cycleAnalytics.averageInterval} Days` },
            { label: 'Total Periods', value: cycleAnalytics.totalPeriods },
          ],
          links: [
            { text: 'Cycle Analytics & Trends', path: '/employee/cycle/insights' },
            { text: 'Cycle History', path: '/employee/cycle/history' },
          ],
          tags: ['First Baseline Interval'],
        }
      }

      // 2 or more intervals
      const variation = cycleAnalytics.longestInterval - cycleAnalytics.shortestInterval
      return {
        intent,
        title: 'Average Cycle Interval',
        response: `Across ${cycleAnalytics.validIntervalCount} recorded cycle intervals, your average cycle length is ${cycleAnalytics.averageInterval} days. Your shortest recorded interval was ${cycleAnalytics.shortestInterval} days, and your longest was ${cycleAnalytics.longestInterval} days (variation span of ${variation} days).`,
        cards: [
          { label: 'Average Interval', value: `${cycleAnalytics.averageInterval} Days` },
          { label: 'Shortest Interval', value: `${cycleAnalytics.shortestInterval} Days` },
          { label: 'Longest Interval', value: `${cycleAnalytics.longestInterval} Days` },
          { label: 'Variation Span', value: `${variation} Days` },
        ],
        links: [
          { text: 'View Interval History Chart', path: '/employee/cycle/insights' },
          { text: 'Manage Period Records', path: '/employee/cycle/history' },
        ],
        tags: ['Empirical Average', 'Actual Logs'],
      }
    }

    case INTENTS.CYCLE_HISTORY_SUMMARY: {
      if (!periods || periods.length === 0) {
        return {
          intent,
          title: 'Cycle History Summary',
          response: 'No period records have been logged in your account yet. Once you record your periods, a summary of your cycle intervals, durations, and flow patterns will appear here.',
          dataStatus: 'empty_records',
          links: [
            { text: 'Record First Period', path: '/employee/cycle' },
            { text: 'Cycle History', path: '/employee/cycle/history' },
          ],
        }
      }

      const totalLogged = periods.length
      const completedCount = durationAnalytics.completedPeriodsCount
      const ongoingCount = durationAnalytics.ongoingPeriodsCount
      const avgDuration = durationAnalytics.averageDuration ? `${durationAnalytics.averageDuration} days` : 'Pending completion'
      const avgInterval = cycleAnalytics.averageInterval ? `${cycleAnalytics.averageInterval} days` : 'Pending 2nd period'

      return {
        intent,
        title: 'Cycle History Summary',
        response: `You have logged ${totalLogged} period record${totalLogged === 1 ? '' : 's'} (${completedCount} completed${ongoingCount > 0 ? `, ${ongoingCount} ongoing` : ''}). Your average period duration is ${avgDuration}, and your average cycle interval is ${avgInterval}.`,
        cards: [
          { label: 'Total Periods Logged', value: totalLogged },
          { label: 'Average Duration', value: avgDuration },
          { label: 'Average Interval', value: avgInterval },
          { label: 'Latest Start Date', value: summary.latestPeriodStart || '—' },
        ],
        links: [
          { text: 'View Detailed History', path: '/employee/cycle/history' },
          { text: 'Explore Insights Dashboard', path: '/employee/cycle/insights' },
        ],
        tags: ['Empirical Summary', 'Confidential Records'],
      }
    }

    case INTENTS.ENERGY_TRENDS: {
      if (!wellnessAnalytics.hasData || wellnessAnalytics.totalCheckIns === 0) {
        return {
          intent,
          title: 'Energy Patterns',
          response: 'No daily wellness check-ins have been logged yet. By logging your self-reported energy levels daily, the assistant can identify how your vitality fluctuates across different days and phases.',
          dataStatus: 'no_checkins',
          links: [
            { text: 'Log Daily Check-in', path: '/employee/cycle/check-in' },
            { text: 'Explore Insights', path: '/employee/cycle/insights' },
          ],
        }
      }

      const mostFrequent = wellnessAnalytics.mostFrequentEnergy || 'Moderate Energy'
      const dist = wellnessAnalytics.energyDistribution
      const distSummary = Object.entries(dist)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')

      return {
        intent,
        title: 'Self-Reported Energy Trends',
        response: `Across ${wellnessAnalytics.totalCheckIns} logged check-in${wellnessAnalytics.totalCheckIns === 1 ? '' : 's'}, your most frequently reported energy level is "${mostFrequent}". Reported distribution: ${distSummary}.`,
        cards: [
          { label: 'Dominant Energy', value: mostFrequent },
          { label: 'Total Check-ins', value: wellnessAnalytics.totalCheckIns },
          { label: 'Average Sleep', value: wellnessAnalytics.averageSleep ? `${wellnessAnalytics.averageSleep} hrs` : '—' },
        ],
        links: [
          { text: 'View Energy Distribution Chart', path: '/employee/cycle/insights' },
          { text: 'Record Today\'s Energy', path: '/employee/cycle/check-in' },
        ],
        tags: ['Self-Reported Logs'],
      }
    }

    case INTENTS.WELLNESS_PATTERNS: {
      if (!wellnessAnalytics.hasData || wellnessAnalytics.totalCheckIns === 0) {
        return {
          intent,
          title: 'Wellness Patterns',
          response: 'There are currently no wellness check-ins on file. Consistent logging of your physical comfort, sleep, and mood allows you to discover personal bio-rhythm correlations over time.',
          dataStatus: 'no_checkins',
          links: [
            { text: 'Complete Daily Check-in', path: '/employee/cycle/check-in' },
            { text: 'View Insights', path: '/employee/cycle/insights' },
          ],
        }
      }

      const dominantMood = wellnessAnalytics.mostFrequentMood || 'Balanced'
      const sleepAvg = wellnessAnalytics.averageSleep ? `${wellnessAnalytics.averageSleep} hours` : 'Not recorded'
      const topComfort = Object.entries(wellnessAnalytics.comfortDistribution)
        .sort((a, b) => b[1] - a[1])[0]

      const topComfortText = topComfort ? `Most frequent physical comfort: "${topComfort[0]}" (${topComfort[1]} times).` : ''

      return {
        intent,
        title: 'Observed Wellness Patterns',
        response: `Based on your ${wellnessAnalytics.totalCheckIns} daily check-ins: your average sleep duration is ${sleepAvg}, and your most frequently reported mental readiness is "${dominantMood}". ${topComfortText}`,
        cards: [
          { label: 'Check-ins Logged', value: wellnessAnalytics.totalCheckIns },
          { label: 'Average Sleep', value: sleepAvg },
          { label: 'Dominant Mood', value: dominantMood },
          { label: 'Top Comfort Log', value: topComfort ? topComfort[0] : '—' },
        ],
        links: [
          { text: 'Full Wellness Trends', path: '/employee/cycle/insights' },
          { text: 'Daily Check-in', path: '/employee/cycle/check-in' },
        ],
        tags: ['Empirical Correlations'],
      }
    }

    case INTENTS.MONTHLY_SUMMARY: {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ]
      const currentMonthName = monthNames[currentMonth]

      if (!monthlySummary.hasData) {
        return {
          intent,
          title: `Monthly Summary (${currentMonthName} ${currentYear})`,
          response: `No check-ins or periods have been recorded yet for ${currentMonthName} ${currentYear}. Complete a check-in or log a period to populate your monthly activity summary.`,
          dataStatus: 'empty_month',
          links: [
            { text: 'Log Daily Entry', path: '/employee/cycle/check-in' },
            { text: 'Record Period', path: '/employee/cycle' },
          ],
        }
      }

      const notesCount = monthlySummary.notesList.length
      return {
        intent,
        title: `Monthly Summary (${currentMonthName} ${currentYear})`,
        response: `For ${currentMonthName} ${currentYear}, you have logged ${monthlySummary.checkInCount} check-in${monthlySummary.checkInCount === 1 ? '' : 's'} and ${monthlySummary.periodsCount} period start${monthlySummary.periodsCount === 1 ? '' : 's'}.${monthlySummary.averageSleep ? ` Your average sleep duration is ${monthlySummary.averageSleep} hours.` : ''}${monthlySummary.dominantEnergy ? ` Dominant energy: "${monthlySummary.dominantEnergy}".` : ''}${notesCount > 0 ? ` You recorded ${notesCount} personal reflection note${notesCount === 1 ? '' : 's'}.` : ''}`,
        cards: [
          { label: 'Monthly Check-ins', value: monthlySummary.checkInCount },
          { label: 'Monthly Periods', value: monthlySummary.periodsCount },
          { label: 'Average Sleep', value: monthlySummary.averageSleep ? `${monthlySummary.averageSleep} hrs` : '—' },
          { label: 'Dominant Energy', value: monthlySummary.dominantEnergy || '—' },
        ],
        links: [
          { text: 'Monthly Wellness Summary Tab', path: '/employee/cycle/insights' },
          { text: 'Cycle Calendar', path: '/employee/cycle/calendar' },
        ],
        tags: [`${currentMonthName} ${currentYear}`, 'Activity Summary'],
      }
    }

    case INTENTS.WELLNESS_SUGGESTIONS: {
      const phase = summary.phaseInfo?.phaseKey
      let guidance = 'Focus on consistent hydration (2-2.5L daily), gentle posture resets at your desk, and aligning your personal schedule with your self-reported energy levels.'
      let phaseContext = 'General Baseline'

      if (phase === 'menstrual') {
        phaseContext = 'Menstrual Window'
        guidance = 'During your estimated menstrual window, hormone levels are at baseline. Prioritize restorative hydration, warm anti-inflammatory meals, gentle lower-back stretches, and self-selected restorative breaks.'
      } else if (phase === 'follicular') {
        phaseContext = 'Follicular Window'
        guidance = 'During your estimated follicular window, rising estrogen often correlates with natural energy. This is a supportive time for creative ideation, learning new workflows, and moderately vigorous movement.'
      } else if (phase === 'ovulatory') {
        phaseContext = 'Ovulatory Window'
        guidance = 'Mid-cycle energy is typically robust. Maintain sustained hydration, prioritize balanced electrolyte intake, and enjoy collaborative activities while honouring your body\'s signals.'
      } else if (phase === 'luteal') {
        phaseContext = 'Luteal Window'
        guidance = 'During the luteal window, metabolic demand naturally rises. Prioritize steady blood sugar with complex carbs and magnesium-rich snacks, maintain regular sleep schedules, and schedule restorative pauses.'
      }

      return {
        intent,
        title: 'Evidence-Informed Wellness Suggestions',
        response: guidance,
        additionalNotes: 'Reminder: Wellness suggestions are educational self-care ideas and never replace medical consultation or clinical treatment.',
        cards: [
          { label: 'Current Context', value: phaseContext },
          { label: 'Hydration Target', value: '2.0 - 2.5 Liters' },
          { label: 'Movement Recommendation', value: 'Self-Paced Ergonomic Resets' },
        ],
        links: [
          { text: 'Daily Check-in', path: '/employee/cycle/check-in' },
          { text: 'Evidence Bio-Rhythm Reference', path: '/employee/cycle/insights' },
        ],
        tags: ['Educational Guidance', 'Non-Diagnostic'],
      }
    }

    case INTENTS.MEDICAL_SYMPTOMS: {
      return {
        intent,
        title: 'Health & Symptom Advisory',
        response: 'SYNC FLOW is a personal wellness self-awareness tool and does NOT provide medical diagnosis, treatment prescriptions, or clinical evaluation. If you are experiencing severe cramping, abnormal or unusually heavy bleeding, intense pain, or symptoms that cause distress, please consult a qualified healthcare professional or your personal physician for clinical guidance.',
        isMedicalAdvisory: true,
        cards: [
          { label: 'Clinical Safety Boundary', value: 'Non-Diagnostic Platform' },
          { label: 'Recommended Action', value: 'Consult Healthcare Professional' },
        ],
        links: [
          { text: 'Daily Check-in', path: '/employee/cycle/check-in' },
          { text: 'Cycle Settings', path: '/employee/cycle/settings' },
        ],
        tags: ['Clinical Advisory', 'Safety Protocol'],
      }
    }

    case INTENTS.GENERAL_HELP: {
      return {
        intent,
        title: 'Cycle & Wellness AI Assistant Capabilities',
        response: 'I am your specialized Cycle & Wellness AI Assistant. I can answer questions about your estimated cycle phase, last recorded period, cycle intervals, energy trends, wellness patterns, and monthly summaries using your actual logs. I never fabricate statistics or share data with managers.',
        suggestedPrompts: SUGGESTED_QUESTIONS,
        links: [
          { text: 'Cycle Overview', path: '/employee/cycle' },
          { text: 'Cycle Calendar', path: '/employee/cycle/calendar' },
          { text: 'Personal Insights', path: '/employee/cycle/insights' },
          { text: 'Cycle History', path: '/employee/cycle/history' },
        ],
        tags: ['Employee-Controlled Privacy', 'Zero-Mock Intelligence'],
      }
    }

    case INTENTS.UNKNOWN:
    default: {
      return {
        intent: INTENTS.UNKNOWN,
        title: 'Cycle & Wellness Assistant',
        response: 'I can help answer questions regarding your cycle history, estimated phase, period logs, energy levels, and wellness check-in patterns. Here are a few questions you can ask me:',
        suggestedPrompts: SUGGESTED_QUESTIONS.slice(0, 4),
        links: [
          { text: 'Cycle Overview', path: '/employee/cycle' },
          { text: 'Cycle Calendar', path: '/employee/cycle/calendar' },
          { text: 'Personal Insights', path: '/employee/cycle/insights' },
        ],
        tags: ['Supported Queries'],
      }
    }
  }
}
