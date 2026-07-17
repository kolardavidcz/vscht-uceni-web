import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { WikiPage } from "@/features/bioinformatics/pages/WikiPage";
import { PythonAnalyzerPage } from "@/features/python-analyzer/pages/PythonAnalyzerPage";
import { useMicrobiologyData } from "@/features/microbiology/hooks/useMicrobiologyData";
import { QuizPage } from "@/features/microbiology/pages/QuizPage";
import { StudyPage } from "@/features/microbiology/pages/StudyPage";
import { AdminPage } from "@/features/microbiology/pages/AdminPage";

function MicrobiologyRoutes() {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mikrobiologie/*" element={<MicrobiologyRoutes />} />
        <Route path="/obor-bioinformatika/*" element={<WikiPage />} />
        <Route path="/python-analyza" element={<PythonAnalyzerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
