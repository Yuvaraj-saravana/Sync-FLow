/**
 * SYNC FLOW - Personal Cycle Insights & Analytics Service
 * 
 * Pure mathematical analysis and aggregation utilities for cycle history,
 * period durations, wellness trends, and rule-based insights.
 * 
 * Rules:
 * - Derives all metrics from actual employee records only.
 * - Zero fabricated data, zero mock statistics.
 * - Does not assume a default 28-day cycle.
 * - Strictly non-diagnostic; cautious, evidence-informed language.
 * - Never correlates biological phases with workplace performance.
 */

import { parseDateString } from './cycleCalculator.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24

/**
 * 1. Cycle History Analytics
 * Analyzes intervals between consecutive period start dates.
 */
export function calculateCycleHistoryAnalytics(periods = [], profile = {}) {
  // Collect all genuine start dates
  const startDates = []
  if (periods && periods.length > 0) {
    periods.forEach((p) => {
      if (p.startDate && !startDates.includes(p.startDate)) {
        startDates.push(p.startDate)
      }
    })
  }

  // Include optional historical start dates from profile
  if (profile.previousPeriodStarts && Array.isArray(profile.previousPeriodStarts)) {
    profile.previousPeriodStarts.forEach((d) => {
      if (d && !startDates.includes(d)) {
        startDates.push(d)
      }
    })
  }

  const totalPeriods = periods ? periods.length : 0

  if (startDates.length < 2) {
    return {
      hasEnoughData: false,
      totalPeriods,
      validIntervalCount: 0,
      averageInterval: null,
      latestInterval: null,
      shortestInterval: null,
      longestInterval: null,
      intervals: [],
      regularityObservation: profile.regularity === 'irregular'
        ? 'Cycle is self-reported as irregular; predictions and phase estimates remain paused.'
        : 'At least 2 recorded period start dates are required to calculate historical cycle intervals.',
      isIrregular: profile.regularity === 'irregular',
    }
  }

  // Sort unique dates ascending
  const sorted = Array.from(new Set(startDates))
    .map(parseDateString)
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime())

  const intervals = []
  for (let i = 1; i < sorted.length; i++) {
    const diffDays = Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / MS_PER_DAY)
    // Filter reasonable biological interval bounds (18 - 65 days)
    if (diffDays >= 18 && diffDays <= 65) {
      intervals.push({
        from: sorted[i - 1].toISOString().split('T')[0],
        to: sorted[i].toISOString().split('T')[0],
        days: diffDays,
        cycleIndex: i,
      })
    }
  }

  if (intervals.length === 0) {
    return {
      hasEnoughData: false,
      totalPeriods,
      validIntervalCount: 0,
      averageInterval: null,
      latestInterval: null,
      shortestInterval: null,
      longestInterval: null,
      intervals: [],
      regularityObservation: 'Recorded dates do not yield consecutive intervals within the 18–65 day range.',
      isIrregular: profile.regularity === 'irregular',
    }
  }

  const daysList = intervals.map((i) => i.days)
  const sum = daysList.reduce((acc, v) => acc + v, 0)
  const averageInterval = Math.round(sum / daysList.length)
  const latestInterval = daysList[daysList.length - 1]
  const shortestInterval = Math.min(...daysList)
  const longestInterval = Math.max(...daysList)
  const variation = longestInterval - shortestInterval

  let regularityObservation = ''
  if (profile.regularity === 'irregular') {
    regularityObservation = 'Cycle is self-reported as irregular; phase projections remain paused.'
  } else if (variation <= 3) {
    regularityObservation = `Highly consistent cycle intervals (${variation} days variation observed across recorded cycles).`
  } else if (variation <= 7) {
    regularityObservation = `Moderately consistent cycle intervals (${variation} days variation observed across recorded cycles).`
  } else {
    regularityObservation = `Variable cycle intervals (${variation} days variation observed across recorded cycles).`
  }

  return {
    hasEnoughData: true,
    totalPeriods,
    validIntervalCount: intervals.length,
    averageInterval,
    latestInterval,
    shortestInterval,
    longestInterval,
    variation,
    intervals,
    regularityObservation,
    isIrregular: profile.regularity === 'irregular',
  }
}

