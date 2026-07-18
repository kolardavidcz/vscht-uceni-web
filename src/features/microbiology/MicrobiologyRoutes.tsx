import { Navigate, Route, Routes } from "react-router-dom";
import { useMicrobiologyData } from "./hooks/useMicrobiologyData";
import { QuizPage } from "./pages/QuizPage";
import { StudyPage } from "./pages/StudyPage";
import { AdminPage } from "./pages/AdminPage";

/**
 * Microbiology feature shell — lazy-loaded so wiki/python stay out of the
 * critical path for the common entry `/mikrobiologie`.
 */
export default function MicrobiologyRoutes() {
  const data = useMicrobiologyData();

  if (!data.ready) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 text-sm font-semibold">
        Načítám data systematiky…
      </div>
    );
  }

  return (
    <Routes>
      <Route index element={<QuizPage data={data} />} />
      <Route path="studijni-strom" element={<StudyPage data={data} />} />
      <Route path="samostudium" element={<StudyPage data={data} />} />
      <Route path="srovnavaci-matice" element={<StudyPage data={data} />} />
      <Route path="admin" element={<AdminPage data={data} />} />
      <Route path="*" element={<Navigate to="/mikrobiologie" replace />} />
    </Routes>
  );
}
