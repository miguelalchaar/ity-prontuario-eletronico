export type FallRisk =
  | 'Baixo'
  | 'Médio'
  | 'Alto'

export type Dependency =
  | 'Grau I'
  | 'Grau II'
  | 'Grau III'

export type Accommodation =
  | 'Individual'
  | 'Compartilhada'

export type ResidentStatus =
  | 'Ativo'
  | 'Transferido'
  | 'Desligado'
  | 'Falecido'

export type MedicationStatus =
  | 'Administrado'
  | 'Pendente'
  | 'Programado'

export type OccurrenceSeverity =
  | 'Baixa'
  | 'Média'
  | 'Alta'

export interface Guardian {
  name: string
  relation: string
  phone: string
  emergencyPhone: string
}

export interface Resident {
  id: string
  name: string
  age: number
  birthDate: string

  room: string
  bed: string
  accommodation: Accommodation
  status: ResidentStatus
  admission: string

  closureDate?: string
  closureReason?: string

  dependency: Dependency
  fallRisk: FallRisk

  diagnoses: string[]
  allergies: string[]

  diet: string
  mobility: string
  careNotes: string

  photo: string

  cpf: string
  sus: string
  healthPlan: string

  guardian: Guardian
}

export interface Medication {
  id: string
  residentId: string
  name: string
  dosage: string
  route: string
  time: string
  frequency: string
  status: MedicationStatus
}

export interface Vital {
  id: string
  residentId: string
  date: string
  time: string
  weight: string
  height: string
  pressure: string
  temperature: string
  heartRate: string
  saturation: string
  glucose: string
}

export interface Evolution {
  id: string
  residentId: string
  date: string
  time: string
  type: string
  description: string
  author: string
}

export interface Occurrence {
  id: string
  residentId: string
  date: string
  time: string
  type: string
  severity: OccurrenceSeverity
  description: string
  action: string
}