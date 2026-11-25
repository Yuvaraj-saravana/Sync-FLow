/**
 * SYNC FLOW - Step 5.5 Cycle & Wellness AI Assistant Test Suite
 * 
 * Tests natural-language understanding, context-aware responses,
 * safety protocols, privacy boundaries, and dynamic recalculations across 15 scenarios.
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  processCycleWellnessQuery,
  INTENTS,
} from '../src/services/cycleWellnessAssistantService.js'

test('Cycle & Wellness AI Assistant - Step 5.5 Comprehensive Audit', async (t) => {
  const asOfDate = new Date(2026, 10, 15) // Nov 15, 2026

  // Scenario 1: No cycle profile
  await t.test('Scenario 1: No cycle profile returns empty explanation without fabricated estimates', () => {
    const context = {
      profile: { isConfigured: false, lastPeriodStart: null, cycleLengthDays: null, regularity: 'regular' },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('What is my currently estimated cycle phase?', context)
    assert.equal(res.intent, INTENTS.ESTIMATED_PHASE)
    assert.equal(res.dataStatus, 'insufficient_data')
    assert.ok(res.response.includes('not configured a cycle profile'))
    assert.ok(res.links.some((l) => l.path === '/employee/cycle/settings'))
  })

  // Scenario 2: Baseline date only
  await t.test('Scenario 2: Baseline date only reports baseline start and current day, explains interval needs 2nd period', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-05', cycleLengthDays: null, regularity: 'regular' },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const resPhase = processCycleWellnessQuery('What is my current cycle phase?', context)
    assert.equal(resPhase.intent, INTENTS.ESTIMATED_PHASE)
    assert.equal(resPhase.dataStatus, 'insufficient_intervals')
    assert.ok(resPhase.response.includes('2026-11-05'))
    assert.ok(resPhase.response.includes('Day 11'))
    assert.ok(resPhase.response.includes('average cycle length is not yet established'))

    const resInterval = processCycleWellnessQuery('What is my average cycle interval?', context)
    assert.equal(resInterval.intent, INTENTS.CYCLE_INTERVAL)
    assert.ok(resInterval.response.includes('At least 2 recorded period start dates are required'))
    assert.ok(!resInterval.response.includes('28 days')) // Never assumes default 28
  })

  // Scenario 3: Sufficient cycle history
  await t.test('Scenario 3: Sufficient cycle history reports accurate average interval, shortest/longest, and latest cycle', () => {
    const periods = [
      { id: 'p1', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' },
      { id: 'p2', startDate: '2026-10-04', endDate: '2026-10-09', flowIntensity: 'Heavy' },
      { id: 'p3', startDate: '2026-09-05', endDate: '2026-09-10', flowIntensity: 'Medium' },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: null, regularity: 'regular' },
      periods,
      checkIns: [],
      asOfDate,
    }

    // Interval: Sep 5 -> Oct 4 = 29 days, Oct 4 -> Nov 1 = 28 days. Mean = 28.5 -> 29 days.
    const resInterval = processCycleWellnessQuery('What is my average recorded cycle interval?', context)
    assert.equal(resInterval.intent, INTENTS.CYCLE_INTERVAL)
    assert.ok(resInterval.cards.some((c) => c.label === 'Average Interval' && c.value.includes('Days')))
    assert.ok(resInterval.cards.some((c) => c.label === 'Shortest Interval' && c.value === '28 Days'))
    assert.ok(resInterval.cards.some((c) => c.label === 'Longest Interval' && c.value === '29 Days'))

    const resPhase = processCycleWellnessQuery('What phase am I in?', context)
    assert.equal(resPhase.intent, INTENTS.ESTIMATED_PHASE)
    assert.equal(resPhase.dataStatus, 'complete')
    assert.ok(resPhase.response.includes('2026-11-01'))
    assert.ok(resPhase.tags.includes('Mathematical Estimate'))
  })

  // Scenario 4: Irregular cycle
  await t.test('Scenario 4: Irregular cycle notes irregularity and confirms phase predictions are paused', () => {
    const periods = [
      { id: 'p1', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' },
      { id: 'p2', startDate: '2026-10-01', endDate: '2026-10-05', flowIntensity: 'Medium' },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: null, regularity: 'irregular' },
      periods,
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('What is my currently estimated cycle phase?', context)
    assert.equal(res.intent, INTENTS.ESTIMATED_PHASE)
    assert.equal(res.dataStatus, 'paused_for_irregularity')
    assert.ok(res.response.includes('irregular'))
    assert.ok(res.response.includes('paused'))
    assert.ok(res.cards.some((c) => c.label === 'Phase Projections' && c.value.includes('Paused')))
  })

  // Scenario 5: Unknown cycle length
  await t.test('Scenario 5: Unknown cycle length explains missing interval data without assuming 28 days', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-10', cycleLengthDays: null, regularity: 'regular' },
      periods: [{ id: 'p1', startDate: '2026-11-10', endDate: null, flowIntensity: 'Medium' }],
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('Tell me my average cycle interval', context)
    assert.equal(res.intent, INTENTS.CYCLE_INTERVAL)
    assert.ok(res.response.includes('never assumes a default 28-day cycle'))
    assert.ok(res.response.includes('At least 2 recorded period start dates are required'))
  })

  // Scenario 6: Recorded period questions
  await t.test('Scenario 6: Recorded period questions retrieve actual last start date, flow, and notes', () => {
    const periods = [
      { id: 'p1', startDate: '2026-11-02', endDate: '2026-11-07', flowIntensity: 'Heavy', notes: 'Took magnesium for relaxation' },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-02', cycleLengthDays: 29, regularity: 'regular' },
      periods,
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('When did my last recorded period start?', context)
    assert.equal(res.intent, INTENTS.LAST_PERIOD)
    assert.ok(res.response.includes('2026-11-02'))
    assert.ok(res.response.includes('Heavy'))
    assert.ok(res.response.includes('Took magnesium for relaxation'))
    assert.ok(res.cards.some((c) => c.label === 'Recorded Flow' && c.value === 'Heavy'))
  })

  // Scenario 7: Estimated phase questions
  await t.test('Scenario 7: Estimated phase questions give estimated phase, cycle day, and clarifies estimate status', () => {
    const periods = [
      { id: 'p1', startDate: '2026-11-10', endDate: '2026-11-14', flowIntensity: 'Medium' },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-10', cycleLengthDays: 28, regularity: 'regular' },
      periods,
      checkIns: [],
      asOfDate, // Nov 15 = Day 6
    }

    const res = processCycleWellnessQuery('What is my currently estimated cycle phase?', context)
    assert.equal(res.intent, INTENTS.ESTIMATED_PHASE)
    assert.ok(res.response.includes('Cycle Day 6'))
    assert.ok(res.cards.some((c) => c.label === 'Current Cycle Day' && c.value === 'Day 6'))
    assert.ok(res.additionalNotes.includes('mathematical projection only, not a medically confirmed phase'))
  })

  // Scenario 8: Wellness trend questions
  await t.test('Scenario 8: Wellness trend questions summarize energy distribution, sleep average, comfort frequencies', () => {
    const checkIns = [
      { id: 'c1', date: '2026-11-12', energy: 'Moderate Energy', comfort: 'Comfortable', mood: 'Focused', sleepHours: 8 },
      { id: 'c2', date: '2026-11-13', energy: 'Moderate Energy', comfort: 'Mild Cramping', mood: 'Focused', sleepHours: 7 },
      { id: 'c3', date: '2026-11-14', energy: 'High Energy', comfort: 'Comfortable', mood: 'Creative', sleepHours: 8.5 },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods: [],
      checkIns,
      asOfDate,
    }

    const resEnergy = processCycleWellnessQuery('How has my energy changed this month?', context)
    assert.equal(resEnergy.intent, INTENTS.ENERGY_TRENDS)
    assert.ok(resEnergy.response.includes('Moderate Energy'))
    assert.ok(resEnergy.cards.some((c) => c.label === 'Total Check-ins' && c.value === 3))

    const resPattern = processCycleWellnessQuery('What patterns appear in my wellness check-ins?', context)
    assert.equal(resPattern.intent, INTENTS.WELLNESS_PATTERNS)
    assert.ok(resPattern.response.includes('7.8 hours')) // (8 + 7 + 8.5)/3 = 7.83
  })

  // Scenario 9: Monthly summary questions
  await t.test('Scenario 9: Monthly summary questions summarize check-in volume, dominant mood, and notes', () => {
    const checkIns = [
      { id: 'c1', date: '2026-11-10', energy: 'High Energy', mood: 'Focused & Steady', sleepHours: 8, notes: 'Feeling energized after hydration' },
      { id: 'c2', date: '2026-11-11', energy: 'High Energy', mood: 'Focused & Steady', sleepHours: 7.5, notes: '' },
    ]
    const periods = [
      { id: 'p1', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium', notes: 'Initial period start' },
    ]
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods,
      checkIns,
      asOfDate, // Nov 2026
    }

    const res = processCycleWellnessQuery('Summarize my monthly wellness activity', context)
    assert.equal(res.intent, INTENTS.MONTHLY_SUMMARY)
    assert.ok(res.response.includes('November 2026'))
    assert.ok(res.cards.some((c) => c.label === 'Monthly Check-ins' && c.value === 2))
    assert.ok(res.cards.some((c) => c.label === 'Monthly Periods' && c.value === 1))
    assert.ok(res.response.includes('personal reflection note'))
  })

  // Scenario 10: Missing check-in data
  await t.test('Scenario 10: Missing check-in data clearly explains no check-ins exist, invites user to log', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('What patterns appear in my wellness check-ins?', context)
    assert.equal(res.intent, INTENTS.WELLNESS_PATTERNS)
    assert.equal(res.dataStatus, 'no_checkins')
    assert.ok(res.response.includes('currently no wellness check-ins on file'))
    assert.ok(res.links.some((l) => l.path === '/employee/cycle/check-in'))
  })

  // Scenario 11: Unsupported or unrelated questions
  await t.test('Scenario 11: Unsupported or unrelated questions politely outline supported topics', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const res = processCycleWellnessQuery('Can you book a flight to Paris for me?', context)
    assert.equal(res.intent, INTENTS.UNKNOWN)
    assert.ok(res.response.includes('I can help answer questions regarding your cycle history'))
    assert.ok(res.suggestedPrompts.length > 0)
  })

  // Scenario 12: No fabricated statistics or dates
  await t.test('Scenario 12: No fabricated statistics or dates in empty contexts', () => {
    const context = {
      profile: { isConfigured: false, lastPeriodStart: null, cycleLengthDays: null },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const resHistory = processCycleWellnessQuery('Summarize my recent cycle history', context)
    assert.equal(resHistory.dataStatus, 'empty_records')
    assert.ok(!resHistory.response.includes('28 days'))
    assert.ok(!resHistory.response.includes('Day '))

    const resMonth = processCycleWellnessQuery('Summarize my monthly wellness activity', context)
    assert.equal(resMonth.dataStatus, 'empty_month')
    assert.ok(resMonth.response.includes('No check-ins or periods have been recorded yet'))
  })

  // Scenario 13: Employee-only access boundaries
  await t.test('Scenario 13: Employee-only access boundaries confirmed via confidential tagging and privacy notes', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods: [{ id: 'p1', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' }],
      checkIns: [],
      asOfDate,
    }

    const resHelp = processCycleWellnessQuery('What can you do and who are you?', context)
    assert.equal(resHelp.intent, INTENTS.GENERAL_HELP)
    assert.ok(resHelp.response.includes('never fabricate statistics or share data with managers'))
    assert.ok(resHelp.tags.includes('Employee-Controlled Privacy'))
  })

  // Scenario 14: Responses after period edits and deletions
  await t.test('Scenario 14: Responses dynamically reflect period additions, edits, and deletions', () => {
    // 1. Initial State: 1 Period
    let periods = [
      { id: 'p1', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' }
    ]
    let ctx = { profile: { isConfigured: true, lastPeriodStart: '2026-11-01' }, periods, checkIns: [], asOfDate }
    let res1 = processCycleWellnessQuery('What is my average recorded cycle interval?', ctx)
    assert.ok(res1.response.includes('At least 2 recorded period start dates are required'))

    // 2. Add second period -> interval is calculated
    periods = [
      { id: 'p2', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' },
      { id: 'p1', startDate: '2026-10-02', endDate: '2026-10-06', flowIntensity: 'Medium' }
    ]
    ctx = { profile: { isConfigured: true, lastPeriodStart: '2026-11-01' }, periods, checkIns: [], asOfDate }
    let res2 = processCycleWellnessQuery('What is my average recorded cycle interval?', ctx)
    assert.ok(res2.response.includes('measuring 30 days')) // Oct 2 to Nov 1 = 30 days

    // 3. Edit second period date from Oct 2 to Oct 4 -> interval becomes 28 days
    periods = [
      { id: 'p2', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' },
      { id: 'p1', startDate: '2026-10-04', endDate: '2026-10-08', flowIntensity: 'Medium' }
    ]
    ctx = { profile: { isConfigured: true, lastPeriodStart: '2026-11-01' }, periods, checkIns: [], asOfDate }
    let res3 = processCycleWellnessQuery('What is my average recorded cycle interval?', ctx)
    assert.ok(res3.response.includes('measuring 28 days')) // Oct 4 to Nov 1 = 28 days

    // 4. Delete period -> restores to insufficient
    periods = [
      { id: 'p2', startDate: '2026-11-01', endDate: '2026-11-05', flowIntensity: 'Medium' }
    ]
    ctx = { profile: { isConfigured: true, lastPeriodStart: '2026-11-01' }, periods, checkIns: [], asOfDate }
    let res4 = processCycleWellnessQuery('What is my average recorded cycle interval?', ctx)
    assert.ok(res4.response.includes('At least 2 recorded period start dates are required'))
  })

  // Scenario 15: No medical diagnosis or unsupported treatment advice
  await t.test('Scenario 15: No medical diagnosis or unsupported treatment advice for concerning symptoms', () => {
    const context = {
      profile: { isConfigured: true, lastPeriodStart: '2026-11-01', cycleLengthDays: 28 },
      periods: [],
      checkIns: [],
      asOfDate,
    }

    const symptomQueries = [
      'I have severe cramping and intense pain, what medication should I take?',
      'Can you give me a diagnosis for heavy bleeding and fever?',
      'Prescribe me a pill for sharp pain',
      'Do I have PCOS or endometriosis?',
    ]

    for (const q of symptomQueries) {
      const res = processCycleWellnessQuery(q, context)
      assert.equal(res.intent, INTENTS.MEDICAL_SYMPTOMS)
      assert.equal(res.isMedicalAdvisory, true)
      assert.ok(res.response.includes('does NOT provide medical diagnosis'))
      assert.ok(res.response.includes('consult a qualified healthcare professional'))
      assert.ok(!res.response.includes('ibuprofen'))
      assert.ok(!res.response.includes('take 500mg'))
    }
  })
})
