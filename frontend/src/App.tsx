import { useState, lazy, Suspense } from 'react';
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
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Authentication & Incident states
  const [showIncidentLogs, setShowIncidentLogs] = useState(false);
  const [showSupportPanel, setShowSupportPanel] = useState(false);

  // Cycle languages
  const toggleLanguage = () => {
    const langs: LanguageType[] = ['en', 'es', 'fr'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-[#0e131d] text-[#dee2f1] flex flex-col font-sans selection:bg-[#3557bc] selection:text-white pb-6">
      
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-3 md:px-6 h-14 md:h-16 bg-[#0e131d]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(53,87,188,0.25)]">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile hamburger */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden material-symbols-outlined text-[#b5c4ff] hover:bg-[#303540]/50 p-1.5 rounded-lg transition-all cursor-pointer text-2xl"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? 'close' : 'menu'}
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b5c4ff] text-xl md:text-2xl font-black">sports_soccer</span>
            <span className="font-headline-md text-lg md:text-2xl font-black text-[#b5c4ff] tracking-tighter">
              FIFA 2026 HUB
            </span>
          </div>
          <div className="hidden lg:flex gap-6 items-center" role="tablist" aria-label="Main Navigation Tabs">
            <button 
              id="tab-ops"
              role="tab"
              aria-selected={activeTab === 'ops'}
              aria-controls="tabpanel-ops"
              onClick={() => setActiveTab('ops')}
              className={`transition-colors font-body-md cursor-pointer ${
                activeTab === 'ops' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1 font-bold' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Operations Center
            </button>
            <button 
              id="tab-fan"
              role="tab"
              aria-selected={activeTab === 'fan'}
              aria-controls="tabpanel-fan"
              onClick={() => setActiveTab('fan')}
              className={`transition-colors font-body-md cursor-pointer ${
                activeTab === 'fan' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1 font-bold' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Fan Concierge
            </button>
            <button 
              id="tab-volunteers"
              role="tab"
              aria-selected={activeTab === 'volunteers'}
              aria-controls="tabpanel-volunteers"
              onClick={() => setActiveTab('volunteers')}
              className={`transition-colors font-body-md cursor-pointer ${
                activeTab === 'volunteers' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1 font-bold' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Volunteer Command
            </button>
            <button 
              id="tab-inclusive"
              role="tab"
              aria-selected={activeTab === 'inclusive'}
              aria-controls="tabpanel-inclusive"
              onClick={() => setActiveTab('inclusive')}
              className={`transition-colors font-body-md cursor-pointer ${
                activeTab === 'inclusive' ? 'text-[#b5c4ff] border-b-2 border-[#f2bf52] pb-1 font-bold' : 'text-[#c4c5d5] hover:text-[#dee2f1]'
              }`}
            >
              Inclusive Hub
            </button>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Global Search Mock */}
          <div className="relative hidden md:block">
            <input 
              className="bg-[#303540]/50 border-none rounded-full px-4 py-1.5 text-[#dee2f1] placeholder-[#c4c5d5] focus:ring-1 focus:ring-[#b5c4ff] w-64 text-sm"
              placeholder="Search gates, events..." 
              type="text"
            />
            <span className="material-symbols-outlined absolute right-3 top-2 text-[#c4c5d5] text-lg">search</span>
          </div>

          {/* Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="material-symbols-outlined text-[#b5c4ff] hover:bg-[#303540]/50 p-2 rounded-full transition-all active:scale-95 duration-150 cursor-pointer"
            title="Cycle Language (EN / ES / FR)"
            aria-label="Toggle language"
          >
            language
          </button>
          <span className="text-xs uppercase font-extrabold text-[#f2bf52] hidden sm:inline">{language}</span>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="material-symbols-outlined text-[#b5c4ff] hover:bg-[#303540]/50 p-2 rounded-full transition-all active:scale-95 duration-150 relative cursor-pointer"
              aria-label="View notifications"
            >
              notifications
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ffb4a9] rounded-full animate-ping"></span>
            </button>

            {showNotificationPopup && (
              <div className="absolute right-0 mt-3 w-80 bg-[#171c26] border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-fade-in text-xs">
                <h4 className="font-bold text-[#b5c4ff] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb4a9] text-base">notifications_active</span>
                  Operational Alerts
                </h4>
                <div className="space-y-2 text-[#dee2f1]">
                  <div className="p-2 bg-[#303540]/30 rounded border-l-2 border-[#ffb4a9]">
                    <span className="font-semibold text-[#ffb4a9] block">Gate 4 Congestion Alert</span>
                    Queue times exceeded 25 mins. Dispatch checklist initiated.
                  </div>
                  <div className="p-2 bg-[#303540]/30 rounded border-l-2 border-[#f2bf52]">
                    <span className="font-semibold text-[#f2bf52] block">Shuttle Route Update</span>
                    Metro Shuttle fleet operating at 92% capacity.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="material-symbols-outlined text-[#b5c4ff] hover:bg-[#303540]/50 p-2 rounded-full transition-all active:scale-95 duration-150 cursor-pointer"
              aria-label="View user profile"
            >
              account_circle
            </button>
            {showProfilePopup && (
              <div className="absolute right-0 mt-3 w-56 bg-[#171c26] border border-white/10 rounded-xl p-4 shadow-2xl z-50 text-xs">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#003399] flex items-center justify-center text-xs font-bold text-white">FC</div>
                  <div>
                    <span className="font-bold block text-[#dee2f1]">FIFA Coordinator</span>
                    <span className="text-[10px] text-[#c4c5d5]">Lusail Stadium Central</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowIncidentLogs(true);
                    setShowProfilePopup(false);
                  }}
                  className="w-full text-left py-1 text-[#c4c5d5] hover:text-white transition-colors cursor-pointer"
                >
                  Incident Logs
                </button>
                <button 
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full text-left py-1 text-[#c4c5d5] hover:text-white transition-colors cursor-pointer"
                >
                  Reload Console
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SideNavBar */}
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <aside className={`fixed left-0 top-14 md:top-16 bottom-0 z-40 flex flex-col bg-[#090e18]/95 lg:bg-[#090e18]/80 backdrop-blur-3xl border-r border-[#444653]/20 shadow-2xl w-64 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#003399] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#b5c4ff]">shield_person</span>
            </div>
            <div>
              <h3 className="font-bold text-[#dee2f1] text-sm">Command Center</h3>
              <p className="text-[#c4c5d5] text-[10px]">Global Operations v4.2</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('ops'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'ops' 
                ? 'bg-[#003399]/30 text-[#b5c4ff] border-r-4 border-[#f2bf52] shadow-inner' 
                : 'text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Operations Control
          </button>
          
          <button 
            onClick={() => { setActiveTab('fan'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'fan' 
                ? 'bg-[#003399]/30 text-[#b5c4ff] border-r-4 border-[#f2bf52] shadow-inner' 
                : 'text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            Fan Concierge
          </button>
          
          <button 
            onClick={() => { setActiveTab('volunteers'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'volunteers' 
                ? 'bg-[#003399]/30 text-[#b5c4ff] border-r-4 border-[#f2bf52] shadow-inner' 
                : 'text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">groups_2</span>
            Volunteer Hub
          </button>
          
          <button 
            onClick={() => { setActiveTab('inclusive'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inclusive' 
                ? 'bg-[#003399]/30 text-[#b5c4ff] border-r-4 border-[#f2bf52] shadow-inner' 
                : 'text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">accessibility_new</span>
            Inclusive Hub
          </button>
        </nav>

        {/* Side Panel Footer & Emergency Trigger */}
        <div className="p-4 mt-auto space-y-4">
          <button 
            onClick={() => setEmergencyActive(!emergencyActive)}
            className={`w-full py-3 font-black text-xs tracking-widest rounded-lg hover:brightness-110 active:scale-95 duration-150 transition-all border cursor-pointer ${
              emergencyActive 
                ? 'bg-[#ef4444] text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' 
                : 'bg-[#c00205] text-[#ffcdc5] border-[#ffcdc5]/20'
            }`}
          >
            {emergencyActive ? 'SECURE MODE ACTIVE' : 'EMERGENCY PROTOCOL'}
          </button>
          
          <div className="flex border-t border-[#444653]/20 pt-4 gap-2 text-xs">
            <button 
              onClick={() => setShowSupportPanel(true)}
              className="flex-1 flex flex-col items-center py-2 text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-[#b5c4ff] rounded-lg cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-lg">help_outline</span>
              <span className="text-[10px] mt-0.5">Support</span>
            </button>
            <button 
              onClick={() => setShowIncidentLogs(true)}
              className="flex-1 flex flex-col items-center py-2 text-[#c4c5d5] hover:bg-[#303540]/20 hover:text-[#f2bf52] rounded-lg cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-lg">history_edu</span>
              <span className="text-[10px] mt-0.5">Logs</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-0 lg:ml-64 mt-14 md:mt-16 p-3 md:p-6 pb-20 lg:pb-6 min-h-screen bg-[#0e131d] relative overflow-hidden">
        
        {/* Decorative ambient background blur */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#3557bc]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Live Alerts Header (Pulsing Red Banner) */}
        <div className={`w-full px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 rounded-xl mb-6 shadow-inner border-b transition-all duration-300 ${
          emergencyActive 
            ? 'bg-[#c00205] text-[#ffcdc5] border-[#ffcdc5]/20 alert-pulse' 
            : 'bg-[#1b202a] text-[#dee2f1] border-white/5'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffb4a9] text-xl animate-bounce">warning</span>
            <span className="font-data-label text-xs font-bold uppercase tracking-widest">
              {emergencyActive 
                ? 'EMERGENCY SHIELD ACTIVE: ALL VENUE ACCESS GATES LOCKED' 
                : 'LIVE ALERTS: CROWD THRESHOLD REACHED AT ACCESS GATE 4'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#c4c5d5] opacity-80 hidden sm:inline">Multilingual Active</span>
            <button 
              onClick={() => setEmergencyActive(false)}
              className="material-symbols-outlined hover:brightness-110 transition-all text-base cursor-pointer"
            >
              close
            </button>
          </div>
        </div>

        {/* Onboarding Tutorial Text Guide */}
        {showTutorial && (
          <div className="glass-panel rounded-2xl p-6 border border-[#b5c4ff]/35 mb-6 bg-[#171c26]/60 shadow-xl relative overflow-hidden animate-fade-in z-20">
            <div className="absolute top-4 right-4 z-30">
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-[10px] uppercase font-black px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#dee2f1] cursor-pointer tracking-wider"
              >
                Dismiss Guide
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2bf52] text-xl">menu_book</span>
                <span className="text-[10px] tracking-widest uppercase font-black text-[#f2bf52] bg-[#f2bf52]/10 px-2.5 py-0.5 rounded border border-[#f2bf52]/20">
                  SYSTEM MANUAL & QUICK-START GUIDE
                </span>
              </div>
              
              <h3 className="font-headline-md text-base md:text-lg font-black text-white uppercase tracking-tight">
                How to Navigate and Operate the FIFA 2026 Operations Hub
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Column 1: Dashboard Navigation */}
                <div className="space-y-3.5 bg-black/25 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-[#b5c4ff] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">explore</span>
                    Portal Directories
                  </h4>
                  <ul className="space-y-3 text-xs text-[#c4c5d5]">
                    <li className="flex gap-2">
                      <span className="text-[#f2bf52] font-extrabold shrink-0">1. Operations:</span>
                      <span>Real-time spectator telemetry, crowd gate loads, recycling sensors, and the generative volunteer task builder.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#f2bf52] font-extrabold shrink-0">2. Fan Concierge:</span>
                      <span>Bespoke match countdown tracker, AI Assistant chatbot, live fan pulse, and SVG interactive stadium gate map.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#f2bf52] font-extrabold shrink-0">3. Volunteer Command:</span>
                      <span>Staff distribution heatmap nodes, AI Briefing dispatch center, and automated shift allocation optimization.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#f2bf52] font-extrabold shrink-0">4. Inclusive Hub:</span>
                      <span>Accessibility channels, Speech-Synthesis narration player, ASL avatar stream, and steward assistance dispatchers.</span>
                    </li>
                  </ul>
                </div>
                
                {/* Column 2: Step-by-Step Test Guide */}
                <div className="space-y-3.5 bg-black/25 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-[#f2bf52] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Operational Checklist to Test Features
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#c4c5d5]">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#b5c4ff] text-base shrink-0">arrow_right_alt</span>
                      <span><strong>Checklist Simulation:</strong> Go to <em>Operations</em>, scroll to the bottom, type an incident, and hit simulate.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#b5c4ff] text-base shrink-0">arrow_right_alt</span>
                      <span><strong>Map Highlights:</strong> Go to <em>Fan Concierge</em>, click on any gate (G1-G5) on the SVG map to highlight accessible paths.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#b5c4ff] text-base shrink-0">arrow_right_alt</span>
                      <span><strong>Briefing Dispatch:</strong> Go to <em>Volunteer Command</em>, type a new briefing and dispatch to see the live feed update.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#b5c4ff] text-base shrink-0">arrow_right_alt</span>
                      <span><strong>Speech Synthesis:</strong> Go to <em>Inclusive Hub</em>, click Play to hear the browser speak the narrated match details.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#b5c4ff] text-base shrink-0">arrow_right_alt</span>
                      <span><strong>Emergency Mode:</strong> Press the red **EMERGENCY PROTOCOL** button in the sidebar to secure the stadium gates.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render dashboards with Suspense lazy loading */}
        <Suspense fallback={<DashboardLoader />}>
          <div
            id="tabpanel-ops"
            role="tabpanel"
            aria-labelledby="tab-ops"
            className={activeTab === 'ops' ? 'block' : 'hidden'}
          >
            <OpsDashboard />
          </div>

          <div
            id="tabpanel-fan"
            role="tabpanel"
            aria-labelledby="tab-fan"
            className={activeTab === 'fan' ? 'block' : 'hidden'}
          >
            <FanDashboard />
          </div>

          <div
            id="tabpanel-volunteers"
            role="tabpanel"
            aria-labelledby="tab-volunteers"
            className={activeTab === 'volunteers' ? 'block' : 'hidden'}
          >
            <VolunteerHub />
          </div>

          <div
            id="tabpanel-inclusive"
            role="tabpanel"
            aria-labelledby="tab-inclusive"
            className={activeTab === 'inclusive' ? 'block' : 'hidden'}
          >
            <InclusiveHub />
          </div>
        </Suspense>

        {/* Incident Logs Modal */}
        {showIncidentLogs && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#171c26] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-headline-md text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2bf52]">history_edu</span>
                  Stadium Operations Incident Logs
                </h3>
                <button 
                  onClick={() => setShowIncidentLogs(false)}
                  className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#dee2f1] cursor-pointer"
                >
                  Close Logs
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#c4c5d5] uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    <tr>
                      <td className="py-2.5 px-3 font-mono">12:44:10</td>
                      <td className="py-2.5 px-3">Gate 4 Access</td>
                      <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 bg-red-950/30 text-red-400 rounded border border-red-500/20 font-bold uppercase text-[9px]">Critical</span></td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Resolved</span></td>
                      <td className="py-2.5 px-3 text-[#c4c5d5]">Crowd threshold exceeded capacity. Auxiliary gates opened.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">12:35:22</td>
                      <td className="py-2.5 px-3">Concourse B</td>
                      <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 bg-yellow-950/30 text-yellow-400 rounded border border-yellow-500/20 font-bold uppercase text-[9px]">Warning</span></td>
                      <td className="py-2.5 px-3"><span className="text-yellow-400 font-semibold">Investigating</span></td>
                      <td className="py-2.5 px-3 text-[#c4c5d5]">Escalator minor electrical failure reported. Technician dispatched.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">12:12:05</td>
                      <td className="py-2.5 px-3">Gate 9 Ramp</td>
                      <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-white/5 font-bold uppercase text-[9px]">Nominal</span></td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Resolved</span></td>
                      <td className="py-2.5 px-3 text-[#c4c5d5]">Sign language helper dispatched to coordinate with VIP guest.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">11:50:18</td>
                      <td className="py-2.5 px-3">Press Box</td>
                      <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-white/5 font-bold uppercase text-[9px]">Nominal</span></td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Resolved</span></td>
                      <td className="py-2.5 px-3 text-[#c4c5d5]">ASL translator assigned for the pre-match press briefings.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">11:32:44</td>
                      <td className="py-2.5 px-3">Zone A Parking</td>
                      <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 bg-red-950/30 text-red-400 rounded border border-red-500/20 font-bold uppercase text-[9px]">Critical</span></td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Resolved</span></td>
                      <td className="py-2.5 px-3 text-[#c4c5d5]">Traffic congestion block solved by opening overflow lane C.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Support Panel Modal */}
        {showSupportPanel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#171c26] border border-[#b5c4ff]/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-headline-md text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b5c4ff]">help_outline</span>
                  FanPulse 2026 Support Center
                </h3>
                <button 
                  onClick={() => setShowSupportPanel(false)}
                  className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#dee2f1] cursor-pointer"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#b5c4ff]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#b5c4ff]">chat</span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Live Chat Support</p>
                      <p className="text-[10px] text-[#c4c5d5] mt-0.5">Connect with a stadium operations coordinator in real time.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#f2bf52]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#f2bf52]">call</span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Emergency Hotline</p>
                      <p className="text-[10px] text-[#c4c5d5] mt-0.5">24/7 Stadium Command Center: <span className="text-[#f2bf52] font-bold">+1 (800) FIFA-2026</span></p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400">mail</span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Email Support</p>
                      <p className="text-[10px] text-[#c4c5d5] mt-0.5">Send a detailed report: <span className="text-emerald-400 font-bold">ops@fanpulse2026.fifa.com</span></p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#ffb4a9]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ffb4a9]">bug_report</span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Report a Bug</p>
                      <p className="text-[10px] text-[#c4c5d5] mt-0.5">Found an issue with the portal? File a ticket for quick resolution.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSupportPanel(false)}
                className="w-full py-2.5 bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] font-bold text-xs rounded-xl border border-white/5 cursor-pointer uppercase tracking-wider"
              >
                Close Support
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#090e18]/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center h-14 px-1">
        <button 
          onClick={() => setActiveTab('ops')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'ops' ? 'text-[#b5c4ff]' : 'text-[#c4c5d5]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-[8px] font-bold mt-0.5">Ops</span>
        </button>
        <button 
          onClick={() => setActiveTab('fan')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'fan' ? 'text-[#b5c4ff]' : 'text-[#c4c5d5]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          <span className="text-[8px] font-bold mt-0.5">Fan</span>
        </button>
        <button 
          onClick={() => setActiveTab('volunteers')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'volunteers' ? 'text-[#b5c4ff]' : 'text-[#c4c5d5]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">groups_2</span>
          <span className="text-[8px] font-bold mt-0.5">Volunteer</span>
        </button>
        <button 
          onClick={() => setActiveTab('inclusive')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'inclusive' ? 'text-[#b5c4ff]' : 'text-[#c4c5d5]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">accessibility_new</span>
          <span className="text-[8px] font-bold mt-0.5">Access</span>
        </button>
        <button 
          onClick={() => setEmergencyActive(!emergencyActive)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            emergencyActive ? 'text-red-400 animate-pulse' : 'text-[#ffb4a9]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">emergency</span>
          <span className="text-[8px] font-bold mt-0.5">SOS</span>
        </button>
      </nav>

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
