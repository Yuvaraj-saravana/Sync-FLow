/**
 * SYNC FLOW - Step 5.4 Personal Cycle Insights & Wellness Trends Test Suite
 */

import {
  calculateCycleHistoryAnalytics,
  calculateDurationAnalytics,
  calculateWellnessAnalytics,
  calculateMonthlySummary,
  generatePersonalInsights,
} from '../src/services/cycleAnalytics.js'

console.log('====================================================')
console.log('SYNC FLOW: STEP 5.4 CYCLE INSIGHTS TEST SUITE')
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
// 1. No cycle profile
// ---------------------------------------------------------
console.log('--- 1. No cycle profile ---')
{
  const analytics = calculateCycleHistoryAnalytics([], {})
  assert(analytics.hasEnoughData === false, 'hasEnoughData is false when no profile or periods exist')
  assert(analytics.averageInterval === null, 'averageInterval is null')
  assert(analytics.totalPeriods === 0, 'totalPeriods is 0')
}

// ---------------------------------------------------------
// 2. Baseline date only
// ---------------------------------------------------------
console.log('\n--- 2. Baseline date only ---')
{
  const profile = { isConfigured: true, lastPeriodStart: '2026-03-01' }
  const analytics = calculateCycleHistoryAnalytics([], profile)
  assert(analytics.hasEnoughData === false, 'Baseline date only does not provide enough interval data')
  assert(analytics.averageInterval === null, 'averageInterval remains null without 2+ dates')
}

// ---------------------------------------------------------
// 3. One recorded period
// ---------------------------------------------------------
console.log('\n--- 3. One recorded period ---')
{
  const periods = [{ id: '1', startDate: '2026-03-01', endDate: '2026-03-05' }]
  const analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.hasEnoughData === false, '1 recorded period is not enough for interval history')
  assert(analytics.totalPeriods === 1, 'totalPeriods is 1')
  assert(analytics.validIntervalCount === 0, 'validIntervalCount is 0')
}

// ---------------------------------------------------------
// 4. Two recorded periods
// ---------------------------------------------------------
console.log('\n--- 4. Two recorded periods ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' },
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-04' } // 29 days
  ]
  const analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.hasEnoughData === true, 'hasEnoughData is true for 2 periods')
  assert(analytics.validIntervalCount === 1, 'Exactly 1 interval derived')
  assert(analytics.averageInterval === 29, 'Average interval is 29 days')
  assert(analytics.latestInterval === 29, 'Latest interval is 29 days')
}

// ---------------------------------------------------------
// 5. Multiple historical periods
// ---------------------------------------------------------
console.log('\n--- 5. Multiple historical periods ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' },
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-04' }, // 29 days
    { id: '3', startDate: '2026-02-27', endDate: '2026-03-03' }, // 28 days
    { id: '4', startDate: '2026-03-29', endDate: '2026-04-03' }, // 30 days
  ]
  const analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.hasEnoughData === true, 'Multiple periods yield history')
  assert(analytics.validIntervalCount === 3, 'Yields exactly 3 consecutive intervals')
  assert(analytics.intervals.length === 3, 'intervals array has 3 entries')
}

// ---------------------------------------------------------
// 6. Average cycle interval calculation
// ---------------------------------------------------------
console.log('\n--- 6. Average cycle interval calculation ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01' },
    { id: '2', startDate: '2026-01-31' }, // 30 days
    { id: '3', startDate: '2026-02-28' }, // 28 days
  ]
  const analytics = calculateCycleHistoryAnalytics(periods, {})
  // (30 + 28) / 2 = 29
  assert(analytics.averageInterval === 29, 'Average of 30 and 28 is 29')
}

// ---------------------------------------------------------
// 7. Shortest and longest interval calculation
// ---------------------------------------------------------
console.log('\n--- 7. Shortest and longest interval ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01' },
    { id: '2', startDate: '2026-01-28' }, // 27 days
    { id: '3', startDate: '2026-03-01' }, // 32 days
    { id: '4', startDate: '2026-03-30' }, // 29 days
  ]
  const analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.shortestInterval === 27, 'Shortest interval is 27 days')
  assert(analytics.longestInterval === 32, 'Longest interval is 32 days')
  assert(analytics.variation === 5, 'Variation is 5 days (32 - 27)')
}

// ---------------------------------------------------------
// 8. Period duration calculation
// ---------------------------------------------------------
console.log('\n--- 8. Period duration calculation ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05', flowIntensity: 'Medium' }, // 5 days
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-05', flowIntensity: 'Heavy' },  // 7 days
  ]
  const durationStats = calculateDurationAnalytics(periods)
  assert(durationStats.hasEnoughData === true, 'Duration stats available for completed periods')
  assert(durationStats.completedPeriodsCount === 2, '2 completed periods counted')
  assert(durationStats.averageDuration === 6, 'Average of 5 and 7 is 6.0 days')
  assert(durationStats.shortestDuration === 5, 'Shortest duration is 5 days')
  assert(durationStats.longestDuration === 7, 'Longest duration is 7 days')
}

// ---------------------------------------------------------
// 9. Ongoing period handling (not treated as finished duration)
// ---------------------------------------------------------
console.log('\n--- 9. Ongoing period handling ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' }, // 5 days
    { id: '2', startDate: '2026-02-20', endDate: null }, // Ongoing!
  ]
  const durationStats = calculateDurationAnalytics(periods)
  assert(durationStats.completedPeriodsCount === 1, 'Only 1 completed period counted')
  assert(durationStats.ongoingPeriodsCount === 1, '1 ongoing period detected')
  assert(durationStats.averageDuration === 5, 'Average duration uses ONLY completed period (5 days)')
}

// ---------------------------------------------------------
// 10. Empty wellness history
// ---------------------------------------------------------
console.log('\n--- 10. Empty wellness history ---')
{
  const wellness = calculateWellnessAnalytics([])
  assert(wellness.hasData === false, 'hasData is false when checkIns is empty')
  assert(wellness.totalCheckIns === 0, 'totalCheckIns is 0')
  assert(wellness.averageSleep === null, 'averageSleep is null')
  assert(wellness.sleepTrend.length === 0, 'sleepTrend is empty')
}

// ---------------------------------------------------------
// 11. Actual wellness check-in aggregation
// ---------------------------------------------------------
console.log('\n--- 11. Actual wellness check-in aggregation ---')
{
  const checkIns = [
    { id: '1', date: '2026-03-01', energy: 'High Energy', comfort: 'Comfortable & Balanced', mood: 'Focused & Steady', sleepHours: 8 },
    { id: '2', date: '2026-03-02', energy: 'High Energy', comfort: 'Comfortable & Balanced', mood: 'Focused & Steady', sleepHours: 7 },
    { id: '3', date: '2026-03-03', energy: 'Moderate Energy', comfort: 'Mild Cramping', mood: 'Creative & Inspired', sleepHours: 7.5 },
  ]
  const wellness = calculateWellnessAnalytics(checkIns)
  assert(wellness.hasData === true, 'hasData is true')
  assert(wellness.totalCheckIns === 3, 'totalCheckIns is 3')
  // (8 + 7 + 7.5) / 3 = 22.5 / 3 = 7.5
  assert(wellness.averageSleep === 7.5, 'Average sleep is 7.5 hrs')
  assert(wellness.mostFrequentEnergy === 'High Energy', 'Dominant energy is High Energy')
  assert(wellness.mostFrequentMood === 'Focused & Steady', 'Dominant mood is Focused & Steady')
}

// ---------------------------------------------------------
// 12. Missing individual wellness fields
// ---------------------------------------------------------
console.log('\n--- 12. Missing individual wellness fields ---')
{
  const checkIns = [
    { id: '1', date: '2026-03-01', energy: 'Moderate Energy', comfort: null, mood: undefined, sleepHours: null },
    { id: '2', date: '2026-03-02', energy: null, comfort: 'Comfortable & Balanced', mood: 'Focused & Steady', sleepHours: 8 },
  ]
  const wellness = calculateWellnessAnalytics(checkIns)
  assert(wellness.totalCheckIns === 2, 'Total check-ins is 2')
  assert(wellness.averageSleep === 8, 'averageSleep ignores null and uses valid value (8 hrs)')
  assert(wellness.sleepTrend.length === 1, 'sleepTrend contains only entries with valid sleep numbers')
  assert(wellness.energyDistribution['Moderate Energy'] === 1, 'energy distribution tracks only present field')
}

// ---------------------------------------------------------
// 13. Monthly summary accuracy
// ---------------------------------------------------------
console.log('\n--- 13. Monthly summary accuracy ---')
{
  const checkIns = [
    { id: '1', date: '2026-02-28', energy: 'Low', sleepHours: 6 }, // Feb
    { id: '2', date: '2026-03-01', energy: 'Moderate Energy', sleepHours: 7.5, notes: 'Feeling refreshed' }, // Mar
    { id: '3', date: '2026-03-05', energy: 'High Energy', sleepHours: 8 }, // Mar
  ]
  const periods = [
    { id: 'p1', startDate: '2026-03-02', endDate: '2026-03-06' }
  ]
  // Query March 2026 (month = 2 in 0-indexed)
  const summaryMar = calculateMonthlySummary(2026, 2, checkIns, periods)
  assert(summaryMar.hasData === true, 'March has data')
  assert(summaryMar.checkInCount === 2, 'March checkInCount is 2 (Feb excluded)')
  assert(summaryMar.periodsCount === 1, 'March periodsCount is 1')
  // (7.5 + 8) / 2 = 7.8 (rounded)
  assert(summaryMar.averageSleep === 7.8, 'Average sleep for March is 7.8 hrs')
  assert(summaryMar.notesList.length === 1, 'Notes list has 1 entry')
  assert(summaryMar.notesList[0].text === 'Feeling refreshed', 'Notes text matches')

  // Query April 2026 (month = 3)
  const summaryApr = calculateMonthlySummary(2026, 3, checkIns, periods)
  assert(summaryApr.hasData === false, 'April has no data')
  assert(summaryApr.checkInCount === 0, 'April checkInCount is 0')
}

