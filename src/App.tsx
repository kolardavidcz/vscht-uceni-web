import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StudyPage } from './features/microbiology/components/StudyPage';
import { AdminPanel } from './features/microbiology/components/AdminPanel';
import { Home } from './pages/Home';
import { BioinformaticsDashboard } from './features/bioinformatics/components/BioinformaticsDashboard';
import { PythonAnalyzer } from './features/python-analyzer/components/PythonAnalyzer';
import { useMicrobiologyData } from './features/microbiology/hooks/useMicrobiologyData';
import { QuizPage } from './features/microbiology/pages/QuizPage';

function App() {
  const { currentWorksheetData, emojiOptions, emojiCategories, handleUpdateData, isLocalMode } = useMicrobiologyData();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/obor-bioinformatika" element={<BioinformaticsDashboard />} />
        <Route path="/obor-bioinformatika/:materialKey" element={<BioinformaticsDashboard />} />
        <Route path="/obor-bioinformatika/:courseKey/:materialKey" element={<BioinformaticsDashboard />} />
        <Route path="/obor-bioinformatika/:courseKey/:subcategoryKey/:materialKey" element={<BioinformaticsDashboard />} />
        <Route path="/python-analyza" element={<PythonAnalyzer />} />
        
        {/* Microbiology Routes */}
        <Route path="/mikrobiologie" element={
          <QuizPage 
            currentWorksheetData={currentWorksheetData}
            emojiOptions={emojiOptions}
            emojiCategories={emojiCategories}
            isLocalMode={isLocalMode}
          />
        } />
        <Route path="/mikrobiologie/studijni-strom" element={
          <InternalStudyPage data={currentWorksheetData} emojiOptions={emojiOptions} activeTab="tree" />
        } />
        <Route path="/mikrobiologie/samostudium" element={
          <InternalStudyPage data={currentWorksheetData} emojiOptions={emojiOptions} activeTab="flashcards" />
        } />
        <Route path="/mikrobiologie/srovnavaci-matice" element={
          <InternalStudyPage data={currentWorksheetData} emojiOptions={emojiOptions} activeTab="matrix" />
        } />
        <Route path="/mikrobiologie/study" element={<Navigate to="/mikrobiologie/studijni-strom" replace />} />
        <Route path="/mikrobiologie/admin" element={
          <InternalAdminPanel 
            onBack={() => {}} 
            onUpdateData={handleUpdateData} 
            currentData={currentWorksheetData} 
            currentEmojiOptions={emojiOptions}
            currentEmojiCategories={emojiCategories}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper components to handle navigation internally
function InternalStudyPage({ data, emojiOptions, activeTab }: any) {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Taxonomie mikroorganizmů - Studium";
  }, []);
  return <StudyPage onBack={() => navigate('/mikrobiologie')} data={data} emojiOptions={emojiOptions} activeTab={activeTab} />;
}

function InternalAdminPanel({ onUpdateData, currentData, currentEmojiOptions, currentEmojiCategories }: any) {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Taxonomie mikroorganizmů - Administrace";
  }, []);
  return (
    <AdminPanel 
      onBack={() => navigate('/mikrobiologie')} 
      onUpdateData={onUpdateData} 
      currentData={currentData} 
      currentEmojiOptions={currentEmojiOptions}
      currentEmojiCategories={currentEmojiCategories}
    />
  );
}

export default App;
