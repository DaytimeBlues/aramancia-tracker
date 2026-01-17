import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-stone-950 text-parchment">
                    <div className="p-6 rounded-2xl bg-stone-900/50 border border-red-900/30 backdrop-blur-sm shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
                        <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto animate-pulse" />
                        <h2 className="font-display text-2xl text-white mb-2 tracking-wide uppercase">System Critical Error</h2>
                        <p className="text-stone-400 mb-6 font-sans">
                            The weave of magic has tangled. We must reset the connection to the arcane source.
                        </p>

                        {this.state.error && (
                            <div className="bg-black/40 border border-red-900/20 p-4 rounded-lg text-left w-full overflow-auto max-h-40 mb-6 scrollbar-thin scrollbar-thumb-stone-700">
                                <code className="text-xs text-red-300 font-mono break-words">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}

                        <Button
                            variant="danger"
                            size="md"
                            onClick={() => window.location.reload()}
                            className="w-full justify-center shadow-red-900/20"
                        >
                            Reliant Reboot
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
