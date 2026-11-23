import { useState } from 'react'
import { CycleContext } from './cycleContextDef'

export function CycleProvider({ children }) {
  // Unconfigured by default: no invented or fabricated cycle records
  const [profile, setProfile] = useState({
    isConfigured: false,
    lastPeriodStart: null,
    cycleLengthDays: 28,
    periodLengthDays: 5,
  })

  const [checkIns, setCheckIns] = useState([])

  const configureProfile = (newProfile) => {
    setProfile({
      ...profile,
      ...newProfile,
      isConfigured: true,
    })
  }

  const resetProfile = () => {
    setProfile({
      isConfigured: false,
      lastPeriodStart: null,
      cycleLengthDays: 28,
      periodLengthDays: 5,
    })
    setCheckIns([])
  }

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
        isConfigured: profile.isConfigured,
        profile,
        checkIns,
        configureProfile,
        resetProfile,
        recordCheckIn,
        isSessionOnly: true,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
