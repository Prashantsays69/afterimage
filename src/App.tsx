import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { SampleImage } from './data/samples';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [activeSample, setActiveSample] = useState<SampleImage | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  const handleNavigate = (view: 'landing' | 'workspace') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sample: SampleImage) => {
    setActiveSample(sample);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewImage = () => {
    setCurrentView('workspace');
    setTimeout(() => {
      const fileInput = document.getElementById('image-file-input') as HTMLInputElement | null;
      fileInput?.click();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-body selection:bg-signal-red selection:text-white">
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-ink text-white font-mono text-xs border border-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
      >
        Skip to main content
      </a>

      {/* Persistent Application Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onNewImage={handleNewImage}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        hasPalette={true}
      />

      {/* Main View Container */}
      <div id="main-content" className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenWorkspace={() => handleNavigate('workspace')}
            onSelectSample={handleSelectSample}
          />
        ) : (
          <Workspace
            initialSample={activeSample}
            onNavigateHome={() => handleNavigate('landing')}
            isExportOpen={isExportOpen}
            setIsExportOpen={setIsExportOpen}
            isShortcutsOpen={isShortcutsOpen}
            setIsShortcutsOpen={setIsShortcutsOpen}
          />
        )}
      </div>
    </div>
  );
};

export default App;
