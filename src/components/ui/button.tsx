import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  cva,
  type VariantProps,
} from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg',
    'text-sm font-semibold',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800',

        outline:
          'border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100',

        secondary:
          'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',

        ghost:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900',

        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',

        link:
          'text-blue-600 underline-offset-4 hover:underline',
      },

      size: {
        default:
          'h-11 px-4 py-2.5',

        sm:
          'h-9 rounded-lg px-3',

        lg:
          'h-12 rounded-lg px-5',

        icon:
          'size-10',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }