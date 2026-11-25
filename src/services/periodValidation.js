/**
 * SYNC FLOW - Period Validation Service
 * 
 * Validates period tracking inputs, date ranges, flow intensity, and prevents
 * overlapping or conflicting period records while allowing correction of historical records.
 */

import { parseDateString, formatDateString } from './cycleCalculator.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function validatePeriod(period, existingPeriods = [], editingId = null) {
  const errors = {}
  const advisories = {}

  if (!period) {
    return { isValid: false, errors: { general: 'Period data is missing.' }, advisories: {} }
  }

  const { startDate, endDate, flowIntensity } = period
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDateString(today)

  // 1. Start Date Validation
  if (!startDate) {
    errors.startDate = 'Start date is required.'
  } else {
    const start = parseDateString(startDate)
    if (!start) {
      errors.startDate = 'Invalid start date format.'
    } else if (startDate > todayStr) {
      errors.startDate = 'Start date cannot be in the future.'
    } else {
      const diffYears = (today.getTime() - start.getTime()) / (MS_PER_DAY * 365)
      if (diffYears > 5) {
        errors.startDate = 'Start date cannot be more than 5 years in the past.'
      }
    }
  }

  // 2. End Date Validation (optional for ongoing periods)
  if (endDate) {
    const end = parseDateString(endDate)
    const start = parseDateString(startDate)

    if (!end) {
      errors.endDate = 'Invalid end date format.'
    } else if (endDate > todayStr) {
      errors.endDate = 'End date cannot be in the future.'
    } else if (start && end.getTime() < start.getTime()) {
      errors.endDate = 'End date cannot be earlier than start date.'
    } else if (start) {
      const durationDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
      if (durationDays > 45) {
        errors.endDate = 'Recorded period duration cannot exceed 45 days. Please check the dates.'
      } else if (durationDays > 10) {
        advisories.duration = 'This recorded duration is longer than usual. If it concerns you or differs from your normal pattern, consider discussing it with a healthcare professional.'
      }
    }
  }

  // 3. Flow Intensity Validation
  const validFlows = ['Light', 'Medium', 'Heavy', 'light', 'medium', 'heavy']
  if (flowIntensity && !validFlows.includes(flowIntensity)) {
    errors.flowIntensity = 'Please select a valid flow intensity (Light, Medium, or Heavy).'
  }

  // 4. Overlap & Conflict Validation
  if (!errors.startDate && existingPeriods && existingPeriods.length > 0) {
    const otherPeriods = existingPeriods.filter((p) => p.id !== editingId)

    // Check multiple concurrent ongoing periods
    if (!endDate) {
      const existingOngoing = otherPeriods.find((p) => !p.endDate)
      if (existingOngoing) {
        errors.endDate = `Another period starting on ${existingOngoing.startDate} is currently recorded as ongoing. Please enter an end date for the active period before recording a new ongoing period.`
      }
    }

    const candidateStart = parseDateString(startDate)
    // If no end date, treat as 1-day or ongoing window
    const candidateEnd = endDate ? parseDateString(endDate) : candidateStart

    for (const existing of otherPeriods) {
      const exStart = parseDateString(existing.startDate)
      if (!exStart) continue
      const exEnd = existing.endDate ? parseDateString(existing.endDate) : exStart

      // Check identical start date
      if (existing.startDate === startDate) {
        errors.startDate = 'Another period record already exists with this exact start date.'
        break
      }

      // Check date range overlap
      if (candidateStart && candidateEnd && exStart && exEnd) {
        const hasOverlap = candidateStart <= exEnd && candidateEnd >= exStart
        if (hasOverlap) {
          errors.general = `This date range overlaps with an existing period (${existing.startDate} to ${existing.endDate || 'ongoing'}).`
          break
        }

        // Check if start dates are improbably close (e.g. less than 12 days apart)
        const daysApart = Math.abs(Math.round((candidateStart.getTime() - exStart.getTime()) / MS_PER_DAY))
        if (daysApart < 12) {
          errors.startDate = `Start date is only ${daysApart} days from another recorded period (${existing.startDate}). Periods typically occur at least 14 days apart.`
          break
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    advisories,
  }
}
