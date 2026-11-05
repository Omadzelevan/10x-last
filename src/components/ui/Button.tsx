import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-900',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-900',
  danger:
    'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-600',
  ghost:
    'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-900',
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
