import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    CalendarDays,
    ClipboardList,
    Download,
    FileText,
    HeartPulse,
    Pencil,
    Pill,
    Trash2,
    UserRound,
  } from 'lucide-react'
  import {
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
  } from 'react'
  import {
    Link,
    useNavigate,
    useParams,
  } from 'react-router-dom'
  
  import { exportResidentReport } from '../../lib/pdf/residentReport'
  import { useAppStore } from '../../lib/store'
  import type {
    Evolution,
    Medication,
    Occurrence,
    OccurrenceSeverity,
    Resident,
    ResidentStatus,
    Vital,
  } from '../../types'
  
  import { Button } from '../ui/button'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '../ui/dialog'
  import { Input } from '../ui/input'
  import { Textarea } from '../ui/textarea'
  
  import { AppShell } from './AppShell'
  import {
    InfoGrid,
    InfoItem,
    RiskBadge,
    Section,
  } from './common'
  
  type Tab =
    | 'resumo'
    | 'medicamentos'
    | 'sinais'
    | 'evolucoes'
    | 'ocorrencias'
  
  export default function ResidentRecord() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
  
    const {
      residents,
      medications,
      vitals,
      evolutions,
      occurrences,
      updateResident,
      removeResident,
      addMedication,
      administer,
      addVital,
      addEvolution,
      addOccurrence,
    } = useAppStore()
  
    const resident = residents.find(
      (item) => item.id === id,
    )
  
    const [activeTab, setActiveTab] =
      useState<Tab>('resumo')
  
    const [
      closureModalOpen,
      setClosureModalOpen,
    ] = useState(false)
  
    const [
      deleteModalOpen,
      setDeleteModalOpen,
    ] = useState(false)
  
    const [
      editModalOpen,
      setEditModalOpen,
    ] = useState(false)
  
    const [
      medicationModalOpen,
      setMedicationModalOpen,
    ] = useState(false)
  
    const [
      vitalModalOpen,
      setVitalModalOpen,
    ] = useState(false)
  
    const [
      evolutionModalOpen,
      setEvolutionModalOpen,
    ] = useState(false)
  
    const [
      occurrenceModalOpen,
      setOccurrenceModalOpen,
    ] = useState(false)
  
    const residentMedications = useMemo(
      () =>
        medications.filter(
          (medication) =>
            medication.residentId === id,
        ),
      [medications, id],
    )
  
    const residentVitals = useMemo(
      () =>
        vitals.filter(
          (vital) =>
            vital.residentId === id,
        ),
      [vitals, id],
    )
  
    const residentEvolutions = useMemo(
      () =>
        evolutions.filter(
          (evolution) =>
            evolution.residentId === id,
        ),
      [evolutions, id],
    )
  
    const residentOccurrences = useMemo(
      () =>
        occurrences.filter(
          (occurrence) =>
            occurrence.residentId === id,
        ),
      [occurrences, id],
    )
  
    

    if (!resident) {
      return (
        <AppShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100">
                <UserRound className="size-7 text-gray-400" />
              </div>
  
              <h1 className="text-xl font-bold text-gray-900">
                Residente não encontrado
              </h1>
  
              <p className="mt-2 text-sm text-gray-500">
                O prontuário solicitado não existe
                ou foi removido.
              </p>
  
              <Button
                asChild
                className="mt-5"
              >
                <Link to="/residentes">
                  <ArrowLeft />
                  Voltar para residentes
                </Link>
              </Button>
            </div>
          </div>
        </AppShell>
      )
    }

    const currentResident: Resident = resident
    
    const isActive =
      resident.status === 'Ativo'
  
      function handleCloseResident(
        status: ResidentStatus,
        reason: string,
      ) {
        updateResident(currentResident.id, {
          status,
          closureDate: getCurrentDate(),
          closureReason: reason,
        })
      
        setClosureModalOpen(false)
      }
  
      function handleDeleteResident() {
        removeResident(currentResident.id)
        setDeleteModalOpen(false)
        navigate('/residentes')
      }
  
      function handleExportPdf() {
        exportResidentReport({
          resident: currentResident,
          medications: residentMedications,
          vitals: residentVitals,
          evolutions: residentEvolutions,
          occurrences: residentOccurrences,
        })
      }
  
    return (
      <AppShell>
        <div className="mb-6">
          <Link
            to="/residentes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="size-4" />
            Voltar para residentes
          </Link>
        </div>
  
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <img
                src={resident.photo}
                alt={`Foto de ${resident.name}`}
                className="size-20 shrink-0 rounded-full object-cover ring-4 ring-gray-100"
              />
  
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-950 md:text-3xl">
                    {resident.name}
                  </h1>
  
                  <StatusBadge
                    status={resident.status}
                  />
                </div>
  
                <p className="mt-1 text-sm text-gray-500">
                  {resident.age} anos • Quarto{' '}
                  {resident.room} • Leito{' '}
                  {resident.bed}
                </p>
  
                <div className="mt-3 flex flex-wrap gap-2">
                  <RiskBadge
                    risk={resident.fallRisk}
                  />
  
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                    {resident.dependency}
                  </span>
  
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                    {resident.accommodation}
                  </span>
                </div>
              </div>
            </div>
  
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setEditModalOpen(true)
                }
              >
                <Pencil />
                Editar residente
              </Button>
  
              <Button
                variant="outline"
                onClick={handleExportPdf}
              >
                <Download />
                Exportar PDF
              </Button>
  
              {isActive && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setClosureModalOpen(true)
                  }
                >
                  <FileText />
                  Encerrar prontuário
                </Button>
              )}
            </div>
          </div>
        </div>
  
        <div className="mb-6 overflow-x-auto border-b border-gray-200">
          <div className="flex min-w-max gap-1">
            <TabButton
              active={activeTab === 'resumo'}
              onClick={() =>
                setActiveTab('resumo')
              }
              icon={FileText}
            >
              Resumo
            </TabButton>
  
            <TabButton
              active={
                activeTab === 'medicamentos'
              }
              onClick={() =>
                setActiveTab('medicamentos')
              }
              icon={Pill}
            >
              Medicamentos
            </TabButton>
  
            <TabButton
              active={activeTab === 'sinais'}
              onClick={() =>
                setActiveTab('sinais')
              }
              icon={HeartPulse}
            >
              Sinais vitais
            </TabButton>
  
            <TabButton
              active={
                activeTab === 'evolucoes'
              }
              onClick={() =>
                setActiveTab('evolucoes')
              }
              icon={Activity}
            >
              Evoluções
            </TabButton>
  
            <TabButton
              active={
                activeTab === 'ocorrencias'
              }
              onClick={() =>
                setActiveTab('ocorrencias')
              }
              icon={AlertTriangle}
            >
              Ocorrências
            </TabButton>
          </div>
        </div>
  
        {activeTab === 'resumo' && (
          <Summary resident={resident} />
        )}
  
        {activeTab === 'medicamentos' && (
          <MedicationTab
            medications={residentMedications}
            canEdit={isActive}
            onAdd={() =>
              setMedicationModalOpen(true)
            }
            onAdminister={administer}
          />
        )}
  
        {activeTab === 'sinais' && (
          <VitalsTab
            vitals={residentVitals}
            canEdit={isActive}
            onAdd={() =>
              setVitalModalOpen(true)
            }
          />
        )}
  
        {activeTab === 'evolucoes' && (
          <EvolutionsTab
            evolutions={residentEvolutions}
            canEdit={isActive}
            onAdd={() =>
              setEvolutionModalOpen(true)
            }
          />
        )}
  
        {activeTab === 'ocorrencias' && (
          <OccurrencesTab
            occurrences={residentOccurrences}
            canEdit={isActive}
            onAdd={() =>
              setOccurrenceModalOpen(true)
            }
          />
        )}
  
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
              <ClipboardList className="size-5 text-blue-600" />
              Ações do prontuário
            </h2>
  
            <p className="mt-1 text-sm text-gray-500">
              Consulte, exporte ou encerre o
              prontuário sem perder o histórico
              do residente.
            </p>
          </div>
  
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={handleExportPdf}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Download className="size-5" />
              </span>
  
              <span>
                <span className="block font-semibold text-gray-900">
                  Exportar relatório em PDF
                </span>
  
                <span className="mt-0.5 block text-sm text-gray-500">
                  Gera um relatório completo do
                  prontuário.
                </span>
              </span>
            </button>
  
            {isActive && (
              <button
                type="button"
                onClick={() =>
                  setClosureModalOpen(true)
                }
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-amber-200 hover:bg-amber-50/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <FileText className="size-5" />
                </span>
  
                <span>
                  <span className="block font-semibold text-gray-900">
                    Encerrar prontuário
                  </span>
  
                  <span className="mt-0.5 block text-sm text-gray-500">
                    Mantém o histórico e encerra
                    o registro.
                  </span>
                </span>
              </button>
            )}
          </div>
  
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex flex-col gap-4 rounded-lg border border-red-100 bg-red-50/50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-red-800">
                  Exclusão permanente
                </p>
  
                <p className="mt-1 max-w-2xl text-sm leading-5 text-red-700/80">
                  Remove permanentemente o
                  residente e todos os registros
                  vinculados ao prontuário. Esta
                  ação não pode ser desfeita.
                </p>
              </div>
  
              <Button
                variant="destructive"
                onClick={() =>
                  setDeleteModalOpen(true)
                }
              >
                <Trash2 />
                Excluir residente
              </Button>
            </div>
          </div>
        </div>
  
        <EditResidentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          resident={resident}
          onSubmit={(updates) => {
            updateResident(
              resident.id,
              updates,
            )
  
            setEditModalOpen(false)
          }}
        />
  
        <ClosureModal
          open={closureModalOpen}
          onOpenChange={setClosureModalOpen}
          onSubmit={handleCloseResident}
        />
  
        <DeleteResidentModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          resident={resident}
          onConfirm={handleDeleteResident}
        />
  
        <MedicationModal
          open={medicationModalOpen}
          onOpenChange={setMedicationModalOpen}
          residentId={resident.id}
          onSubmit={(medication) => {
            addMedication(medication)
            setMedicationModalOpen(false)
          }}
        />
  
        <VitalModal
          open={vitalModalOpen}
          onOpenChange={setVitalModalOpen}
          residentId={resident.id}
          onSubmit={(vital) => {
            addVital(vital)
            setVitalModalOpen(false)
          }}
        />
  
        <EvolutionModal
          open={evolutionModalOpen}
          onOpenChange={setEvolutionModalOpen}
          residentId={resident.id}
          onSubmit={(evolution) => {
            addEvolution(evolution)
            setEvolutionModalOpen(false)
          }}
        />
  
        <OccurrenceModal
          open={occurrenceModalOpen}
          onOpenChange={setOccurrenceModalOpen}
          residentId={resident.id}
          onSubmit={(occurrence) => {
            addOccurrence(occurrence)
            setOccurrenceModalOpen(false)
          }}
        />
      </AppShell>
    )
  }
  
  function Summary({
    resident,
  }: {
    resident: Resident
  }) {
    return (
      <div className="space-y-5">
        <Section
          title="Dados pessoais"
          icon={UserRound}
        >
          <InfoGrid>
            <InfoItem
              label="Nome completo"
              value={resident.name}
            />
  
            <InfoItem
              label="Data de nascimento"
              value={formatDate(
                resident.birthDate,
              )}
            />
  
            <InfoItem
              label="CPF"
              value={resident.cpf}
            />
  
            <InfoItem
              label="Cartão SUS"
              value={resident.sus}
            />
  
            <InfoItem
              label="Plano de saúde"
              value={resident.healthPlan}
            />
  
            <InfoItem
              label="Data de admissão"
              value={formatDate(
                resident.admission,
              )}
            />
          </InfoGrid>
        </Section>
  
        <Section
          title="Acomodação e cuidados"
          icon={ClipboardList}
        >
          <InfoGrid>
            <InfoItem
              label="Quarto"
              value={resident.room}
            />
  
            <InfoItem
              label="Leito"
              value={resident.bed}
            />
  
            <InfoItem
              label="Acomodação"
              value={resident.accommodation}
            />
  
            <InfoItem
              label="Grau de dependência"
              value={resident.dependency}
            />
  
            <InfoItem
              label="Risco de queda"
              value={resident.fallRisk}
            />
  
            <InfoItem
              label="Dieta"
              value={resident.diet}
            />
  
            <InfoItem
              label="Mobilidade"
              value={resident.mobility}
            />
  
            <InfoItem
              label="Observações de cuidado"
              value={resident.careNotes}
            />
          </InfoGrid>
        </Section>
  
        <Section
          title="Diagnósticos e alergias"
          icon={HeartPulse}
        >
          <InfoGrid>
            <InfoItem
              label="Diagnósticos"
              value={
                resident.diagnoses.length > 0
                  ? resident.diagnoses.join(', ')
                  : 'Nenhum informado'
              }
            />
  
            <InfoItem
              label="Alergias"
              value={
                resident.allergies.length > 0
                  ? resident.allergies.join(', ')
                  : 'Nenhuma informada'
              }
            />
          </InfoGrid>
        </Section>
  
        <Section
          title="Responsável"
          icon={UserRound}
        >
          <InfoGrid>
            <InfoItem
              label="Nome"
              value={resident.guardian.name}
            />
  
            <InfoItem
              label="Parentesco"
              value={resident.guardian.relation}
            />
  
            <InfoItem
              label="Telefone"
              value={resident.guardian.phone}
            />
  
            <InfoItem
              label="Telefone de emergência"
              value={
                resident.guardian.emergencyPhone
              }
            />
          </InfoGrid>
        </Section>
      </div>
    )
  }
  
  function MedicationTab({
    medications,
    canEdit,
    onAdd,
    onAdminister,
  }: {
    medications: Medication[]
    canEdit: boolean
    onAdd: () => void
    onAdminister: (id: string) => void
  }) {
    return (
      <Section
        title="Medicamentos"
        icon={Pill}
        action={
          canEdit ? (
            <Button
              size="sm"
              onClick={onAdd}
            >
              <Pill />
              Adicionar medicamento
            </Button>
          ) : undefined
        }
      >
        {medications.length === 0 ? (
          <EmptyState message="Nenhum medicamento registrado." />
        ) : (
          <div className="space-y-3">
            {medications.map(
              (medication) => (
                <div
                  key={medication.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {medication.name}
                      </h3>
  
                      <p className="mt-1 text-sm text-gray-500">
                        {medication.dosage} •{' '}
                        {medication.route}
                      </p>
  
                      <p className="mt-1 text-sm text-gray-500">
                        {medication.time} •{' '}
                        {medication.frequency}
                      </p>
                    </div>
  
                    <div className="flex items-center gap-2">
                      <MedicationStatusBadge
                        status={medication.status}
                      />
  
                      {canEdit &&
                        medication.status !==
                          'Administrado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onAdminister(
                                medication.id,
                              )
                            }
                          >
                            Administrar
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </Section>
    )
  }
  
  function VitalsTab({
    vitals,
    canEdit,
    onAdd,
  }: {
    vitals: Vital[]
    canEdit: boolean
    onAdd: () => void
  }) {
    return (
      <Section
        title="Sinais vitais"
        icon={HeartPulse}
        action={
          canEdit ? (
            <Button
              size="sm"
              onClick={onAdd}
            >
              <HeartPulse />
              Registrar sinais
            </Button>
          ) : undefined
        }
      >
        {vitals.length === 0 ? (
          <EmptyState message="Nenhum sinal vital registrado." />
        ) : (
          <div className="space-y-3">
            {vitals.map((vital) => (
              <div
                key={vital.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CalendarDays className="size-4 text-blue-600" />
                  {formatDate(vital.date)} •{' '}
                  {vital.time}
                </div>
  
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem
                    label="Peso"
                    value={
                      vital.weight
                        ? `${vital.weight} kg`
                        : 'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Altura"
                    value={
                      vital.height
                        ? `${vital.height} cm`
                        : 'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Pressão"
                    value={
                      vital.pressure ||
                      'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Temperatura"
                    value={
                      vital.temperature
                        ? `${vital.temperature} °C`
                        : 'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Frequência cardíaca"
                    value={
                      vital.heartRate
                        ? `${vital.heartRate} bpm`
                        : 'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Saturação"
                    value={
                      vital.saturation
                        ? `${vital.saturation}%`
                        : 'Não informado'
                    }
                  />
  
                  <InfoItem
                    label="Glicemia"
                    value={
                      vital.glucose
                        ? `${vital.glucose} mg/dL`
                        : 'Não informado'
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    )
  }
  
  function EvolutionsTab({
    evolutions,
    canEdit,
    onAdd,
  }: {
    evolutions: Evolution[]
    canEdit: boolean
    onAdd: () => void
  }) {
    return (
      <Section
        title="Evoluções"
        icon={Activity}
        action={
          canEdit ? (
            <Button
              size="sm"
              onClick={onAdd}
            >
              <Activity />
              Nova evolução
            </Button>
          ) : undefined
        }
      >
        {evolutions.length === 0 ? (
          <EmptyState message="Nenhuma evolução registrada." />
        ) : (
          <div className="space-y-3">
            {evolutions.map(
              (evolution) => (
                <div
                  key={evolution.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {evolution.type}
                      </h3>
  
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(
                          evolution.date,
                        )}{' '}
                        • {evolution.time}
                      </p>
                    </div>
  
                    <span className="text-sm text-gray-400">
                      {evolution.author}
                    </span>
                  </div>
  
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {evolution.description}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </Section>
    )
  }
  
  function OccurrencesTab({
    occurrences,
    canEdit,
    onAdd,
  }: {
    occurrences: Occurrence[]
    canEdit: boolean
    onAdd: () => void
  }) {
    return (
      <Section
        title="Ocorrências"
        icon={AlertTriangle}
        action={
          canEdit ? (
            <Button
              size="sm"
              onClick={onAdd}
            >
              <AlertTriangle />
              Registrar ocorrência
            </Button>
          ) : undefined
        }
      >
        {occurrences.length === 0 ? (
          <EmptyState message="Nenhuma ocorrência registrada." />
        ) : (
          <div className="space-y-3">
            {occurrences.map(
              (occurrence) => (
                <div
                  key={occurrence.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {occurrence.type}
                      </h3>
  
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(
                          occurrence.date,
                        )}{' '}
                        • {occurrence.time}
                      </p>
                    </div>
  
                    <span
                      className={getSeverityClass(
                        occurrence.severity,
                      )}
                    >
                      {occurrence.severity}
                    </span>
                  </div>
  
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {occurrence.description}
                  </p>
  
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Conduta
                    </p>
  
                    <p className="mt-1 text-sm text-gray-700">
                      {occurrence.action}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </Section>
    )
  }
  
  function EditResidentModal({
    open,
    onOpenChange,
    resident,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    resident: Resident
    onSubmit: (
      updates: Partial<Resident>,
    ) => void
  }) {
    const fileInputRef =
      useRef<HTMLInputElement>(null)
  
    const [name, setName] = useState(
      resident.name,
    )
  
    const [birthDate, setBirthDate] =
      useState(resident.birthDate)
  
    const [room, setRoom] = useState(
      resident.room,
    )
  
    const [bed, setBed] = useState(
      resident.bed,
    )
  
    const [
      accommodation,
      setAccommodation,
    ] = useState(resident.accommodation)
  
    const [
      dependency,
      setDependency,
    ] = useState(resident.dependency)
  
    const [
      fallRisk,
      setFallRisk,
    ] = useState(resident.fallRisk)
  
    const [diagnoses, setDiagnoses] =
      useState(
        resident.diagnoses.join(', '),
      )
  
    const [allergies, setAllergies] =
      useState(
        resident.allergies.join(', '),
      )
  
    const [diet, setDiet] = useState(
      resident.diet,
    )
  
    const [mobility, setMobility] =
      useState(resident.mobility)
  
    const [careNotes, setCareNotes] =
      useState(resident.careNotes)
  
    const [cpf, setCpf] = useState(
      resident.cpf,
    )
  
    const [sus, setSus] = useState(
      resident.sus,
    )
  
    const [
      healthPlan,
      setHealthPlan,
    ] = useState(resident.healthPlan)
  
    const [
      guardianName,
      setGuardianName,
    ] = useState(resident.guardian.name)
  
    const [
      guardianRelation,
      setGuardianRelation,
    ] = useState(
      resident.guardian.relation,
    )
  
    const [
      guardianPhone,
      setGuardianPhone,
    ] = useState(
      resident.guardian.phone,
    )
  
    const [
      guardianEmergencyPhone,
      setGuardianEmergencyPhone,
    ] = useState(
      resident.guardian.emergencyPhone,
    )
  
    const [photo, setPhoto] =
      useState(resident.photo)
  
    function resetForm() {
      setName(resident.name)
      setBirthDate(resident.birthDate)
      setRoom(resident.room)
      setBed(resident.bed)
      setAccommodation(
        resident.accommodation,
      )
      setDependency(resident.dependency)
      setFallRisk(resident.fallRisk)
  
      setDiagnoses(
        resident.diagnoses.join(', '),
      )
  
      setAllergies(
        resident.allergies.join(', '),
      )
  
      setDiet(resident.diet)
      setMobility(resident.mobility)
      setCareNotes(resident.careNotes)
  
      setCpf(resident.cpf)
      setSus(resident.sus)
      setHealthPlan(
        resident.healthPlan,
      )
  
      setGuardianName(
        resident.guardian.name,
      )
  
      setGuardianRelation(
        resident.guardian.relation,
      )
  
      setGuardianPhone(
        resident.guardian.phone,
      )
  
      setGuardianEmergencyPhone(
        resident.guardian.emergencyPhone,
      )
  
      setPhoto(resident.photo)
    }
  
    function handleOpenChange(
      value: boolean,
    ) {
      if (value) {
        resetForm()
      }
  
      onOpenChange(value)
    }
  
    function handlePhotoChange(
      event: ChangeEvent<HTMLInputElement>,
    ) {
      const file =
        event.target.files?.[0]
  
      if (!file) {
        return
      }
  
      if (
        !file.type.startsWith('image/')
      ) {
        return
      }
  
      if (
        file.size >
        5 * 1024 * 1024
      ) {
        return
      }
  
      const reader = new FileReader()
  
      reader.onload = () => {
        if (
          typeof reader.result ===
          'string'
        ) {
          setPhoto(reader.result)
        }
      }
  
      reader.readAsDataURL(file)
    }
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      onSubmit({
        name: name.trim(),
        birthDate,
        room: room.trim(),
        bed: bed.trim(),
        accommodation,
        dependency,
        fallRisk,
  
        diagnoses: parseList(diagnoses),
        allergies: parseList(allergies),
  
        diet: diet.trim(),
        mobility: mobility.trim(),
        careNotes: careNotes.trim(),
  
        photo,
  
        cpf: cpf.trim(),
        sus: sus.trim(),
        healthPlan: healthPlan.trim(),
  
        guardian: {
          name: guardianName.trim(),
          relation:
            guardianRelation.trim(),
          phone: guardianPhone.trim(),
          emergencyPhone:
            guardianEmergencyPhone.trim(),
        },
      })
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Editar residente
            </DialogTitle>
  
            <DialogDescription>
              Atualize os dados cadastrais e
              assistenciais do residente.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={photo}
                  alt={`Foto de ${name}`}
                  className="size-20 rounded-full object-cover ring-4 ring-white"
                />
  
                <div>
                  <p className="font-semibold text-gray-900">
                    Foto do residente
                  </p>
  
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG ou outro formato de
                    imagem até 5 MB.
                  </p>
  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <Pencil />
                      Alterar foto
                    </Button>
  
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPhoto(
                          createAvatarUrl(name),
                        )
                      }
                    >
                      Remover foto
                    </Button>
                  </div>
  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handlePhotoChange
                    }
                  />
                </div>
              </div>
            </div>
  
            <EditSection title="Dados pessoais">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo">
                  <Input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Data de nascimento">
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(event) =>
                      setBirthDate(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="CPF">
                  <Input
                    value={cpf}
                    onChange={(event) =>
                      setCpf(
                        event.target.value,
                      )
                    }
                  />
                </Field>
  
                <Field label="Cartão SUS">
                  <Input
                    value={sus}
                    onChange={(event) =>
                      setSus(
                        event.target.value,
                      )
                    }
                  />
                </Field>
  
                <Field label="Plano de saúde">
                  <Input
                    value={healthPlan}
                    onChange={(event) =>
                      setHealthPlan(
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </div>
            </EditSection>
  
            <EditSection title="Acomodação e cuidados">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quarto">
                  <Input
                    value={room}
                    onChange={(event) =>
                      setRoom(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Leito">
                  <Input
                    value={bed}
                    onChange={(event) =>
                      setBed(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Acomodação">
                  <select
                    value={accommodation}
                    onChange={(event) =>
                      setAccommodation(
                        event.target
                          .value as Resident['accommodation'],
                      )
                    }
                    className={selectClassName}
                  >
                    <option value="Individual">
                      Individual
                    </option>
  
                    <option value="Compartilhada">
                      Compartilhada
                    </option>
                  </select>
                </Field>
  
                <Field label="Grau de dependência">
                  <select
                    value={dependency}
                    onChange={(event) =>
                      setDependency(
                        event.target
                          .value as Resident['dependency'],
                      )
                    }
                    className={selectClassName}
                  >
                    <option value="Grau I">
                      Grau I
                    </option>
  
                    <option value="Grau II">
                      Grau II
                    </option>
  
                    <option value="Grau III">
                      Grau III
                    </option>
                  </select>
                </Field>
  
                <Field label="Risco de queda">
                  <select
                    value={fallRisk}
                    onChange={(event) =>
                      setFallRisk(
                        event.target
                          .value as Resident['fallRisk'],
                      )
                    }
                    className={selectClassName}
                  >
                    <option value="Baixo">
                      Baixo
                    </option>
  
                    <option value="Médio">
                      Médio
                    </option>
  
                    <option value="Alto">
                      Alto
                    </option>
                  </select>
                </Field>
  
                <Field label="Dieta">
                  <Input
                    value={diet}
                    onChange={(event) =>
                      setDiet(
                        event.target.value,
                      )
                    }
                  />
                </Field>
  
                <Field label="Mobilidade">
                  <Input
                    value={mobility}
                    onChange={(event) =>
                      setMobility(
                        event.target.value,
                      )
                    }
                  />
                </Field>
  
                <Field label="Observações de cuidado">
                  <Textarea
                    value={careNotes}
                    onChange={(event) =>
                      setCareNotes(
                        event.target.value,
                      )
                    }
                    className="min-h-24"
                  />
                </Field>
              </div>
            </EditSection>
  
            <EditSection title="Diagnósticos e alergias">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Diagnósticos">
                  <Textarea
                    value={diagnoses}
                    onChange={(event) =>
                      setDiagnoses(
                        event.target.value,
                      )
                    }
                    placeholder="Separe os diagnósticos por vírgula."
                  />
                </Field>
  
                <Field label="Alergias">
                  <Textarea
                    value={allergies}
                    onChange={(event) =>
                      setAllergies(
                        event.target.value,
                      )
                    }
                    placeholder="Separe as alergias por vírgula."
                  />
                </Field>
              </div>
            </EditSection>
  
            <EditSection title="Responsável">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome">
                  <Input
                    value={guardianName}
                    onChange={(event) =>
                      setGuardianName(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Parentesco">
                  <Input
                    value={guardianRelation}
                    onChange={(event) =>
                      setGuardianRelation(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Telefone">
                  <Input
                    value={guardianPhone}
                    onChange={(event) =>
                      setGuardianPhone(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="Telefone de emergência">
                  <Input
                    value={
                      guardianEmergencyPhone
                    }
                    onChange={(event) =>
                      setGuardianEmergencyPhone(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
              </div>
            </EditSection>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  handleOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function EditSection({
    title,
    children,
  }: {
    title: string
    children: ReactNode
  }) {
    return (
      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-4 text-base font-bold text-gray-900">
          {title}
        </h3>
  
        {children}
      </div>
    )
  }
  
  function ClosureModal({
    open,
    onOpenChange,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (
      status: ResidentStatus,
      reason: string,
    ) => void
  }) {
    const [status, setStatus] =
      useState<ResidentStatus>('Transferido')
  
    const [reason, setReason] =
      useState('')
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      if (!reason.trim()) {
        return
      }
  
      onSubmit(
        status,
        reason.trim(),
      )
  
      setReason('')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Encerrar prontuário
            </DialogTitle>
  
            <DialogDescription>
              O histórico continuará disponível
              após o encerramento.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Field label="Situação">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as ResidentStatus,
                  )
                }
                className={selectClassName}
              >
                <option value="Transferido">
                  Transferido
                </option>
  
                <option value="Desligado">
                  Desligado
                </option>
  
                <option value="Falecido">
                  Falecido
                </option>
              </select>
            </Field>
  
            <Field label="Motivo">
              <Textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Informe o motivo do encerramento..."
                required
              />
            </Field>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Encerrar prontuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function DeleteResidentModal({
    open,
    onOpenChange,
    resident,
    onConfirm,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    resident: Resident
    onConfirm: () => void
  }) {
    const [confirmation, setConfirmation] =
      useState('')
  
    const canDelete =
      confirmation.trim().toLowerCase() ===
      resident.name.trim().toLowerCase()
  
    function handleOpenChange(
      value: boolean,
    ) {
      onOpenChange(value)
  
      if (!value) {
        setConfirmation('')
      }
    }
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      if (!canDelete) {
        return
      }
  
      onConfirm()
      setConfirmation('')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="rounded-2xl border border-red-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="size-5" />
              Excluir residente
            </DialogTitle>
  
            <DialogDescription>
              Esta ação removerá permanentemente
              o residente e todos os registros
              vinculados ao prontuário.
            </DialogDescription>
          </DialogHeader>
  
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" />
  
              <div>
                <p className="font-semibold text-red-800">
                  Esta ação não pode ser desfeita.
                </p>
  
                <p className="mt-1 text-sm leading-5 text-red-700/80">
                  Medicamentos, sinais vitais,
                  evoluções e ocorrências
                  vinculados também serão removidos.
                </p>
              </div>
            </div>
          </div>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Field label="Digite o nome do residente para confirmar">
              <Input
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(
                    event.target.value,
                  )
                }
                placeholder={resident.name}
                autoComplete="off"
              />
            </Field>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  handleOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button
                type="submit"
                variant="destructive"
                disabled={!canDelete}
              >
                <Trash2 />
                Excluir permanentemente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function MedicationModal({
    open,
    onOpenChange,
    residentId,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    residentId: string
    onSubmit: (
      medication: Medication,
    ) => void
  }) {
    const [name, setName] = useState('')
    const [dosage, setDosage] = useState('')
    const [route, setRoute] = useState('')
    const [time, setTime] = useState('')
    const [frequency, setFrequency] =
      useState('')
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      onSubmit({
        id: crypto.randomUUID(),
        residentId,
        name: name.trim(),
        dosage: dosage.trim(),
        route: route.trim(),
        time,
        frequency: frequency.trim(),
        status: 'Programado',
      })
  
      setName('')
      setDosage('')
      setRoute('')
      setTime('')
      setFrequency('')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Adicionar medicamento
            </DialogTitle>
  
            <DialogDescription>
              Registre a prescrição e o horário de
              administração.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Field label="Medicamento">
              <Input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ex.: Losartana"
                required
              />
            </Field>
  
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dosagem">
                <Input
                  value={dosage}
                  onChange={(event) =>
                    setDosage(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 50 mg"
                  required
                />
              </Field>
  
              <Field label="Via">
                <Input
                  value={route}
                  onChange={(event) =>
                    setRoute(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Oral"
                  required
                />
              </Field>
  
              <Field label="Horário">
                <Input
                  type="time"
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                  required
                />
              </Field>
  
              <Field label="Frequência">
                <Input
                  value={frequency}
                  onChange={(event) =>
                    setFrequency(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 1x ao dia"
                  required
                />
              </Field>
            </div>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Salvar medicamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function VitalModal({
    open,
    onOpenChange,
    residentId,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    residentId: string
    onSubmit: (vital: Vital) => void
  }) {
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [pressure, setPressure] =
      useState('')
    const [temperature, setTemperature] =
      useState('')
    const [heartRate, setHeartRate] =
      useState('')
    const [saturation, setSaturation] =
      useState('')
    const [glucose, setGlucose] = useState('')
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      const now = new Date()
  
      onSubmit({
        id: crypto.randomUUID(),
        residentId,
        date: getCurrentDate(),
        time: now.toTimeString().slice(0, 5),
        weight: weight.trim(),
        height: height.trim(),
        pressure: pressure.trim(),
        temperature: temperature.trim(),
        heartRate: heartRate.trim(),
        saturation: saturation.trim(),
        glucose: glucose.trim(),
      })
  
      setWeight('')
      setHeight('')
      setPressure('')
      setTemperature('')
      setHeartRate('')
      setSaturation('')
      setGlucose('')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Registrar sinais vitais
            </DialogTitle>
  
            <DialogDescription>
              Os dados serão registrados com a
              data e o horário atuais.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Peso">
                <Input
                  value={weight}
                  onChange={(event) =>
                    setWeight(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 72,5"
                />
              </Field>
  
              <Field label="Altura">
                <Input
                  value={height}
                  onChange={(event) =>
                    setHeight(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 165"
                />
              </Field>
  
              <Field label="Pressão arterial">
                <Input
                  value={pressure}
                  onChange={(event) =>
                    setPressure(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 120/80"
                />
              </Field>
  
              <Field label="Temperatura">
                <Input
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 36,5"
                />
              </Field>
  
              <Field label="Frequência cardíaca">
                <Input
                  value={heartRate}
                  onChange={(event) =>
                    setHeartRate(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 72"
                />
              </Field>
  
              <Field label="Saturação">
                <Input
                  value={saturation}
                  onChange={(event) =>
                    setSaturation(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 98"
                />
              </Field>
  
              <Field label="Glicemia">
                <Input
                  value={glucose}
                  onChange={(event) =>
                    setGlucose(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 95"
                />
              </Field>
            </div>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Salvar sinais vitais
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function EvolutionModal({
    open,
    onOpenChange,
    residentId,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    residentId: string
    onSubmit: (
      evolution: Evolution,
    ) => void
  }) {
    const [type, setType] =
      useState('Evolução')
  
    const [description, setDescription] =
      useState('')
  
    const [author, setAuthor] =
      useState('Equipe de cuidados')
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      const now = new Date()
  
      onSubmit({
        id: crypto.randomUUID(),
        residentId,
        date: getCurrentDate(),
        time: now.toTimeString().slice(0, 5),
        type: type.trim(),
        description: description.trim(),
        author: author.trim(),
      })
  
      setType('Evolução')
      setDescription('')
      setAuthor('Equipe de cuidados')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Nova evolução
            </DialogTitle>
  
            <DialogDescription>
              Registre uma observação ou evolução
              do residente.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Field label="Tipo">
              <Input
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                placeholder="Ex.: Evolução clínica"
                required
              />
            </Field>
  
            <Field label="Descrição">
              <Textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Descreva a evolução..."
                required
              />
            </Field>
  
            <Field label="Responsável pelo registro">
              <Input
                value={author}
                onChange={(event) =>
                  setAuthor(event.target.value)
                }
                required
              />
            </Field>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Salvar evolução
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function OccurrenceModal({
    open,
    onOpenChange,
    residentId,
    onSubmit,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    residentId: string
    onSubmit: (
      occurrence: Occurrence,
    ) => void
  }) {
    const [type, setType] =
      useState('Queda')
  
    const [severity, setSeverity] =
      useState<OccurrenceSeverity>('Média')
  
    const [description, setDescription] =
      useState('')
  
    const [action, setAction] =
      useState('')
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      const now = new Date()
  
      onSubmit({
        id: crypto.randomUUID(),
        residentId,
        date: getCurrentDate(),
        time: now.toTimeString().slice(0, 5),
        type: type.trim(),
        severity,
        description: description.trim(),
        action: action.trim(),
      })
  
      setType('Queda')
      setSeverity('Média')
      setDescription('')
      setAction('')
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Registrar ocorrência
            </DialogTitle>
  
            <DialogDescription>
              Registre o ocorrido e a conduta
              adotada.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo">
                <Input
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                  placeholder="Ex.: Queda"
                  required
                />
              </Field>
  
              <Field label="Gravidade">
                <select
                  value={severity}
                  onChange={(event) =>
                    setSeverity(
                      event.target
                        .value as OccurrenceSeverity,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="Baixa">
                    Baixa
                  </option>
  
                  <option value="Média">
                    Média
                  </option>
  
                  <option value="Alta">
                    Alta
                  </option>
                </select>
              </Field>
            </div>
  
            <Field label="Descrição">
              <Textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Descreva o ocorrido..."
                required
              />
            </Field>
  
            <Field label="Conduta adotada">
              <Textarea
                value={action}
                onChange={(event) =>
                  setAction(event.target.value)
                }
                placeholder="Informe as providências tomadas..."
                required
              />
            </Field>
  
            <DialogFooter className="gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancelar
              </Button>
  
              <Button type="submit">
                Salvar ocorrência
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  function Field({
    label,
    children,
  }: {
    label: string
    children: ReactNode
  }) {
    return (
      <label className="block space-y-1.5">
        <span className="block text-sm font-semibold text-gray-700">
          {label}
        </span>
  
        {children}
      </label>
    )
  }
  
  function TabButton({
    active,
    onClick,
    icon: Icon,
    children,
  }: {
    active: boolean
    onClick: () => void
    icon: typeof FileText
    children: ReactNode
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors ${
          active
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-900'
        }`}
      >
        <Icon className="size-4" />
        {children}
      </button>
    )
  }
  
  function StatusBadge({
    status,
  }: {
    status: ResidentStatus
  }) {
    const styles: Record<
      ResidentStatus,
      string
    > = {
      Ativo:
        'bg-green-50 text-green-700',
      Transferido:
        'bg-blue-50 text-blue-700',
      Desligado:
        'bg-gray-100 text-gray-700',
      Falecido:
        'bg-gray-100 text-gray-700',
    }
  
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
      >
        {status}
      </span>
    )
  }
  
  function MedicationStatusBadge({
    status,
  }: {
    status: Medication['status']
  }) {
    const styles: Record<
      Medication['status'],
      string
    > = {
      Administrado:
        'bg-green-50 text-green-700',
      Pendente:
        'bg-yellow-50 text-yellow-700',
      Programado:
        'bg-blue-50 text-blue-700',
    }
  
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
      >
        {status}
      </span>
    )
  }
  
  function EmptyState({
    message,
  }: {
    message: string
  }) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center">
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
    )
  }
  
  function getSeverityClass(
    severity: OccurrenceSeverity,
  ) {
    const styles: Record<
      OccurrenceSeverity,
      string
    > = {
      Baixa:
        'inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700',
  
      Média:
        'inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-700',
  
      Alta:
        'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700',
    }
  
    return styles[severity]
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
  
  function getCurrentDate() {
    const date = new Date()
  
    const year = date.getFullYear()
  
    const month = String(
      date.getMonth() + 1,
    ).padStart(2, '0')
  
    const day = String(
      date.getDate(),
    ).padStart(2, '0')
  
    return `${year}-${month}-${day}`
  }
  
  function parseList(value: string) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  
  function createAvatarUrl(name: string) {
    const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join('')
  
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials || 'R',
    )}&background=e5e7eb&color=374151&size=256`
  }
  
  const selectClassName =
    'h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'