/**
 * 2. Period Duration Analytics
 * Analyzes duration of completed menstrual flow periods.
 */
export function calculateDurationAnalytics(periods = []) {
  if (!periods || periods.length === 0) {
    return {
      hasEnoughData: false,
      completedPeriodsCount: 0,
      ongoingPeriodsCount: 0,
      averageDuration: null,
      shortestDuration: null,
      longestDuration: null,
      durations: [],
    }
  }

  // Sort chronological ascending
  const sorted = [...periods].sort((a, b) => (a.startDate > b.startDate ? 1 : -1))

  const completed = []
  let ongoingCount = 0

  sorted.forEach((p) => {
    if (p.endDate) {
      const start = parseDateString(p.startDate)
      const end = parseDateString(p.endDate)
      if (start && end && end >= start) {
        const days = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
        if (days >= 1 && days <= 45) {
          completed.push({
            id: p.id,
            startDate: p.startDate,
            endDate: p.endDate,
            duration: days,
            flowIntensity: p.flowIntensity || 'Medium',
          })
        }
      }
    } else {
      ongoingCount++
    }
  })

  if (completed.length === 0) {
    return {
      hasEnoughData: false,
      completedPeriodsCount: 0,
      ongoingPeriodsCount: ongoingCount,
      averageDuration: null,
      shortestDuration: null,
      longestDuration: null,
      durations: [],
    }
  }

  const daysList = completed.map((c) => c.duration)
  const sum = daysList.reduce((acc, v) => acc + v, 0)
  const averageDuration = Math.round((sum / daysList.length) * 10) / 10
  const shortestDuration = Math.min(...daysList)
  const longestDuration = Math.max(...daysList)

  return {
    hasEnoughData: true,
    completedPeriodsCount: completed.length,
    ongoingPeriodsCount: ongoingCount,
    averageDuration,
    shortestDuration,
    longestDuration,
    durations: completed,
  }
}

/**
 * 3. Wellness Check-in Analytics
 * Analyzes self-reported energy, mood, comfort, and sleep over time.
 */
export function calculateWellnessAnalytics(checkIns = []) {
  if (!checkIns || checkIns.length === 0) {
    return {
      hasData: false,
      totalCheckIns: 0,
      averageSleep: null,
      sleepRange: null,
      sleepTrend: [],
      energyTrend: [],
      energyDistribution: {},
      moodDistribution: {},
      comfortDistribution: {},
      mostFrequentEnergy: null,
      mostFrequentMood: null,
    }
  }

  // Sort chronological ascending
  const sorted = [...checkIns].sort((a, b) => (a.date > b.date ? 1 : -1))

  // Energy numeric mapping for trends
  const energyScale = {
    'Restorative (Low)': 1,
    'Moderate Energy': 2,
    'High Energy': 3,
    'Peak Vitality': 4,
  }

  const energyDistribution = {}
  const moodDistribution = {}
  const comfortDistribution = {}
  const sleepValues = []
  const sleepTrend = []
  const energyTrend = []

  sorted.forEach((item) => {
    // Energy
    if (item.energy) {
      energyDistribution[item.energy] = (energyDistribution[item.energy] || 0) + 1
      if (energyScale[item.energy]) {
        energyTrend.push({
          date: item.date,
          level: energyScale[item.energy],
          label: item.energy,
        })
      }
    }

    // Mood
    if (item.mood) {
      moodDistribution[item.mood] = (moodDistribution[item.mood] || 0) + 1
    }

    // Comfort
    if (item.comfort) {
      comfortDistribution[item.comfort] = (comfortDistribution[item.comfort] || 0) + 1
    }

    // Sleep
    const sleepNum = Number(item.sleepHours)
    if (!isNaN(sleepNum) && sleepNum > 0 && sleepNum <= 24) {
      sleepValues.push(sleepNum)
      sleepTrend.push({
        date: item.date,
        sleepHours: sleepNum,
      })
    }
  })

  // Calculate average sleep
  let averageSleep = null
  let sleepRange = null
  if (sleepValues.length > 0) {
    const sum = sleepValues.reduce((acc, v) => acc + v, 0)
    averageSleep = Math.round((sum / sleepValues.length) * 10) / 10
    sleepRange = {
      min: Math.min(...sleepValues),
      max: Math.max(...sleepValues),
    }
  }

  // Find dominant energy
  let mostFrequentEnergy = null
  let maxEnergyCount = 0
  Object.entries(energyDistribution).forEach(([k, count]) => {
    if (count > maxEnergyCount) {
      maxEnergyCount = count
      mostFrequentEnergy = k
    }
  })

  // Find dominant mood
  let mostFrequentMood = null
  let maxMoodCount = 0
  Object.entries(moodDistribution).forEach(([k, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count
      mostFrequentMood = k
    }
  })

  return {
    hasData: true,
    totalCheckIns: sorted.length,
    averageSleep,
    sleepRange,
    sleepTrend,
    energyTrend,
    energyDistribution,
    moodDistribution,
    comfortDistribution,
    mostFrequentEnergy,
    mostFrequentMood,
  }
}

