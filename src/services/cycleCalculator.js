/**
 * SYNC FLOW - Cycle Calculation Service
 * 
 * Pure mathematical calculation and estimation utilities decoupled from UI components.
 * 
 * Rules:
 * - Never assumes a default 28-day cycle length.
 * - All phase predictions and next period dates are labeled as estimates.
 * - Does not claim confirmed ovulation or medical accuracy.
 * - Gracefully handles irregular cycles and missing/insufficient data.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24

/**
 * Parses YYYY-MM-DD string into a local Date object set to midnight
 */
export function parseDateString(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateString(date) {
  if (!date || isNaN(date.getTime())) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Calculates current cycle day from the most recent period start date
 */
export function calculateCurrentCycleDay(startDateStr, asOfDate = new Date()) {
  const start = parseDateString(startDateStr)
  if (!start) return null

  const asOf = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate())
  const diffTime = asOf.getTime() - start.getTime()
  if (diffTime < 0) return null // Future start date

  return Math.floor(diffTime / MS_PER_DAY) + 1
}

/**
 * Computes the effective cycle length:
 * 1. Uses explicit user-entered cycleLengthDays if valid (between 18 and 60 days).
 * 2. Or calculates the average interval between consecutive recorded period start dates.
 * 3. Returns null if unknown (never assumes 28 days).
 */
export function getEffectiveCycleLength(profile = {}, periods = []) {
  if (profile.cycleLengthDays && profile.cycleLengthDays >= 18 && profile.cycleLengthDays <= 60) {
    return profile.cycleLengthDays
  }

  // Check historical recorded period start dates
  const startDates = []
  if (periods && periods.length > 0) {
    periods.forEach((p) => {
      if (p.startDate) startDates.push(p.startDate)
    })
  }

  // Also include optional previous start dates from profile
  if (profile.previousPeriodStarts && Array.isArray(profile.previousPeriodStarts)) {
    profile.previousPeriodStarts.forEach((d) => {
      if (d && !startDates.includes(d)) startDates.push(d)
    })
  }

  if (startDates.length >= 2) {
    // Sort unique dates ascending
    const sorted = Array.from(new Set(startDates))
      .map(parseDateString)
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime())

    const intervals = []
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / MS_PER_DAY)
      if (diffDays >= 18 && diffDays <= 65) {
        intervals.push(diffDays)
      }
    }

    if (intervals.length > 0) {
      const sum = intervals.reduce((acc, val) => acc + val, 0)
      return Math.round(sum / intervals.length)
    }
  }

  return null
}

/**
 * Estimates the next period date based on start date and effective cycle length.
 * Paused if the cycle is irregular or cycle length is unknown.
 */
export function estimateNextPeriodDate(startDateStr, effectiveCycleLength, regularity = 'regular') {
  if (!startDateStr || !effectiveCycleLength) return null
  if (regularity === 'irregular') return null

  const start = parseDateString(startDateStr)
  if (!start) return null

  const next = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  )
  next.setDate(next.getDate() + effectiveCycleLength)
  return formatDateString(next)
}

/**
 * Maps current cycle day to an estimated physiological phase.
 * Handled conservatively with transparent estimate labeling.
 */
