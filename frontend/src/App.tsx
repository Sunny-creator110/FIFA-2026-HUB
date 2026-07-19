import React, { useState, lazy, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import type { LanguageType } from './context/LanguageContext';

const FanDashboard = lazy(() => import('./components/FanDashboard').then(m => ({ default: m.FanDashboard })));
const OpsDashboard = lazy(() => import('./components/OpsDashboard').then(m => ({ default: m.OpsDashboard })));
const VolunteerHub = lazy(() => import('./components/VolunteerHub').then(m => ({ default: m.VolunteerHub })));
const InclusiveHub = lazy(() => import('./components/InclusiveHub').then(m => ({ default: m.InclusiveHub })));

function DashboardLoader() {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center space-y-4 bg-[#171c26]/40 rounded-2xl border border-white/5 p-8 animate-pulse">
      <span className="material-symbols-outlined text-4xl text-[#b5c4ff] animate-spin">sync</span>
      <p className="text-sm font-semibold text-[#c4c5d5]">Loading FIFA 2026 Operational Module...</p>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<'ops' | 'fan' | 'volunteers' | 'inclusive'>('ops');
  const { language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleLanguage = () => {
    const langs: LanguageType[] = ['en', 'es', 'fr'];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
  };

  return (
    <div className="min-h-screen bg-[#0e131d] text-[#dee2f1] flex flex-col font-sans selection:bg-[#3557bc] selection:text-white pb-6">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 h-16 bg-[#0e131d]/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b5c4ff] text-2xl font-black">sports_soccer</span>
            <span className="font-headline-md text-xl font-black text-[#b5c4ff] tracking-tight">
              FIFA 2026 HUB
            </span>
          </div>

          <div className="hidden lg:flex gap-6 items-center" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'ops'}
              onClick={() => setActiveTab('ops')}
              className={`transition-colors text-sm font-bold cursor-pointer ${
                activeTab === 'ops' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Operations Center
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'fan'}
              onClick={() => setActiveTab('fan')}
              className={`transition-colors text-sm font-bold cursor-pointer ${
                activeTab === 'fan' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Fan Concierge
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'volunteers'}
              onClick={() => setActiveTab('volunteers')}
              className={`transition-colors text-sm font-bold cursor-pointer ${
                activeTab === 'volunteers' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Volunteer Command
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'inclusive'}
              onClick={() => setActiveTab('inclusive')}
              className={`transition-colors text-sm font-bold cursor-pointer ${
                activeTab === 'inclusive' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Inclusive Hub
            </button>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-[#303540]/60 hover:bg-[#303540] px-3 py-1.5 rounded-full text-xs font-extrabold text-[#f2bf52] border border-white/10 transition-all cursor-pointer"
            aria-label="Cycle Language"
          >
            <span className="material-symbols-outlined text-base text-[#b5c4ff]">language</span>
            <span className="uppercase">{language}</span>
          </button>
        </div>
      </nav>

      {/* Main View Container */}
      <main className="flex-1 mt-20 px-4 md:px-8 max-w-7xl w-full mx-auto">
        <Suspense fallback={<DashboardLoader />}>
          {activeTab === 'ops' && <OpsDashboard />}
          {activeTab === 'fan' && <FanDashboard />}
          {activeTab === 'volunteers' && <VolunteerHub />}
          {activeTab === 'inclusive' && <InclusiveHub />}
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
