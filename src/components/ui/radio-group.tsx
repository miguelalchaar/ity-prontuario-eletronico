import * as React from 'react'

import { cn } from '../../lib/utils'

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(
    null,
  )

interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] =
    React.useState(defaultValue)

  const selectedValue = value ?? internalValue

  function handleValueChange(
    nextValue: string,
  ) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return (
    <RadioGroupContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        name,
        disabled,
      }}
    >
      <div
        role="radiogroup"
        aria-disabled={disabled}
        className={cn(
          'grid gap-3',
          className,
        )}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  value: string
}

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className, value, disabled, ...props }, ref) => {
  const context = React.useContext(
    RadioGroupContext,
  )

  if (!context) {
    throw new Error(
      'RadioGroupItem must be used inside RadioGroup',
    )
  }

  const isDisabled =
    disabled || context.disabled

  const isChecked =
    context.value === value

  return (
    <span className="relative inline-flex size-5 shrink-0">
      <input
        ref={ref}
        type="radio"
        value={value}
        name={context.name}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() =>
          context.onValueChange?.(value)
        }
        className={cn(
          'peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-full',
          'border-2 border-gray-300 bg-white',
          'transition-all duration-150',
          'hover:border-blue-400',
          'focus:outline-none',
          'focus-visible:ring-4 focus-visible:ring-blue-500/10',
          'checked:border-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />

      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
          'bg-blue-600 opacity-0 transition-opacity',
          'peer-checked:opacity-100',
        )}
      />
    </span>
  )
})

RadioGroupItem.displayName = 'RadioGroupItem'

export {
  RadioGroup,
  RadioGroupItem,
}