/**
 * 4. Monthly Wellness Summary
 * Aggregates check-ins and periods for a specific year and month.
 */
export function calculateMonthlySummary(targetYear, targetMonth, checkIns = [], periods = []) {
  const monthPrefix = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`

  // Filter check-ins
  const monthCheckIns = (checkIns || []).filter((c) => c.date && c.date.startsWith(monthPrefix))

  // Filter periods starting in month
  const monthPeriods = (periods || []).filter((p) => p.startDate && p.startDate.startsWith(monthPrefix))

  if (monthCheckIns.length === 0 && monthPeriods.length === 0) {
    return {
      hasData: false,
      monthPrefix,
      checkInCount: 0,
      periodsCount: 0,
      averageSleep: null,
      dominantEnergy: null,
      dominantMood: null,
      notesList: [],
    }
  }

  // Sleep stats
  const sleepList = monthCheckIns
    .map((c) => Number(c.sleepHours))
    .filter((s) => !isNaN(s) && s > 0 && s <= 24)

  let averageSleep = null
  if (sleepList.length > 0) {
    const sum = sleepList.reduce((acc, v) => acc + v, 0)
    averageSleep = Math.round((sum / sleepList.length) * 10) / 10
  }

  // Energy frequency
  const energyCounts = {}
  monthCheckIns.forEach((c) => {
    if (c.energy) energyCounts[c.energy] = (energyCounts[c.energy] || 0) + 1
  })
  let dominantEnergy = null
  let maxEnergy = 0
  Object.entries(energyCounts).forEach(([k, v]) => {
    if (v > maxEnergy) {
      maxEnergy = v
      dominantEnergy = k
    }
  })

  // Mood frequency
  const moodCounts = {}
  monthCheckIns.forEach((c) => {
    if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1
  })
  let dominantMood = null
  let maxMood = 0
  Object.entries(moodCounts).forEach(([k, v]) => {
    if (v > maxMood) {
      maxMood = v
      dominantMood = k
    }
  })

  // Collect notes
  const notesList = []
  monthCheckIns.forEach((c) => {
    if (c.notes && c.notes.trim()) {
      notesList.push({ date: c.date, text: c.notes.trim() })
    }
  })
  monthPeriods.forEach((p) => {
    if (p.notes && p.notes.trim()) {
      notesList.push({ date: p.startDate, text: p.notes.trim(), isPeriodNote: true })
    }
  })

  return {
    hasData: true,
    monthPrefix,
    checkInCount: monthCheckIns.length,
    periodsCount: monthPeriods.length,
    averageSleep,
    dominantEnergy,
    dominantMood,
    notesList,
  }
}

/**
 * 5. Rule-Based Personal Insights Generator
 * Generates cautious, non-diagnostic observations from validated analytics.
 */
export function generatePersonalInsights({
  cycleAnalytics = {},
  durationAnalytics = {},
  wellnessAnalytics = {},
  profile = {},
}) {
  const insights = []

  // Rule 1: Cycle Interval Consistency
  if (cycleAnalytics.hasEnoughData && cycleAnalytics.intervals?.length >= 1) {
    if (profile.regularity === 'irregular') {
      insights.push({
        id: 'cycle-irregular',
        category: 'Cycle Regularity',
        type: 'info',
        title: 'Irregular Pattern Reported',
        text: 'Your cycle profile is designated as irregular. Projections and automated phase calculations remain paused to ensure accuracy.',
      })
    } else {
      const { averageInterval, shortestInterval, longestInterval, intervals } = cycleAnalytics
      if (intervals.length === 1) {
        insights.push({
          id: 'cycle-first-interval',
          category: 'Cycle Interval',
          type: 'positive',
          title: 'First Baseline Interval Logged',
          text: `Your first recorded cycle interval measured ${averageInterval} days. Additional logs will establish your personal average.`,
        })
      } else {
        const diff = longestInterval - shortestInterval
        insights.push({
          id: 'cycle-intervals-summary',
          category: 'Cycle Interval',
          type: 'positive',
          title: 'Historical Interval Baseline',
          text: `Your ${intervals.length} recorded cycle intervals average ${averageInterval} days, ranging from ${shortestInterval} to ${longestInterval} days (${diff} days variance).`,
        })
      }
    }
  }

  // Rule 2: Period Duration Consistency
  if (durationAnalytics.hasEnoughData && durationAnalytics.durations?.length >= 2) {
    const { averageDuration, shortestDuration, longestDuration, durations } = durationAnalytics
    insights.push({
      id: 'duration-summary',
      category: 'Period Duration',
      type: 'neutral',
      title: 'Menstrual Duration Pattern',
      text: `Across ${durations.length} completed periods, your recorded flow duration averaged ${averageDuration} days (ranging from ${shortestDuration} to ${longestDuration} days).`,
    })
  }

  // Rule 3: Sleep Range
  if (wellnessAnalytics.hasData && wellnessAnalytics.averageSleep !== null && wellnessAnalytics.sleepTrend?.length >= 3) {
    const { averageSleep, sleepRange } = wellnessAnalytics
    insights.push({
      id: 'wellness-sleep',
      category: 'Rest & Recovery',
      type: 'wellness',
      title: 'Self-Reported Sleep Trend',
      text: `Your recorded sleep duration averages ${averageSleep} hours per night, ranging between ${sleepRange.min} and ${sleepRange.max} hours.`,
    })
  }

  // Rule 4: Dominant Energy Pattern
  if (wellnessAnalytics.hasData && wellnessAnalytics.mostFrequentEnergy && wellnessAnalytics.totalCheckIns >= 4) {
    const count = wellnessAnalytics.energyDistribution[wellnessAnalytics.mostFrequentEnergy]
    const percent = Math.round((count / wellnessAnalytics.totalCheckIns) * 100)
    insights.push({
      id: 'wellness-energy',
      category: 'Energy Pattern',
      type: 'wellness',
      title: 'Self-Reported Energy Tendency',
      text: `You reported '${wellnessAnalytics.mostFrequentEnergy}' on ${percent}% of your logged check-in entries (${count} of ${wellnessAnalytics.totalCheckIns} logs).`,
    })
  }

  // Rule 5: Ongoing Check-in Frequency
  if (wellnessAnalytics.hasData && wellnessAnalytics.totalCheckIns >= 3) {
    insights.push({
      id: 'wellness-frequency',
      category: 'Data Baseline',
      type: 'info',
      title: 'Check-in Consistency',
      text: `You have completed ${wellnessAnalytics.totalCheckIns} daily wellness check-ins, establishing a reliable personal baseline for trend analysis.`,
    })
  }

  return insights
}
