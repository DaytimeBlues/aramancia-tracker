import React, { useEffect, useState, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';

interface ToastProps {
    message: string | null;
    onClose: () => void;
    duration?: number;
}

/**
 * Global Toast Component
 *
 * DESIGN:
 * - "Material 3" Snackbar placement (bottom center).
 * - "Fuyuki" Glassmorphism aesthetics (backdrop-blur, parchment text).
 * - Animation: Slide up entrance, fade out exit.
 */
export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(false);
    const prevMessageRef = useRef<string | null>(null);

    useEffect(() => {
        if (message !== prevMessageRef.current) {
            prevMessageRef.current = message;
            if (message) {
                setVisible(true);
                const timer = setTimeout(() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }, duration);
                return () => clearTimeout(timer);
            } else {
                setVisible(false);
            }
        }
    }, [message, duration, onClose]);

    if (!message && !visible) return null;

    return (
        <div
            className={`
                fixed bottom-24 left-1/2 -translate-x-1/2 
                z-[100] max-w-sm w-full px-4
                transition-all duration-300 ease-out transform
                ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
            `}
        >
            <div className="
                flex items-center gap-3 p-4 
                bg-stone-900/90 backdrop-blur-md 
                border border-parchment/20 
                rounded-xl shadow-2xl shadow-black/50
                text-parchment-light font-display text-sm tracking-wide
            ">
                <div className="p-2 bg-accent/10 rounded-full">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                </div>

                <span className="flex-1">{message}</span>

                <button
                    onClick={() => {
                        setVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
