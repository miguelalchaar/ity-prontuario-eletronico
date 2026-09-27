import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Clock3,
    HeartPulse,
    Pill,
    UserRoundPlus,
    Users,
  } from 'lucide-react'
  import { Link } from 'react-router-dom'
  
  import { useAppStore } from '../../lib/store'
  
  import { Button } from '../ui/button'
  
  import { AppShell } from './AppShell'
  import {
    PageTitle,
    ResidentRow,
    Section,
  } from './common'
  
  export default function Dashboard() {
    const {
      residents,
      medications,
      vitals,
      evolutions,
      occurrences,
    } = useAppStore()
  
    const activeResidents =
      residents.filter(
        (resident) =>
          resident.status === 'Ativo',
      )
  
    const highRiskResidents =
      activeResidents.filter(
        (resident) =>
          resident.fallRisk === 'Alto',
      )
  
    const pendingMedications =
      medications.filter(
        (medication) =>
          medication.status !==
          'Administrado',
      )
  
    const recentOccurrences =
      occurrences.slice(0, 3)
  
    const recentEvolutions =
      evolutions.slice(0, 3)
  
    const nextMedication =
      pendingMedications[0]
  
    const nextMedicationResident =
      nextMedication
        ? residents.find(
            (resident) =>
              resident.id ===
              nextMedication.residentId,
          )
        : undefined
  
    const recentOccurrence =
      occurrences[0]
  
    const recentVital = vitals[0]
  
    return (
      <AppShell>
        <PageTitle
          title="Visão geral"
          description="Acompanhe os principais registros e alertas do plantão."
          action={
            <Button
              asChild
              size="lg"
            >
              <Link to="/residentes/novo">
                <UserRoundPlus />
                Novo residente
              </Link>
            </Button>
          }
        />
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Users}
            label="Residentes ativos"
            value={activeResidents.length}
            description={`${residents.length} registros no sistema`}
          />
  
          <SummaryCard
            icon={AlertTriangle}
            label="Alto risco"
            value={highRiskResidents.length}
            description="residentes com alto risco de queda"
            tone="warning"
          />
  
          <SummaryCard
            icon={Pill}
            label="Medicamentos"
            value={pendingMedications.length}
            description="administrações pendentes"
            tone="blue"
          />
  
          <SummaryCard
            icon={Activity}
            label="Ocorrências"
            value={occurrences.length}
            description="registros no prontuário"
            tone="danger"
          />
        </div>
  
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Section
              title="Residentes"
              icon={Users}
              action={
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                >
                  <Link to="/residentes">
                    Ver todos
                    <ArrowRight />
                  </Link>
                </Button>
              }
            >
              {activeResidents.length >
              0 ? (
                activeResidents
                  .slice(0, 4)
                  .map((resident) => (
                    <ResidentRow
                      key={resident.id}
                      resident={resident}
                    />
                  ))
              ) : (
                <EmptyState message="Nenhum residente ativo cadastrado." />
              )}
            </Section>
  
            <Section
              title="Ocorrências recentes"
              icon={AlertTriangle}
              action={
                <span className="text-xs font-medium text-gray-400">
                  Últimos registros
                </span>
              }
            >
              {recentOccurrences.length >
              0 ? (
                <div className="space-y-3">
                  {recentOccurrences.map(
                    (occurrence) => {
                      const occurrenceResident =
                        residents.find(
                          (resident) =>
                            resident.id ===
                            occurrence.residentId,
                        )
  
                      return (
                        <div
                          key={occurrence.id}
                          className="rounded-lg border border-gray-200 p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  {occurrence.type}
                                </span>
  
                                <SeverityBadge
                                  severity={
                                    occurrence.severity
                                  }
                                />
                              </div>
  
                              <p className="mt-1 text-sm text-gray-500">
                                {occurrenceResident
                                  ?.name ??
                                  'Residente não encontrado'}
                              </p>
                            </div>
  
                            <span className="shrink-0 text-xs font-medium text-gray-400">
                              {formatDate(
                                occurrence.date,
                              )}{' '}
                              •{' '}
                              {occurrence.time}
                            </span>
                          </div>
  
                          <p className="mt-3 text-sm leading-5 text-gray-600">
                            {
                              occurrence.description
                            }
                          </p>
                        </div>
                      )
                    },
                  )}
                </div>
              ) : (
                <EmptyState message="Nenhuma ocorrência registrada." />
              )}
            </Section>
          </div>
  
          <div className="space-y-6">
            <Section
              title="Próximo medicamento"
              icon={Pill}
            >
              {nextMedication &&
              nextMedicationResident ? (
                <Link
                  to={`/residentes/${nextMedicationResident.id}?tab=medicamentos`}
                  className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {nextMedication.name}
                      </div>
  
                      <div className="mt-1 text-sm text-gray-500">
                        {nextMedication.dosage}{' '}
                        • {nextMedication.route}
                      </div>
                    </div>
  
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      <Clock3 className="size-3.5" />
                      {nextMedication.time}
                    </span>
                  </div>
  
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <span className="text-sm font-semibold text-gray-700">
                      {nextMedicationResident.name}
                    </span>
  
                    <p className="mt-1 text-xs text-gray-400">
                      {nextMedication.frequency}
                    </p>
                  </div>
                </Link>
              ) : (
                <EmptyState message="Nenhum medicamento pendente." />
              )}
            </Section>
  
            <Section
              title="Últimos sinais vitais"
              icon={HeartPulse}
            >
              {recentVital ? (
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getResidentName(
                          residents,
                          recentVital.residentId,
                        )}
                      </p>
  
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          recentVital.date,
                        )}{' '}
                        • {recentVital.time}
                      </p>
                    </div>
  
                    <HeartPulse className="size-5 text-blue-600" />
                  </div>
  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <VitalValue
                      label="Pressão"
                      value={
                        recentVital.pressure ||
                        '—'
                      }
                    />
  
                    <VitalValue
                      label="Temperatura"
                      value={
                        recentVital.temperature
                          ? `${recentVital.temperature} °C`
                          : '—'
                      }
                    />
  
                    <VitalValue
                      label="FC"
                      value={
                        recentVital.heartRate
                          ? `${recentVital.heartRate} bpm`
                          : '—'
                      }
                    />
  
                    <VitalValue
                      label="Saturação"
                      value={
                        recentVital.saturation
                          ? `${recentVital.saturation}%`
                          : '—'
                      }
                    />
                  </div>
                </div>
              ) : (
                <EmptyState message="Nenhum sinal vital registrado." />
              )}
            </Section>
  
            <Section
              title="Última evolução"
              icon={Activity}
            >
              {recentEvolutions[0] ? (
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    {recentEvolutions[0].type}
                  </p>
  
                  <p className="mt-1 text-xs text-gray-400">
                    {getResidentName(
                      residents,
                      recentEvolutions[0]
                        .residentId,
                    )}{' '}
                    •{' '}
                    {formatDate(
                      recentEvolutions[0].date,
                    )}
                  </p>
  
                  <p className="mt-3 line-clamp-3 text-sm leading-5 text-gray-600">
                    {
                      recentEvolutions[0]
                        .description
                    }
                  </p>
  
                  <p className="mt-3 text-xs font-medium text-gray-400">
                    Registrado por{' '}
                    {recentEvolutions[0].author}
                  </p>
                </div>
              ) : (
                <EmptyState message="Nenhuma evolução registrada." />
              )}
            </Section>
          </div>
        </div>
  
        {highRiskResidents.length > 0 && (
          <div className="mt-6">
            <Section
              title="Atenção — risco de queda"
              icon={AlertTriangle}
              action={
                <span className="text-xs font-semibold text-red-600">
                  {highRiskResidents.length}{' '}
                  residente(s)
                </span>
              }
            >
              <div className="space-y-1">
                {highRiskResidents
                  .slice(0, 4)
                  .map((resident) => (
                    <ResidentRow
                      key={resident.id}
                      resident={resident}
                    />
                  ))}
              </div>
            </Section>
          </div>
        )}
      </AppShell>
    )
  }
  
  interface SummaryCardProps {
    icon: typeof Users
    label: string
    value: string | number
    description: string
    tone?:
      | 'default'
      | 'warning'
      | 'blue'
      | 'danger'
  }
  
  function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
    tone = 'default',
  }: SummaryCardProps) {
    const iconStyles = {
      default:
        'bg-blue-50 text-blue-600',
      warning:
        'bg-yellow-50 text-yellow-600',
      blue:
        'bg-blue-50 text-blue-600',
      danger:
        'bg-red-50 text-red-600',
    }
  
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 items-center justify-center rounded-lg ${iconStyles[tone]}`}
          >
            <Icon className="size-5" />
          </span>
  
          <span className="text-sm font-semibold text-gray-500">
            {label}
          </span>
        </div>
  
        <div className="mt-4 text-2xl font-bold text-gray-950">
          {value}
        </div>
  
        <div className="mt-1 text-sm text-gray-500">
          {description}
        </div>
      </div>
    )
  }
  
  function SeverityBadge({
    severity,
  }: {
    severity: 'Baixa' | 'Média' | 'Alta'
  }) {
    const styles = {
      Baixa:
        'bg-green-50 text-green-700',
      Média:
        'bg-yellow-50 text-yellow-700',
      Alta:
        'bg-red-50 text-red-700',
    }
  
    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[severity]}`}
      >
        {severity}
      </span>
    )
  }
  
  function VitalValue({
    label,
    value,
  }: {
    label: string
    value: string
  }) {
    return (
      <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
  
        <p className="mt-1 font-semibold text-gray-800">
          {value}
        </p>
      </div>
    )
  }
  
  function EmptyState({
    message,
  }: {
    message: string
  }) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
    )
  }
  
  function getResidentName(
    residents: {
      id: string
      name: string
    }[],
    residentId: string,
  ) {
    return (
      residents.find(
        (resident) =>
          resident.id === residentId,
      )?.name ?? 'Residente não encontrado'
    )
  }
  
  function formatDate(value: string) {
    if (!value) {
      return 'Não informado'
    }
  
    const parts = value.split('-')
  
    if (parts.length !== 3) {
      return value
    }
  
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }