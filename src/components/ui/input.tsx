import * as React from 'react'

import { cn } from '../../lib/utils'

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm',
        'transition-all duration-150',
        'placeholder:text-gray-400',
        'hover:border-gray-300',
        'focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }