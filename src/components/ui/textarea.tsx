import * as React from 'react'

import { cn } from '../../lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-28 w-full resize-y rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm',
        'transition-all duration-150',
        'placeholder:text-gray-400',
        'hover:border-gray-300',
        'focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
        className,
      )}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }