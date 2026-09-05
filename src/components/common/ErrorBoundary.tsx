import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { isChunkLoadError, handleChunkLoadFailure } from "@/lib/lazyWithRetry";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // If it's a chunk failure that wasn't already caught by lazyWithRetry, auto-recover
    if (isChunkLoadError(error)) {
      handleChunkLoadFailure();
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunk = isChunkLoadError(this.state.error);

      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-stone-900 tracking-tight">
                {isChunk
                  ? "Byla vydána nová verze webu"
                  : "Něco se nepodařilo načíst"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {isChunk
                  ? "Na serveru byla aktualizována verze aplikace nebo došlo k výpadku připojení. Obnovení stránky načte nejnovější materiály."
                  : "Při načítání této části webu nastala chyba. Zkuste stránku načíst znovu."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-text text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-orange/20 transition-all cursor-pointer"
              >
                <RefreshCw size={16} />
                Načíst znovu
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Home size={16} />
                Rozcestník
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
