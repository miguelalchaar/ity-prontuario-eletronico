import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  evolutions as initialEvolutions,
  medications as initialMedications,
  occurrences as initialOccurrences,
  residents as initialResidents,
  vitals as initialVitals,
} from '../data/mockData'

import type {
  Evolution,
  Medication,
  Occurrence,
  Resident,
  Vital,
} from '../types'

interface Store {
  residents: Resident[]
  addResident: (resident: Resident) => void
  updateResident: (
    id: string,
    updates: Partial<Resident>,
  ) => void
  removeResident: (id: string) => void

  medications: Medication[]
  addMedication: (
    medication: Medication,
  ) => void
  administer: (id: string) => void

  vitals: Vital[]
  addVital: (vital: Vital) => void

  evolutions: Evolution[]
  addEvolution: (
    evolution: Evolution,
  ) => void

  occurrences: Occurrence[]
  addOccurrence: (
    occurrence: Occurrence,
  ) => void
}

const AppContext = createContext<Store | null>(
  null,
)

export function AppStoreProvider({
  children,
}: {
  children: ReactNode
}) {
  const [residents, setResidents] =
    useState<Resident[]>(initialResidents)

  const [medications, setMedications] =
    useState<Medication[]>(
      initialMedications,
    )

  const [vitals, setVitals] =
    useState<Vital[]>(initialVitals)

  const [evolutions, setEvolutions] =
    useState<Evolution[]>(
      initialEvolutions,
    )

  const [occurrences, setOccurrences] =
    useState<Occurrence[]>(
      initialOccurrences,
    )

  const value = useMemo<Store>(
    () => ({
      residents,

      addResident: (resident) => {
        setResidents((current) => [
          resident,
          ...current,
        ])
      },

      updateResident: (
        id,
        updates,
      ) => {
        setResidents((current) =>
          current.map((resident) =>
            resident.id === id
              ? {
                  ...resident,
                  ...updates,
                }
              : resident,
          ),
        )
      },

      removeResident: (id) => {
        setResidents((current) =>
          current.filter(
            (resident) =>
              resident.id !== id,
          ),
        )

        setMedications((current) =>
          current.filter(
            (medication) =>
              medication.residentId !== id,
          ),
        )

        setVitals((current) =>
          current.filter(
            (vital) =>
              vital.residentId !== id,
          ),
        )

        setEvolutions((current) =>
          current.filter(
            (evolution) =>
              evolution.residentId !== id,
          ),
        )

        setOccurrences((current) =>
          current.filter(
            (occurrence) =>
              occurrence.residentId !== id,
          ),
        )
      },

      medications,

      addMedication: (
        medication,
      ) => {
        setMedications((current) => [
          ...current,
          medication,
        ])
      },

      administer: (id) => {
        setMedications((current) =>
          current.map((medication) =>
            medication.id === id
              ? {
                  ...medication,
                  status: 'Administrado',
                }
              : medication,
          ),
        )
      },

      vitals,

      addVital: (vital) => {
        setVitals((current) => [
          vital,
          ...current,
        ])
      },

      evolutions,

      addEvolution: (
        evolution,
      ) => {
        setEvolutions((current) => [
          evolution,
          ...current,
        ])
      },

      occurrences,

      addOccurrence: (
        occurrence,
      ) => {
        setOccurrences((current) => [
          occurrence,
          ...current,
        ])
      },
    }),
    [
      residents,
      medications,
      vitals,
      evolutions,
      occurrences,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore(): Store {
  const context = useContext(AppContext)

  if (context === null) {
    throw new Error(
      'useAppStore must be used inside AppStoreProvider',
    )
  }

  return context
}