import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { capitalizeFirstLetter } from '@/lib/capitalize-text'

const variantStyles = {
  // Gray Pill
  default: {
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#364254]',
    dot: 'bg-[#6C778B]',
  },
  // Blue Pill
  // secondary: {
  //   bg: 'bg-[#E6F0FF]',
  //   text: 'text-[#287AFF]',
  //   dot: 'bg-[#287AFF]',
  // },
  //   Red Pill
  destructive: {
    bg: 'bg-[#FDECEC]',
    text: 'text-[#962121]',
    dot: 'bg-[#D32F2F]',
  },
  //   Green Pill
  success: {
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#367C39]',
    dot: 'bg-[#4CAF50]',
  },
  //   Yellow Pill
  warning: {
    bg: 'bg-[#FDF9EC]',
    text: 'text-[#B57200]',
    dot: 'bg-[#FFA000]',
  },
}

const pillVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: `${variantStyles.default.bg} ${variantStyles.default.text}`,
        // secondary: `${variantStyles.secondary.bg} ${variantStyles.secondary.text}`,
        destructive: `${variantStyles.destructive.bg} ${variantStyles.destructive.text}`,
        success: variantStyles.success.bg + ' ' + variantStyles.success.text,
        warning: variantStyles.warning.bg + ' ' + variantStyles.warning.text,
      },
      size: {
        sm: 'h-5 w-20 text-xs px-2',
        default: 'py-0.5 px-2.5 w-[92px] h-[22px] text-xs',
      },
      rounded: {
        full: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'full',
    },
  },
)

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  /**
   * Optional leading element (like an icon or dot)
   */
  leftElement?: React.ReactNode
  /**
   * Optional trailing element (like an icon or close button)
   */
  rightElement?: React.ReactNode
  /**
   * If true, shows a dot before the text
   */
  withDot?: boolean
  /**
   * If true, adds a subtle shadow to the pill
   */
  withShadow?: boolean
  /**
   * If true, pill will take up full width of its container
   */
  fullWidth?: boolean
}

/**
 * A versatile pill component that can be used for tags, status indicators, etc.
 */
const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      rounded,
      leftElement,
      rightElement,
      withDot = false,
      withShadow = false,
      fullWidth = false,
      children,
      ...props
    },
    ref,
  ) => {
    // Get the dot color based on variant
    const dotColor =
      variantStyles[variant as keyof typeof variantStyles]?.dot || 'bg-gray-500'

    const borderColor =
      variantStyles[variant as keyof typeof variantStyles]?.text

    return (
      <div
        className={cn(
          pillVariants({ variant, size, rounded, className }),
          withShadow && 'shadow-sm',
          fullWidth && 'w-full',
          'inline-flex items-center justify-start gap-2 w-24 ',
        )}
        ref={ref}
        {...props}
      >
        {withDot && (
          <span
            className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColor)}
          />
        )}
        {leftElement && (
          <span className="flex items-center">{leftElement}</span>
        )}
        {children && (
          <span className="flex items-center text-xs capitalize ">
            {typeof children === 'string'
              ? capitalizeFirstLetter(children)
              : children}
          </span>
        )}
        {rightElement && (
          <span className="flex items-center">{rightElement}</span>
        )}
      </div>
    )
  },
)

Pill.displayName = 'Pill'

export { Pill, pillVariants }
