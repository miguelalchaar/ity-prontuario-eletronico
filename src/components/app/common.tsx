import {
    AlertTriangle,
    ChevronRight,
    Search,
    Trash2,
  } from 'lucide-react'
  import type {
    ElementType,
    ReactNode,
  } from 'react'
  import { Link } from 'react-router-dom'
  
  import { cn } from '../../lib/utils'
  import type {
    FallRisk,
    Resident,
  } from '../../types'
  import { Input } from '../ui/input'
  
  interface PageTitleProps {
    title: string
    description: string
    action?: ReactNode
  }
  
  export function PageTitle({
    title,
    description,
    action,
  }: PageTitleProps) {
    return (
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            {title}
          </h1>
  
          <p className="mt-1 text-gray-500">
            {description}
          </p>
        </div>
  
        {action}
      </div>
    )
  }
  
  interface SectionProps {
    title: string
    icon?: ElementType
    action?: ReactNode
    children: ReactNode
    className?: string
  }
  
  export function Section({
    title,
    icon: Icon,
    action,
    children,
    className,
  }: SectionProps) {
    return (
      <section
        className={cn(
          'rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            {Icon && (
              <Icon className="size-5 text-blue-600" />
            )}
  
            {title}
          </h2>
  
          {action}
        </div>
  
        {children}
      </section>
    )
  }
  
  interface SearchBoxProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  
  export function SearchBox({
    value,
    onChange,
    placeholder = 'Buscar residente pelo nome',
  }: SearchBoxProps) {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
  
        <Input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-12 bg-white pl-10 text-base"
          placeholder={placeholder}
        />
      </div>
    )
  }
  
  interface RiskBadgeProps {
    risk: FallRisk
  }
  
  export function RiskBadge({
    risk,
  }: RiskBadgeProps) {
    const styles = {
      Alto: 'bg-red-50 text-red-700',
      Médio: 'bg-yellow-50 text-yellow-700',
      Baixo: 'bg-green-50 text-green-700',
    }
  
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
          styles[risk],
        )}
      >
        {risk !== 'Baixo' && (
          <AlertTriangle className="size-3" />
        )}
  
        Risco {risk.toLowerCase()}
      </span>
    )
  }
  
  interface ResidentRowProps {
    resident: Resident
    onDelete?: (resident: Resident) => void
  }
  
  export function ResidentRow({
    resident,
    onDelete,
  }: ResidentRowProps) {
    return (
      <div className="group flex items-center gap-3 border-b border-gray-200 py-4 last:border-0 md:px-2">
        <Link
          to={`/residentes/${resident.id}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <img
            src={resident.photo}
            alt={`Foto de ${resident.name}`}
            className="size-14 shrink-0 rounded-full object-cover ring-2 ring-gray-200"
          />
  
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold group-hover:text-blue-600">
              {resident.name}
            </div>
  
            <div className="mt-1 text-sm text-gray-500">
              {resident.age} anos • Quarto{' '}
              {resident.room} • Leito{' '}
              {resident.bed}
            </div>
          </div>
  
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <span className="text-sm font-semibold">
              {resident.dependency}
            </span>
  
            <RiskBadge
              risk={resident.fallRisk}
            />
          </div>
  
          <ChevronRight className="size-5 shrink-0 text-gray-400" />
        </Link>
  
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(resident)}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Excluir ${resident.name}`}
            title="Excluir residente"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    )
  }
  
  interface InfoGridProps {
    children: ReactNode
  }
  
  export function InfoGrid({
    children,
  }: InfoGridProps) {
    return (
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {children}
      </div>
    )
  }
  
  interface InfoItemProps {
    label: string
    value: string
  }
  
  export function InfoItem({
    label,
    value,
  }: InfoItemProps) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
  
        <p className="mt-1 text-sm font-medium leading-5 text-gray-800">
          {value}
        </p>
      </div>
    )
  }