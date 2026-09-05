import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

/** Lightweight shell while a feature chunk downloads (with an active spinner so it never feels blank). */
function RouteFallback({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-brand-espresso flex flex-col items-center justify-center text-slate-200 text-sm font-semibold gap-3 p-4">
      <div className="w-8 h-8 rounded-full border-2 border-brand-orange/30 border-t-brand-orange animate-spin" />
      <span>{label}</span>
    </div>
  );
}

const MicrobiologyRoutes = lazyWithRetry(
  () => import("@/features/microbiology/MicrobiologyRoutes")
);
const WikiPage = lazyWithRetry(() =>
  import("@/features/bioinformatics/pages/WikiPage").then((m) => ({
    default: m.WikiPage,
  }))
);
const PythonAnalyzerPage = lazyWithRetry(() =>
  import("@/features/python-analyzer/pages/PythonAnalyzerPage").then((m) => ({
    default: m.PythonAnalyzerPage,
  }))
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/mikrobiologie/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback label="Načítám systematiku…" />}>
                <MicrobiologyRoutes />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/obor-bioinformatika/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback label="Načítám wiki…" />}>
                <WikiPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/python-analyza"
          element={
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback label="Načítám analyzátor…" />}>
                <PythonAnalyzerPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
