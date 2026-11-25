/**
 * SYNC FLOW - Regression Test Suite
 * Step 5.2 Edge-Case Corrections
 */

import {
  getEffectiveCycleLength,
  estimateNextPeriodDate,
  calculateCycleSummary,
} from '../src/services/cycleCalculator.js'

import { validatePeriod } from '../src/services/periodValidation.js'

console.log('====================================================')
console.log('SYNC FLOW: STEP 5.2 REGRESSION TEST SUITE')
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
// 1. DST Fallback Date Arithmetic
// ---------------------------------------------------------
console.log('--- 1. DST Fallback Date Arithmetic ---')
{
  // Test starting date right before autumn DST fallback
  // In 2026, US DST ends on Nov 1, 2026
  const start = '2026-10-15'
  const next = estimateNextPeriodDate(start, 28, 'regular')
  // Oct 15 + 28 days = Nov 12, 2026
  assert(next === '2026-11-12', 'estimateNextPeriodDate produces exact calendar day without DST 1-day fallback slip', { received: next, expected: '2026-11-12' })

  // Year boundary test
  const startYearEnd = '2025-12-20'
  const nextYear = estimateNextPeriodDate(startYearEnd, 28, 'regular')
  assert(nextYear === '2026-01-17', 'estimateNextPeriodDate preserves local dates across year boundaries', { received: nextYear })
}

// ---------------------------------------------------------
// 2. Editing the latest period to an earlier date
// ---------------------------------------------------------
console.log('\n--- 2. Editing latest period to an earlier date ---')
{
  // Simulate periods collection: initially with 2026-03-01
  let periods = [
    { id: 'p1', startDate: '2026-03-01', endDate: '2026-03-05' },
    { id: 'p2', startDate: '2026-02-01', endDate: '2026-02-05' }
  ]
  let summary = calculateCycleSummary({}, periods)
  assert(summary.latestPeriodStart === '2026-03-01', 'Initial latest period start is 2026-03-01')

  // Edit p1 to an earlier date 2026-02-20 (e.g. correcting a typo)
  periods = periods.map(p => p.id === 'p1' ? { ...p, startDate: '2026-02-20', endDate: '2026-02-24' } : p)
  summary = calculateCycleSummary({}, periods)
  assert(summary.latestPeriodStart === '2026-02-20', 'After editing p1 to 2026-02-20, summary recalculates to 2026-02-20 without retaining 2026-03-01', { received: summary.latestPeriodStart })
}

// ---------------------------------------------------------
// 3. Deleting the last period while preserving baseline information
// ---------------------------------------------------------
console.log('\n--- 3. Deleting last period with baseline preserved ---')
{
  const profileWithBaseline = {
    isConfigured: true,
    lastPeriodStart: '2026-01-01',
    cycleLengthDays: 28
  }
  let periods = [{ id: 'p1', startDate: '2026-02-01', endDate: '2026-02-05' }]
  let summary = calculateCycleSummary(profileWithBaseline, periods)
  assert(summary.latestPeriodStart === '2026-02-01', 'Active latest period is derived from recorded period 2026-02-01')

  // Delete the only period
  periods = []
  summary = calculateCycleSummary(profileWithBaseline, periods)
  assert(summary.latestPeriodStart === '2026-01-01', 'After deleting only period, latestPeriodStart restores baseline date 2026-01-01', { received: summary.latestPeriodStart })
  assert(summary.isConfigured === true, 'Profile remains configured with baseline parameters')
}

// ---------------------------------------------------------
// 4. Deleting the last period without baseline information
// ---------------------------------------------------------
console.log('\n--- 4. Deleting last period without baseline information ---')
{
  const profileNoBaseline = {
    isConfigured: false,
    lastPeriodStart: null,
    cycleLengthDays: null
  }
  let periods = [{ id: 'p1', startDate: '2026-02-01', endDate: '2026-02-05' }]
  let summary = calculateCycleSummary(profileNoBaseline, periods)
  assert(summary.latestPeriodStart === '2026-02-01', 'With recorded period, latest date is 2026-02-01')

  // Delete the only period
  periods = []
  summary = calculateCycleSummary(profileNoBaseline, periods)
  assert(summary.latestPeriodStart === null, 'After deleting only period with no baseline, latestPeriodStart is null', { received: summary.latestPeriodStart })
  assert(summary.isConfigured === false, 'isConfigured correctly resets to false')
}

