import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    default:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline:
      'border border-border bg-transparent hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-foreground',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-8 text-base rounded-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
