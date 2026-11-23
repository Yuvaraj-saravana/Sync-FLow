import { useState } from 'react'
import {
  IS_DEMO_DATASET,
  DEMO_WELLNESS_OVERVIEW,
  DEMO_CYCLE_WELLNESS,
  DEMO_NUTRITION_SUMMARY,
  DEMO_FITNESS_SUMMARY,
  DEMO_WORKPLACE_TASKS,
  DEMO_MOBILITY_AI_BANNER,
} from '../data/demo/employeeDashboardDemo'

/**
 * useEmployeeDashboard
 * 
 * Central data integration hook for the Employee Dashboard.
 * Defines the contract boundaries between the dashboard view and individual modules:
 * - Cycle & Wellness (Private to Employee)
 * - Nutrition AI
 * - Fitness AI
 * - Workplace Tasks
 * - Personal Insights
 * - Mobility AI
 * 
 * Currently backed by isolated demo data. When individual modules provide
 * live state/services, this hook acts as the adapter layer.
 */
export function useEmployeeDashboard() {
  // State tracking for each module boundary
  const [isDemo] = useState(IS_DEMO_DATASET)
  const [status] = useState({
    overview: 'success',
    cycle: 'success',
    nutrition: 'success',
    fitness: 'success',
    tasks: 'success',
    mobility: 'success',
  })

  // Module data bindings
  const overviewData = DEMO_WELLNESS_OVERVIEW
  const cycleData = DEMO_CYCLE_WELLNESS
  const nutritionData = DEMO_NUTRITION_SUMMARY
  const fitnessData = DEMO_FITNESS_SUMMARY
  const tasksData = DEMO_WORKPLACE_TASKS
  const mobilityData = DEMO_MOBILITY_AI_BANNER

  return {
    isDemo,
    status,
    overview: overviewData,
    cycle: cycleData,
    nutrition: nutritionData,
    fitness: fitnessData,
    tasks: tasksData,
    mobility: mobilityData,
  }
}

export default useEmployeeDashboard