// ---------------------------------------------------------
// 5. Creating a second ongoing period
// ---------------------------------------------------------
console.log('\n--- 5. Preventing second concurrent ongoing period ---')
{
  const existing = [
    { id: 'p1', startDate: '2026-02-01', endDate: null, flowIntensity: 'Medium' }
  ]
  const candidate = {
    startDate: '2026-02-20',
    endDate: null,
    flowIntensity: 'Medium'
  }
  const result = validatePeriod(candidate, existing)
  assert(result.isValid === false, 'Second ongoing period is rejected')
  assert(Boolean(result.errors.endDate && result.errors.endDate.includes('currently recorded as ongoing')), 'Error explains that an active ongoing period already exists', result.errors)
}

// ---------------------------------------------------------
// 6. Editing an existing ongoing period
// ---------------------------------------------------------
console.log('\n--- 6. Editing an existing ongoing period ---')
{
  const existing = [
    { id: 'p1', startDate: '2026-02-01', endDate: null, flowIntensity: 'Medium' }
  ]
  // Update notes/flow on p1, keeping endDate null
  const candidate = {
    startDate: '2026-02-01',
    endDate: null,
    flowIntensity: 'Heavy',
    notes: 'Updated note'
  }
  const result = validatePeriod(candidate, existing, 'p1')
  assert(result.isValid === true, 'Editing existing ongoing period with editingId succeeds without self-conflict', result.errors)
}

// ---------------------------------------------------------
// 7. Recording a duration over 20 days (allowed with non-blocking advisory)
// ---------------------------------------------------------
console.log('\n--- 7. Recording duration over 20 days ---')
{
  // 25-day duration: 2026-01-01 to 2026-01-25
  const candidate = {
    startDate: '2026-01-01',
    endDate: '2026-01-25',
    flowIntensity: 'Light'
  }
  const result = validatePeriod(candidate, [])
  assert(result.isValid === true, 'Duration of 25 days is permitted (not blocked by old 20-day limit)')
  assert(Boolean(result.advisories.duration), 'Non-blocking clinical advisory is provided for duration > 10 days', result.advisories)
}

// ---------------------------------------------------------
// 8. Recording a duration over 45 days (hard rejection safeguard)
// ---------------------------------------------------------
console.log('\n--- 8. Recording duration over 45 days ---')
{
  // 50-day duration: 2026-01-01 to 2026-02-19
  const candidate = {
    startDate: '2026-01-01',
    endDate: '2026-02-19',
    flowIntensity: 'Light'
  }
  const result = validatePeriod(candidate, [])
  assert(result.isValid === false, 'Duration > 45 days is rejected')
  assert(Boolean(result.errors.endDate && result.errors.endDate.includes('cannot exceed 45 days')), 'Error message cites 45-day ceiling', result.errors)
}

// ---------------------------------------------------------
// 9. Valid period creation and editing
// ---------------------------------------------------------
console.log('\n--- 9. Standard valid period creation and editing ---')
{
  const validPeriod = {
    startDate: '2026-02-01',
    endDate: '2026-02-06',
    flowIntensity: 'Medium',
    notes: 'Standard healthy flow'
  }
  const result = validatePeriod(validPeriod, [])
  assert(result.isValid === true, 'Standard 6-day period validates cleanly')
  assert(Object.keys(result.errors).length === 0, 'No errors on valid period')
  assert(Object.keys(result.advisories).length === 0, 'No advisory on standard 6-day duration')
}

// ---------------------------------------------------------
// 10. Correct recalculation after period CRUD operations
// ---------------------------------------------------------
console.log('\n--- 10. Recalculation across full period CRUD lifecycle ---')
{
  // 1. Initial 3 periods
  let periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' },
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-04' }, // interval = 29
    { id: '3', startDate: '2026-02-28', endDate: '2026-03-05' }, // interval = 29
  ]
  let length = getEffectiveCycleLength({}, periods)
  assert(length === 29, 'Initial average interval is 29 days')

  // 2. Edit period 2 to 2026-01-29 (intervals become 28 and 30)
  periods = periods.map(p => p.id === '2' ? { ...p, startDate: '2026-01-29' } : p)
  length = getEffectiveCycleLength({}, periods)
  // (28 + 30) / 2 = 29
  assert(length === 29, 'After editing, average remains mathematically accurate (29 days)')

  // 3. Delete intermediate period
  periods = periods.filter(p => p.id !== '2')
  length = getEffectiveCycleLength({}, periods)
  // Interval between Jan 1 and Feb 28 is 58 days (within 18-65)
  assert(length === 58, 'After deleting middle period, interval spans Jan 1 to Feb 28 (58 days)', { length })
}

// ---------------------------------------------------------
// Final Summary
// ---------------------------------------------------------
console.log('\n====================================================')
const passedCount = testResults.filter(r => r.pass).length
const totalCount = testResults.length
console.log(`TOTAL REGRESSION TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`)
console.log('====================================================')

if (passedCount !== totalCount) {
  process.exit(1)
}
