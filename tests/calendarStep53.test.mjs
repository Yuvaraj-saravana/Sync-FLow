/**
 * SYNC FLOW - Step 5.3 Calendar & Mathematical Phase Verification Test Suite
 */

import {
  getDateCycleStatus,
} from '../src/services/cycleCalculator.js'

console.log('====================================================')
console.log('SYNC FLOW: STEP 5.3 CALENDAR VERIFICATION SUITE')
console.log('====================================================\n')

const testResults = []

function assert(condition, testName, extra = null) {
  if (condition) {
    console.log(`[PASS] ${testName}`)
    testResults.push({ name: testName, pass: true })
  } else {
    console.error(`[FAIL] ${testName}`)
    if (extra) console.error('       Details:', extra)
    testResults.push({ name: testName, pass: false, extra })
  }
}

// ---------------------------------------------------------
// Scenario 1: Employee has no cycle profile
// ---------------------------------------------------------
console.log('--- Scenario 1: No cycle profile ---')
{
  const status = getDateCycleStatus('2026-03-15', {}, [], [])
  assert(status.isConfigured === false, 'isConfigured is false')
  assert(status.isRecordedPeriod === false, 'isRecordedPeriod is false')
  assert(status.isEstimatedPeriod === false, 'isEstimatedPeriod is false')
  assert(status.cycleDay === null, 'cycleDay is null')
  assert(status.phaseInfo.isPaused === true, 'Phase estimation is paused')
  assert(status.phaseInfo.reason === 'no_start_date', 'Reason indicates no start date recorded')
}

// ---------------------------------------------------------
// Scenario 2: Employee has only a baseline date
// ---------------------------------------------------------
console.log('\n--- Scenario 2: Only baseline date ---')
{
  const profile = { isConfigured: true, lastPeriodStart: '2026-03-01', cycleLengthDays: 28 }
  const status = getDateCycleStatus('2026-03-01', profile, [], [])
  assert(status.isConfigured === true, 'isConfigured is true')
  assert(status.cycleDay === 1, 'Cycle Day on start date is 1')
  assert(status.phaseInfo.phaseKey === 'menstrual', 'Cycle Day 1 phase is Menstrual (Estimated)')
}

// ---------------------------------------------------------
// Scenario 3: Employee has sufficient historical dates (2+ periods)
// ---------------------------------------------------------
console.log('\n--- Scenario 3: Sufficient historical dates ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' },
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-04' } // 29 days
  ]
  const statusMidCycle = getDateCycleStatus('2026-02-14', {}, periods, [])
  assert(statusMidCycle.cycleDay === 16, 'Cycle Day is 16 for Feb 14 from Jan 30')
  assert(statusMidCycle.phaseInfo.phaseKey === 'ovulatory', 'Day 16 in a 29-day cycle is Ovulatory (Estimated)')
}

// ---------------------------------------------------------
// Scenario 4: Employee has irregular cycles
// ---------------------------------------------------------
console.log('\n--- Scenario 4: Irregular cycles ---')
{
  const profile = { isConfigured: true, lastPeriodStart: '2026-03-01', regularity: 'irregular' }
  const status = getDateCycleStatus('2026-03-15', profile, [], [])
  assert(status.isEstimatedPeriod === false, 'No estimated period generated for irregular cycle')
  assert(status.phaseInfo.isPaused === true, 'Phase estimation is paused for irregular cycle')
  assert(status.phaseInfo.reason === 'irregular_cycle', 'Reason indicates irregular cycle')
}

// ---------------------------------------------------------
// Scenario 5: Employee has unknown cycle length
// ---------------------------------------------------------
console.log('\n--- Scenario 5: Unknown cycle length ---')
{
  const profile = { isConfigured: true, lastPeriodStart: '2026-03-01', cycleLengthDays: null }
  const status = getDateCycleStatus('2026-03-15', profile, [], [])
  assert(status.isEstimatedPeriod === false, 'No estimated period when cycle length is unknown')
  assert(status.phaseInfo.isPaused === true, 'Phase estimation paused when length is unknown')
  assert(status.phaseInfo.reason === 'unknown_cycle_length', 'Reason indicates unknown cycle length')
}

// ---------------------------------------------------------
// Scenario 6: Employee has recorded period history
// ---------------------------------------------------------
console.log('\n--- Scenario 6: Recorded period history ---')
{
  const periods = [
    { id: 'p1', startDate: '2026-02-10', endDate: '2026-02-15', flowIntensity: 'Heavy', notes: 'First day cramps' }
  ]
  // Date inside period flow
  const statusFlow = getDateCycleStatus('2026-02-12', {}, periods, [])
  assert(statusFlow.isRecordedPeriod === true, 'Day inside period flow is marked isRecordedPeriod: true')
  assert(statusFlow.recordedPeriod.flowIntensity === 'Heavy', 'Flow intensity is Heavy')
  assert(statusFlow.recordedPeriod.notes === 'First day cramps', 'Notes are correctly preserved')

  // Date outside period flow
  const statusOutside = getDateCycleStatus('2026-02-18', {}, periods, [])
  assert(statusOutside.isRecordedPeriod === false, 'Day outside period is isRecordedPeriod: false')
}

// ---------------------------------------------------------
// Scenario 7: Year boundary navigation
// ---------------------------------------------------------
console.log('\n--- Scenario 7: Year boundaries ---')
{
  const periods = [
    { id: 'p1', startDate: '2025-12-25', endDate: '2025-12-30' }
  ]
  const statusNewYear = getDateCycleStatus('2026-01-05', {}, periods, [])
  assert(statusNewYear.cycleDay === 12, 'Calculates 12 days elapsed across Dec 31 to Jan 5')
}

