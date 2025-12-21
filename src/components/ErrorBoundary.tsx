import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
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
        // TODO: Send to error tracking service (Sentry)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Algo deu errado
                        </h2>
                        <p className="text-slate-400 mb-6">
                            Detectamos um erro inesperado. Nossa equipe foi notificada e está trabalhando na solução.
                        </p>
                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                                    Detalhes técnicos
                                </summary>
                                <pre className="mt-2 p-3 bg-slate-950 rounded text-xs text-red-400 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
