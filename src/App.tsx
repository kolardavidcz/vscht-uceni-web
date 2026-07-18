import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

/** Lightweight shell while a feature chunk downloads (most users land on micro). */
function RouteFallback({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 text-sm font-semibold">
      {label}
    </div>
  );
}

const MicrobiologyRoutes = lazy(
  () => import("@/features/microbiology/MicrobiologyRoutes")
);
const WikiPage = lazy(() =>
  import("@/features/bioinformatics/pages/WikiPage").then((m) => ({
    default: m.WikiPage,
  }))
);
const PythonAnalyzerPage = lazy(() =>
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
            <Suspense fallback={<RouteFallback label="Načítám systematiku…" />}>
              <MicrobiologyRoutes />
            </Suspense>
          }
        />
        <Route
          path="/obor-bioinformatika/*"
          element={
            <Suspense fallback={<RouteFallback label="Načítám wiki…" />}>
              <WikiPage />
            </Suspense>
          }
        />
        <Route
          path="/python-analyza"
          element={
            <Suspense fallback={<RouteFallback label="Načítám analyzátor…" />}>
              <PythonAnalyzerPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