// ---------------------------------------------------------
// Scenario 8: February in leap and non-leap years
// ---------------------------------------------------------
console.log('\n--- Scenario 8: February leap and non-leap years ---')
{
  // 2024 is a leap year (Feb 29 exists)
  const feb2024Days = new Date(2024, 2, 0).getDate()
  assert(feb2024Days === 29, '2024 leap year February has 29 days')

  // 2025 is not a leap year (Feb 28 days)
  const feb2025Days = new Date(2025, 2, 0).getDate()
  assert(feb2025Days === 28, '2025 non-leap year February has 28 days')

  // 2028 is a leap year (Feb 29 exists)
  const feb2028Days = new Date(2028, 2, 0).getDate()
  assert(feb2028Days === 29, '2028 leap year February has 29 days')
}

// ---------------------------------------------------------
// Scenario 9: Selected recorded period date
// ---------------------------------------------------------
console.log('\n--- Scenario 9: Select recorded period date ---')
{
  const periods = [
    { id: 'rec-1', startDate: '2026-03-01', endDate: '2026-03-05', flowIntensity: 'Medium' }
  ]
  const status = getDateCycleStatus('2026-03-03', {}, periods, [])
  assert(status.isRecordedPeriod === true, 'Selected date is identified as recorded period')
  assert(status.recordedPeriod.id === 'rec-1', 'Contains period record data')
}

// ---------------------------------------------------------
// Scenario 10: Selected estimated period date
// ---------------------------------------------------------
console.log('\n--- Scenario 10: Select estimated period date ---')
{
  // Cycle starts 2026-03-01 with 28-day length -> next period estimated around 2026-03-29
  const profile = { isConfigured: true, lastPeriodStart: '2026-03-01', cycleLengthDays: 28, periodLengthDays: 5 }
  const statusEst = getDateCycleStatus('2026-03-29', profile, [], [])
  assert(statusEst.isEstimatedPeriod === true, 'Next period date 2026-03-29 is identified as isEstimatedPeriod: true')
  assert(statusEst.isRecordedPeriod === false, 'Estimated period date is NOT marked as recorded')
  assert(statusEst.estimatedPeriodWindow.startDate === '2026-03-29', 'Estimated window start is 2026-03-29')
}

// ---------------------------------------------------------
// Scenario 11: Selected date without any data
// ---------------------------------------------------------
console.log('\n--- Scenario 11: Select date without data ---')
{
  const statusBlank = getDateCycleStatus('2025-01-01', {}, [], [])
  assert(statusBlank.isRecordedPeriod === false, 'Not a recorded period')
  assert(statusBlank.isEstimatedPeriod === false, 'Not an estimated period')
  assert(statusBlank.hasCheckIn === false, 'No check-in')
  assert(statusBlank.phaseInfo.isPaused === true, 'Phase estimation paused')
}

// ---------------------------------------------------------
// Scenario 12: Calendar navigation does NOT mutate cycle records
// ---------------------------------------------------------
console.log('\n--- Scenario 12: Calendar navigation purity ---')
{
  const originalProfile = Object.freeze({ isConfigured: true, lastPeriodStart: '2026-03-01', cycleLengthDays: 28 })
  const originalPeriods = Object.freeze([
    Object.freeze({ id: '1', startDate: '2026-03-01', endDate: '2026-03-05' })
  ])
  // Simulate querying across different months
  getDateCycleStatus('2025-01-01', originalProfile, originalPeriods, [])
  getDateCycleStatus('2026-07-01', originalProfile, originalPeriods, [])
  getDateCycleStatus('2027-12-31', originalProfile, originalPeriods, [])

  assert(originalProfile.lastPeriodStart === '2026-03-01', 'Profile state remains unmutated after querying months')
  assert(originalPeriods.length === 1, 'Periods collection remains unmutated after querying months')
}

// ---------------------------------------------------------
// Scenario 13: Wellness check-in indicators
// ---------------------------------------------------------
console.log('\n--- Scenario 13: Wellness check-in indicator ---')
{
  const checkIns = [
    { id: 'c1', date: '2026-03-10', energy: 'High Energy', comfort: 'Comfortable', mood: 'Motivated', sleepHours: 8 }
  ]
  const statusWithCheckIn = getDateCycleStatus('2026-03-10', {}, [], checkIns)
  assert(statusWithCheckIn.hasCheckIn === true, 'Date 2026-03-10 shows hasCheckIn: true')
  assert(statusWithCheckIn.checkIn.energy === 'High Energy', 'Check-in energy matches saved log')

  const statusWithoutCheckIn = getDateCycleStatus('2026-03-11', {}, [], checkIns)
  assert(statusWithoutCheckIn.hasCheckIn === false, 'Date 2026-03-11 shows hasCheckIn: false (no phantom indicator)')
  assert(statusWithoutCheckIn.checkIn === null, 'Check-in object is null when no log exists')
}

// ---------------------------------------------------------
// Summary
// ---------------------------------------------------------
console.log('\n====================================================')
const passedCount = testResults.filter(r => r.pass).length
const totalCount = testResults.length
console.log(`TOTAL STEP 5.3 VERIFICATION TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`)
console.log('====================================================')

if (passedCount !== totalCount) {
  process.exit(1)
}
