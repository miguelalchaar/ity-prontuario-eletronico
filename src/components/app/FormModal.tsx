import type {
    FormEvent,
    ReactNode,
  } from 'react'
  
  import { Button } from '../ui/button'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '../ui/dialog'
  
  interface FormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    children: ReactNode
    onSubmit: (
      event: FormEvent<HTMLFormElement>,
    ) => void
    submitLabel?: string
  }
  
  export function FormModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSubmit,
    submitLabel = 'Salvar registro',
  }: FormModalProps) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl sm:max-w-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-950">
              {title}
            </DialogTitle>
  
            <DialogDescription className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={onSubmit}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {children}
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
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  interface FieldProps {
    label: string
    children: ReactNode
    wide?: boolean
  }
  
  export function Field({
    label,
    children,
    wide = false,
  }: FieldProps) {
    return (
      <label
        className={
          wide
            ? 'space-y-1.5 sm:col-span-2'
            : 'space-y-1.5'
        }
      >
        <span className="block text-sm font-semibold text-gray-700">
          {label}
        </span>
  
        {children}
      </label>
    )
  }