// ---------------------------------------------------------
// 14. Insights generated only when sufficient data exists
// ---------------------------------------------------------
console.log('\n--- 14. Insights generated only with sufficient data ---')
{
  // Empty data
  const emptyInsights = generatePersonalInsights({
    cycleAnalytics: { hasEnoughData: false },
    durationAnalytics: { hasEnoughData: false },
    wellnessAnalytics: { hasData: false },
    profile: {}
  })
  assert(emptyInsights.length === 0, 'Zero insights generated when no data exists (no phantom insights)')

  // With sufficient data
  const fullInsights = generatePersonalInsights({
    cycleAnalytics: {
      hasEnoughData: true,
      averageInterval: 28,
      shortestInterval: 27,
      longestInterval: 29,
      intervals: [{ days: 28 }, { days: 28 }]
    },
    durationAnalytics: {
      hasEnoughData: true,
      averageDuration: 5.5,
      shortestDuration: 5,
      longestDuration: 6,
      durations: [{ duration: 5 }, { duration: 6 }]
    },
    wellnessAnalytics: {
      hasData: true,
      totalCheckIns: 4,
      averageSleep: 7.8,
      sleepRange: { min: 7, max: 8.5 },
      sleepTrend: [{}, {}, {}],
      mostFrequentEnergy: 'High Energy',
      energyDistribution: { 'High Energy': 3, 'Moderate Energy': 1 }
    },
    profile: { regularity: 'regular' }
  })
  assert(fullInsights.length >= 4, 'Generates 4+ rule-based insights when sufficient data exists')
  assert(fullInsights.every(i => !i.text.includes('productivity')), 'No insight references workplace productivity')
}

// ---------------------------------------------------------
// 15. Reactivity after period edits and deletions
// ---------------------------------------------------------
console.log('\n--- 15. Reactivity after period edits and deletions ---')
{
  let periods = [
    { id: '1', startDate: '2026-01-01', endDate: '2026-01-05' },
    { id: '2', startDate: '2026-01-30', endDate: '2026-02-04' }, // interval = 29
    { id: '3', startDate: '2026-02-28', endDate: '2026-03-05' }, // interval = 29
  ]
  let analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.averageInterval === 29, 'Initial average interval is 29')

  // Edit period 2 from Jan 30 to Jan 28 (intervals become 27 and 31)
  periods = periods.map(p => p.id === '2' ? { ...p, startDate: '2026-01-28' } : p)
  analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.shortestInterval === 27, 'Shortest interval updates to 27 after edit')
  assert(analytics.longestInterval === 31, 'Longest interval updates to 31 after edit')

  // Delete period 2 (interval becomes 58 days between Jan 1 and Feb 28)
  periods = periods.filter(p => p.id !== '2')
  analytics = calculateCycleHistoryAnalytics(periods, {})
  assert(analytics.validIntervalCount === 1, 'Interval count updates to 1 after deletion')
  assert(analytics.averageInterval === 58, 'Interval bridges Jan 1 to Feb 28 (58 days)')
}

// ---------------------------------------------------------
// 16. Irregular cycle handling
// ---------------------------------------------------------
console.log('\n--- 16. Irregular cycle handling ---')
{
  const periods = [
    { id: '1', startDate: '2026-01-01' },
    { id: '2', startDate: '2026-01-30' },
  ]
  const profile = { regularity: 'irregular' }
  const analytics = calculateCycleHistoryAnalytics(periods, profile)
  assert(analytics.isIrregular === true, 'Analytics flags isIrregular: true')
  assert(analytics.regularityObservation.includes('irregular'), 'Observation reflects irregular status')

  const insights = generatePersonalInsights({
    cycleAnalytics: analytics,
    profile
  })
  const irregularInsight = insights.find(i => i.id === 'cycle-irregular')
  assert(Boolean(irregularInsight), 'Personal insights explicitly note irregular cycle and paused estimates')
}

// ---------------------------------------------------------
// 17. No fabricated values
// ---------------------------------------------------------
console.log('\n--- 17. No fabricated values ---')
{
  const analytics = calculateCycleHistoryAnalytics([], {})
  assert(analytics.averageInterval === null, 'No fallback to default 28 days when periods are empty')
  const duration = calculateDurationAnalytics([])
  assert(duration.averageDuration === null, 'No fallback duration when periods are empty')
  const wellness = calculateWellnessAnalytics([])
  assert(wellness.averageSleep === null, 'No fallback sleep value when checkIns are empty')
}

// ---------------------------------------------------------
// Final Summary
// ---------------------------------------------------------
console.log('\n====================================================')
const passedCount = testResults.filter(r => r.pass).length
const totalCount = testResults.length
console.log(`TOTAL STEP 5.4 VERIFICATION TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`)
console.log('====================================================')

if (passedCount !== totalCount) {
  process.exit(1)
}