export function estimateCyclePhase(
  cycleDay,
  effectiveCycleLength,
  periodDuration = 5,
  regularity = 'regular'
) {
  if (!cycleDay) {
    return {
      phaseKey: null,
      name: 'Unrecorded',
      description: 'Record a period start date to view estimated cycle status.',
      badge: 'slate',
      isEstimate: false,
      isPaused: true,
      reason: 'no_start_date',
    }
  }

  if (regularity === 'irregular') {
    return {
      phaseKey: null,
      name: 'Estimate Paused (Irregular)',
      description: 'Phase estimates are paused for irregular cycles to prevent inaccurate projections.',
      badge: 'slate',
      isEstimate: true,
      isPaused: true,
      reason: 'irregular_cycle',
    }
  }

  if (!effectiveCycleLength) {
    return {
      phaseKey: null,
      name: 'Cycle Length Needed',
      description: 'Provide an average cycle length or record 2+ periods to generate phase window estimates.',
      badge: 'slate',
      isEstimate: true,
      isPaused: true,
      reason: 'unknown_cycle_length',
    }
  }

  const duration = Math.max(1, Math.min(periodDuration || 5, 12))
  const cycleLen = Math.max(20, Math.min(effectiveCycleLength, 55))
  // Mid-cycle estimate (standard clinical approximation: luteal phase ~14 days)
  const estimatedOvulation = Math.max(duration + 2, cycleLen - 14)

  if (cycleDay > cycleLen + 14) {
    return {
      phaseKey: null,
      name: 'Cycle Extended',
      description: 'Current cycle day exceeds expected length. Log a new period once flow begins.',
      badge: 'slate',
      isEstimate: true,
      isPaused: true,
      reason: 'cycle_extended',
    }
  }

  // 1. Menstrual Phase
  if (cycleDay <= duration) {
    return {
      phaseKey: 'menstrual',
      name: 'Menstrual (Estimated)',
      description: 'Restorative window. Lower physical intensity and intuitive pacing recommended.',
      badge: 'rose',
      isEstimate: true,
      isPaused: false,
    }
  }

  // 2. Follicular Phase
  if (cycleDay < estimatedOvulation - 1) {
    return {
      phaseKey: 'follicular',
      name: 'Follicular (Estimated)',
      description: 'Hormones gradually rise. Energy and cognitive focus typically increase during this window.',
      badge: 'purple',
      isEstimate: true,
      isPaused: false,
    }
  }

  // 3. Ovulatory Phase
  if (cycleDay <= estimatedOvulation + 1) {
    return {
      phaseKey: 'ovulatory',
      name: 'Ovulatory (Estimated)',
      description: 'Mid-cycle window. Mathematical estimate only, not confirmed ovulation.',
      badge: 'teal',
      isEstimate: true,
      isPaused: false,
    }
  }

  // 4. Luteal Phase
  return {
    phaseKey: 'luteal',
    name: 'Luteal (Estimated)',
    description: 'Progesterone window. Energy may be reflective; prioritising steady pacing and hydration.',
    badge: 'amber',
    isEstimate: true,
    isPaused: false,
  }
}

/**
 * Consolidates all metrics into a unified summary object
 */
export function calculateCycleSummary(profile = {}, periods = [], asOfDate = new Date()) {
  // Determine most recent period start date
  let latestPeriodStart = null
  let latestPeriodRecord = null

  if (periods && periods.length > 0) {
    // Sort descending by startDate
    const sortedPeriods = [...periods].sort((a, b) => {
      const timeA = parseDateString(a.startDate)?.getTime() || 0
      const timeB = parseDateString(b.startDate)?.getTime() || 0
      return timeB - timeA
    })
    latestPeriodRecord = sortedPeriods[0]
    // If a baseline date exists and is strictly newer than recorded periods, use baseline
    if (profile.lastPeriodStart && parseDateString(profile.lastPeriodStart)?.getTime() > parseDateString(latestPeriodRecord.startDate)?.getTime()) {
      latestPeriodStart = profile.lastPeriodStart
    } else {
      latestPeriodStart = latestPeriodRecord.startDate
    }
  } else if (profile.lastPeriodStart) {
    latestPeriodStart = profile.lastPeriodStart
  }

  const isConfigured = Boolean(profile.isConfigured || latestPeriodStart)
  const regularity = profile.regularity || 'regular'
  const isIrregular = regularity === 'irregular'
  const periodDuration = profile.periodLengthDays || (latestPeriodRecord?.endDate ? null : 5) || 5
  const effectiveCycleLength = getEffectiveCycleLength(profile, periods)
  const currentCycleDay = calculateCurrentCycleDay(latestPeriodStart, asOfDate)
  const estimatedNextPeriod = estimateNextPeriodDate(latestPeriodStart, effectiveCycleLength, regularity)
  const phaseInfo = estimateCyclePhase(currentCycleDay, effectiveCycleLength, periodDuration, regularity)

  let daysUntilNext = null
  if (estimatedNextPeriod) {
    const nextDate = parseDateString(estimatedNextPeriod)
    const asOf = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate())
    if (nextDate) {
      daysUntilNext = Math.round((nextDate.getTime() - asOf.getTime()) / MS_PER_DAY)
    }
  }

  return {
    isConfigured,
    latestPeriodStart,
    latestPeriodRecord,
    effectiveCycleLength,
    cycleLengthFromUser: profile.cycleLengthDays || null,
    periodDuration,
    regularity,
    isIrregular,
    currentCycleDay,
    estimatedNextPeriod,
    daysUntilNext,
    phaseInfo,
    hasSufficientData: Boolean(latestPeriodStart && effectiveCycleLength && !isIrregular),
  }
}

