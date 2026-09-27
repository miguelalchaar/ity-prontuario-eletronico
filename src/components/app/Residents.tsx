import {
    AlertTriangle,
    UserRoundPlus,
    Users,
  } from 'lucide-react'
  import {
    useMemo,
    useState,
    type FormEvent,
  } from 'react'
  import { Link } from 'react-router-dom'
  
  import { useAppStore } from '../../lib/store'
  import type {
    Resident,
    ResidentStatus,
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
  
  import { AppShell } from './AppShell'
  import {
    PageTitle,
    ResidentRow,
    SearchBox,
    Section,
  } from './common'
  
  export default function Residents() {
    const {
      residents,
      removeResident,
    } = useAppStore()
  
    const [query, setQuery] =
      useState('')
  
    const [risk, setRisk] =
      useState('Todos')
  
    const [status, setStatus] =
      useState<ResidentStatus | 'Todos'>(
        'Ativo',
      )
  
    const [
      deleteModalOpen,
      setDeleteModalOpen,
    ] = useState(false)
  
    const [
      residentToDelete,
      setResidentToDelete,
    ] = useState<Resident | null>(
      null,
    )
  
    const filteredResidents =
      useMemo(() => {
        return residents.filter(
          (resident) => {
            const matchesName =
              resident.name
                .toLowerCase()
                .includes(
                  query.toLowerCase(),
                )
  
            const matchesRisk =
              risk === 'Todos' ||
              resident.fallRisk === risk
  
            const matchesStatus =
              status === 'Todos' ||
              resident.status === status
  
            return (
              matchesName &&
              matchesRisk &&
              matchesStatus
            )
          },
        )
      }, [
        residents,
        query,
        risk,
        status,
      ])
  
    const activeCount =
      residents.filter(
        (resident) =>
          resident.status === 'Ativo',
      ).length
  
    const closedCount =
      residents.filter(
        (resident) =>
          resident.status !== 'Ativo',
      ).length
  
    function handleDeleteClick(
      resident: Resident,
    ) {
      setResidentToDelete(resident)
      setDeleteModalOpen(true)
    }
  
    function handleDeleteConfirm() {
      if (!residentToDelete) {
        return
      }
  
      removeResident(
        residentToDelete.id,
      )
  
      setResidentToDelete(null)
      setDeleteModalOpen(false)
    }
  
    function handleDeleteModalChange(
      open: boolean,
    ) {
      setDeleteModalOpen(open)
  
      if (!open) {
        setResidentToDelete(null)
      }
    }
  
    return (
      <AppShell>
        <PageTitle
          title="Residentes"
          description="Encontre uma pessoa e abra o prontuário."
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
  
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_200px_180px]">
          <SearchBox
            value={query}
            onChange={setQuery}
          />
  
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | ResidentStatus
                  | 'Todos',
              )
            }
            className="h-12 rounded-lg border border-gray-200 bg-white px-3 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="Ativo">
              Ativos
            </option>
  
            <option value="Todos">
              Todos os registros
            </option>
  
            <option value="Transferido">
              Transferidos
            </option>
  
            <option value="Desligado">
              Desligados
            </option>
  
            <option value="Falecido">
              Falecidos
            </option>
          </select>
  
          <select
            value={risk}
            onChange={(event) =>
              setRisk(event.target.value)
            }
            className="h-12 rounded-lg border border-gray-200 bg-white px-3 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="Todos">
              Todos os riscos
            </option>
  
            <option value="Baixo">
              Risco baixo
            </option>
  
            <option value="Médio">
              Risco médio
            </option>
  
            <option value="Alto">
              Risco alto
            </option>
          </select>
        </div>
  
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Residentes ativos
            </p>
  
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {activeCount}
            </p>
          </div>
  
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Registros encerrados
            </p>
  
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {closedCount}
            </p>
          </div>
        </div>
  
        <Section
          title={`${filteredResidents.length} registros encontrados`}
          icon={Users}
        >
          {filteredResidents.length >
          0 ? (
            filteredResidents.map(
              (resident) => (
                <ResidentRow
                  key={resident.id}
                  resident={resident}
                  onDelete={
                    handleDeleteClick
                  }
                />
              ),
            )
          ) : (
            <div className="py-12 text-center text-gray-500">
              Nenhum residente encontrado.
              <br />
              Tente alterar os filtros.
            </div>
          )}
        </Section>
  
        <DeleteResidentModal
          open={deleteModalOpen}
          onOpenChange={
            handleDeleteModalChange
          }
          resident={residentToDelete}
          onConfirm={handleDeleteConfirm}
        />
      </AppShell>
    )
  }
  
  interface DeleteResidentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    resident: Resident | null
    onConfirm: () => void
  }
  
  function DeleteResidentModal({
    open,
    onOpenChange,
    resident,
    onConfirm,
  }: DeleteResidentModalProps) {
    const [confirmation, setConfirmation] =
      useState('')
  
    if (!resident) {
      return null
    }
  
    const canDelete =
      confirmation.trim().toLowerCase() ===
      resident.name.trim().toLowerCase()
  
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
        onOpenChange={onOpenChange}
      >
        <DialogContent className="rounded-2xl border border-red-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="size-5" />
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
                  O residente, medicamentos,
                  sinais vitais, evoluções e
                  ocorrências vinculados serão
                  removidos.
                </p>
              </div>
            </div>
          </div>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <label className="block space-y-1.5">
              <span className="block text-sm font-semibold text-gray-700">
                Digite o nome do residente para
                confirmar
              </span>
  
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
            </label>
  
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
  
              <Button
                type="submit"
                variant="destructive"
                disabled={!canDelete}
              >
                <AlertTriangle />
                Excluir permanentemente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }