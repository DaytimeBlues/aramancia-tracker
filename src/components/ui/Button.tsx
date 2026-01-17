import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'fantasy' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

/**
 * Standardized Button Component
 * 
 * DESIGN:
 * - Implements "Fuyuki" aesthetic via `btn-fantasy` and `btn-primary` classes.
 * - Includes Material 3 "Ripple" effect via `ripple-effect` class.
 * - Supports loading states and icons for "Signifier" clarity.
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'fantasy',
    size = 'md',
    isLoading = false,
    icon,
    disabled,
    ...props
}) => {
    // Base classes based on variant
    let baseClass = 'ripple-effect inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

    switch (variant) {
        case 'primary':
            baseClass += ' btn-primary shadow-lg hover:shadow-xl';
            break;
        case 'fantasy':
            baseClass += ' btn-fantasy shadow-md hover:shadow-lg hover:border-accent/50';
            break;
        case 'ghost':
            baseClass += ' bg-transparent hover:bg-white/5 text-muted hover:text-white border border-transparent';
            break;
        case 'danger':
            baseClass += ' bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 hover:border-red-500 uppercase font-display tracking-wider text-sm';
            break;
    }

    // Size classes
    switch (size) {
        case 'sm':
            baseClass += ' px-3 py-1.5 text-xs';
            break;
        case 'md':
            baseClass += ''; // Default padding handled by btn-* classes usually, but we can enforce if needed
            break;
        case 'lg':
            baseClass += ' px-6 py-3 text-lg';
            break;
    }

    return (
        <button
            className={`${baseClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};