/**
 * Analyzes a specific calendar date (YYYY-MM-DD) against profile, recorded periods,
 * and optional check-ins.
 */
export function getDateCycleStatus(targetDateStr, profile = {}, periods = [], checkIns = []) {
  if (!targetDateStr) return null

  const targetDate = parseDateString(targetDateStr)
  if (!targetDate) return null

  const summary = calculateCycleSummary(profile, periods, targetDate)
  const {
    isConfigured,
    latestPeriodStart,
    effectiveCycleLength,
    periodDuration,
    regularity,
    isIrregular,
    hasSufficientData,
  } = summary

  // 1. Check if date falls within any recorded period
  let recordedPeriod = null
  if (periods && periods.length > 0) {
    const todayStr = formatDateString(new Date())
    for (const p of periods) {
      const pStart = p.startDate
      // If ongoing, extends up to today (or start if today is earlier)
      const pEnd = p.endDate || (todayStr >= pStart ? todayStr : pStart)
      if (targetDateStr >= pStart && targetDateStr <= pEnd) {
        recordedPeriod = {
          ...p,
          isStart: targetDateStr === pStart,
          isEnd: targetDateStr === p.endDate,
          isOngoing: !p.endDate,
        }
        break
      }
    }
  }

  // 2. Check upcoming estimated periods (only if sufficient data, regular, and targetDate >= latestPeriodStart)
  let isEstimatedPeriod = false
  let estimatedPeriodWindow = null

  if (hasSufficientData && latestPeriodStart && effectiveCycleLength && !isIrregular) {
    const latestStart = parseDateString(latestPeriodStart)
    const duration = periodDuration || 5
    const cycleLen = effectiveCycleLength

    // Project upcoming periods up to 12 cycles ahead
    for (let k = 1; k <= 12; k++) {
      const projStart = new Date(latestStart.getFullYear(), latestStart.getMonth(), latestStart.getDate() + k * cycleLen)
      const projEnd = new Date(projStart.getFullYear(), projStart.getMonth(), projStart.getDate() + duration - 1)
      const projStartStr = formatDateString(projStart)
      const projEndStr = formatDateString(projEnd)

      if (targetDateStr >= projStartStr && targetDateStr <= projEndStr) {
        isEstimatedPeriod = true
        estimatedPeriodWindow = {
          startDate: projStartStr,
          endDate: projEndStr,
          cycleIndex: k,
        }
        break
      }
    }
  }

  // 3. Compute Cycle Day & Phase for this specific target date
  let cycleDay = null
  let phaseInfo = null

  if (latestPeriodStart) {
    const latestStart = parseDateString(latestPeriodStart)
    const diffTime = targetDate.getTime() - latestStart.getTime()
    const diffDays = Math.floor(diffTime / MS_PER_DAY)

    if (diffDays >= 0) {
      if (effectiveCycleLength && !isIrregular) {
        cycleDay = (diffDays % effectiveCycleLength) + 1
        phaseInfo = estimateCyclePhase(cycleDay, effectiveCycleLength, periodDuration, regularity)
      } else {
        // If length unknown or irregular, cycle day counts up linearly from start
        cycleDay = diffDays + 1
        phaseInfo = estimateCyclePhase(cycleDay, effectiveCycleLength, periodDuration, regularity)
      }
    }
  }

  if (!phaseInfo) {
    phaseInfo = {
      phaseKey: null,
      name: isConfigured ? 'Unestimated' : 'Unrecorded',
      description: isConfigured
        ? 'Date precedes your earliest recorded baseline date.'
        : 'Configure your cycle baseline or record periods to view phase estimates.',
      badge: 'slate',
      isEstimate: false,
      isPaused: true,
      reason: isConfigured ? 'date_precedes_baseline' : 'no_start_date',
    }
  }

  // 4. Check wellness check-in for this date
  const checkIn = checkIns?.find((c) => c.date === targetDateStr) || null

  return {
    dateStr: targetDateStr,
    isRecordedPeriod: Boolean(recordedPeriod),
    recordedPeriod,
    isEstimatedPeriod,
    estimatedPeriodWindow,
    cycleDay,
    phaseInfo,
    checkIn,
    hasCheckIn: Boolean(checkIn),
    isConfigured,
  }
}
