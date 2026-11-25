import { useState, useMemo } from 'react'
import { CycleContext } from './cycleContextDef'
import { calculateCycleSummary } from '../services/cycleCalculator.js'
import { validatePeriod } from '../services/periodValidation.js'

export function CycleProvider({ children }) {
  // Manually configured baseline date kept separate from recorded period dates
  const [baselineStartDate, setBaselineStartDate] = useState(null)

  // 1. Personal Profile State (Voluntary, no fabricated default 28 days)
  const [profile, setProfile] = useState({
    isConfigured: false,
    lastPeriodStart: null,
    cycleLengthDays: null, // optional, no default 28
    periodLengthDays: null, // optional
    regularity: 'regular', // regular | irregular | not_sure
    previousPeriodStarts: [],
  })

  // 2. Period Records State (Session-only in-memory storage)
  const [periods, setPeriods] = useState([])

  // 3. Daily Wellness Check-ins
  const [checkIns, setCheckIns] = useState([])

  // Calculate dynamic cycle summary
  const cycleSummary = useMemo(() => {
    return calculateCycleSummary(profile, periods)
  }, [profile, periods])

  // Profile Configuration
  const saveProfile = (newProfile) => {
    const configuredBaseline = newProfile.lastPeriodStart || null
    setBaselineStartDate(configuredBaseline)

    setProfile((prev) => {
      // If periods exist, the most recent recorded period takes precedence for active calculations;
      // otherwise, use the configured baseline date.
      const latestFromPeriods = periods.length > 0 ? periods[0].startDate : null
      const effectiveDate = latestFromPeriods || configuredBaseline

      return {
        ...prev,
        ...newProfile,
        lastPeriodStart: effectiveDate,
        isConfigured: true,
      }
    })
  }

  const resetProfile = () => {
    setBaselineStartDate(null)
    setProfile({
      isConfigured: false,
      lastPeriodStart: null,
      cycleLengthDays: null,
      periodLengthDays: null,
      regularity: 'regular',
      previousPeriodStarts: [],
    })
    setPeriods([])
    setCheckIns([])
  }

  // Period Records CRUD
  const addPeriod = (periodData) => {
    const validation = validatePeriod(periodData, periods)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors, advisories: validation.advisories }
    }

    const newRecord = {
      id: `period-${Date.now()}`,
      startDate: periodData.startDate,
      endDate: periodData.endDate || null,
      flowIntensity: periodData.flowIntensity || 'Medium',
      notes: periodData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const nextPeriods = [newRecord, ...periods].sort((a, b) => (b.startDate > a.startDate ? 1 : -1))
    setPeriods(nextPeriods)

    // Sync profile.lastPeriodStart to latest recorded period
    const latestDate = nextPeriods[0]?.startDate || baselineStartDate
    setProfile((prev) => ({
      ...prev,
      lastPeriodStart: latestDate,
      isConfigured: true,
    }))

    return { success: true, record: newRecord, advisories: validation.advisories }
  }

  const updatePeriod = (id, periodData) => {
    const validation = validatePeriod(periodData, periods, id)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors, advisories: validation.advisories }
    }

    const updatedPeriods = periods
      .map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          startDate: periodData.startDate,
          endDate: periodData.endDate || null,
          flowIntensity: periodData.flowIntensity || p.flowIntensity,
          notes: periodData.notes !== undefined ? periodData.notes : p.notes,
          updatedAt: new Date().toISOString(),
        }
      })
      .sort((a, b) => (b.startDate > a.startDate ? 1 : -1))

    setPeriods(updatedPeriods)

    // Recalculate latest recorded period start date from the complete updated periods collection
    const latestDate = updatedPeriods[0]?.startDate || baselineStartDate
    setProfile((prev) => ({
      ...prev,
      lastPeriodStart: latestDate,
    }))

    return { success: true, advisories: validation.advisories }
  }

  const deletePeriod = (id) => {
    const remaining = periods
      .filter((p) => p.id !== id)
      .sort((a, b) => (b.startDate > a.startDate ? 1 : -1))
    setPeriods(remaining)

    // If remaining period records exist, use latest recorded period date.
    // If all periods are deleted, restore the original profile baseline information (or null if none).
    const latestDate = remaining.length > 0 ? remaining[0].startDate : baselineStartDate
    setProfile((prev) => ({
      ...prev,
      lastPeriodStart: latestDate,
      isConfigured: Boolean(latestDate || prev.cycleLengthDays),
    }))
  }

  // Daily Check-ins
  const recordCheckIn = (entry) => {
    setCheckIns((prev) => [
      {
        id: `checkin-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ])
  }

  return (
    <CycleContext.Provider
      value={{
        isConfigured: cycleSummary.isConfigured,
        profile,
        periods,
        checkIns,
        cycleSummary,
        saveProfile,
        configureProfile: saveProfile, // backward-compat
        resetProfile,
        addPeriod,
        updatePeriod,
        deletePeriod,
        recordCheckIn,
        isSessionOnly: true,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
