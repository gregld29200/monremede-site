import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from 'react'
import { Slot } from '@radix-ui/react-slot'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-3 font-sans font-medium tracking-wider uppercase transition-all duration-400 relative overflow-hidden cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variants
          variant === 'primary' && [
            'bg-gold text-forest-deep',
            'hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(196,163,90,0.3)]',
            // Shine effect
            'before:absolute before:top-0 before:-left-full before:w-full before:h-full',
            'before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent',
            'before:transition-[left] before:duration-500 hover:before:left-full',
          ],
          variant === 'secondary' && [
            'border border-cream/25 text-cream bg-transparent',
            'hover:bg-cream/8 hover:border-cream/40',
          ],
          variant === 'outline' && [
            'border border-forest/30 text-forest bg-transparent',
            'hover:bg-forest hover:text-cream hover:border-forest',
          ],
          variant === 'ghost' && [
            'text-forest bg-transparent',
            'hover:bg-forest/10',
          ],

          // Sizes
          size === 'sm' && 'px-5 py-2.5 text-xs',
          size === 'md' && 'px-8 py-4 text-sm',
          size === 'lg' && 'px-10 py-5 text-base',

          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button }
