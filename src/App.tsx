import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { SampleImage } from './data/samples';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'privacy' | 'terms'>('landing');
  const [activeSample, setActiveSample] = useState<SampleImage | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  const scrollToTop = () => {
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const handleNavigate = (view: 'landing' | 'workspace' | 'privacy' | 'terms') => {
    setCurrentView(view);
    scrollToTop();
  };

  const handleSelectSample = (sample: SampleImage) => {
    setActiveSample(sample);
    setCurrentView('workspace');
    scrollToTop();
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
      <div key={currentView} id="main-content" className="flex-1 flex flex-col animate-view-fade">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenWorkspace={() => handleNavigate('workspace')}
            onSelectSample={handleSelectSample}
            onNewImage={handleNewImage}
            onOpenPrivacy={() => handleNavigate('privacy')}
            onOpenTerms={() => handleNavigate('terms')}
          />
        ) : currentView === 'workspace' ? (
          <Workspace
            initialSample={activeSample}
            onNavigateHome={() => handleNavigate('landing')}
            isExportOpen={isExportOpen}
            setIsExportOpen={setIsExportOpen}
            isShortcutsOpen={isShortcutsOpen}
            setIsShortcutsOpen={setIsShortcutsOpen}
          />
        ) : currentView === 'privacy' ? (
          <PrivacyPolicy
            onNavigateHome={() => handleNavigate('landing')}
            onOpenWorkspace={() => handleNavigate('workspace')}
          />
        ) : (
          <TermsAndConditions
            onNavigateHome={() => handleNavigate('landing')}
            onOpenWorkspace={() => handleNavigate('workspace')}
          />
        )}
      </div>
    </div>
  );
};

export default App;
