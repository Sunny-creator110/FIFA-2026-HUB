import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface DispatchItem {
  id: string;
  message: string;
  timeAgo: string;
  recipients: number;
}

export const VolunteerHub: React.FC = () => {
  const [briefInput, setBriefInput] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'dispatching' | 'dispatched'>('idle');
  const [dispatches, setDispatches] = useState<DispatchItem[]>([
    { id: '1', message: "Emergency egress routes updated for Sector C.", timeAgo: "Sent 12m ago", recipients: 4201 },
    { id: '2', message: "High volume expected at Gate 4. Scanner teams stand by.", timeAgo: "Sent 45m ago", recipients: 2150 }
  ]);

  // AI Briefing states
  const [isListening, setIsListening] = useState(false);
  const [showAllTeamsModal, setShowAllTeamsModal] = useState(false);
  const [teams, setTeams] = useState([
    { rank: 1, name: "North Gate Titans", role: "Entry Help • 4.9★", pts: 9420, details: "Specialists in fast-track ticket validation and bag security screening. Stationed at Gates 1 and 2." },
    { rank: 2, name: "Media Escorts", role: "VIP Central • 4.8★", pts: 8105, details: "Coordinates media workspace navigation, VIP seating pathways, and press box translations. Stationed at Main Press Area." },
    { rank: 3, name: "Access Vanguard", role: "Ramp Patrols • 4.7★", pts: 7890, details: "Dedicated step-free transport escort team. Assists spectators on ramps G3/G5. Stationed at Gates 2 and 5." },
    { rank: 4, name: "Quiet Zone Stewards", role: "Sensory Rooms • 4.6★", pts: 7210, details: "Trained in sensory overload assistance and quiet-zone concourse management. Stationed at Sector 102." },
    { rank: 5, name: "Metro Navigators", role: "Transit Hub • 4.5★", pts: 6940, details: "Guides spectators to fast shuttles and train exits post-match. Stationed at Central Metro Link." }
  ]);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setBriefInput("Listening to voice...");
      setTimeout(() => {
        setBriefInput("Attention teams: Heavy arrival congestion detected at Gate 4, please deploy staff immediately.");
        setIsListening(false);
      }, 2000);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      setBriefInput("Listening...");
    };
    
    recognition.onerror = (e: any) => {
      console.error(e);
      setBriefInput("Speech recognition error. Please type manually.");
      setIsListening(false);
    };
    
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setBriefInput(transcript);
      setIsListening(false);
    };
    
    recognition.start();
  };

  const handleTranslateText = () => {
    if (!briefInput.trim() || briefInput === 'Listening...' || briefInput === 'Listening to voice...') {
      alert("Please enter a briefing note first!");
      return;
    }
    const text = briefInput.trim();
    if (text.includes("Emergency egress routes updated")) {
      setBriefInput("Rutas de evacuación de emergencia actualizadas para el Sector C.");
    } else if (text.startsWith("Rutas de evacuación")) {
      setBriefInput("Emergency egress routes updated for Sector C.");
    } else if (text.includes("Heavy arrival congestion detected")) {
      setBriefInput("Se detectó una fuerte congestión de llegada en la Puerta 4, despliegue personal inmediatamente.");
    } else if (text.startsWith("Se detectó una fuerte")) {
      setBriefInput("Attention teams: Heavy arrival congestion detected at Gate 4, please deploy staff immediately.");
    } else {
      if (text.startsWith("[ESP] ")) {
        setBriefInput(text.replace("[ESP] ", ""));
      } else {
        setBriefInput("[ESP] " + text);
      }
    }
  };

  // Shift reallocation states
  const [shiftReassigned, setShiftReassigned] = useState(false);

  // Active requests assignment state
  const [requestAssigned, setRequestAssigned] = useState(false);

  const handleDispatchBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefInput.trim()) return;

    setDispatchStatus('dispatching');
    
    setTimeout(() => {
      setDispatchStatus('dispatched');
      
      // Add brief to history log
      const newDispatch: DispatchItem = {
        id: Date.now().toString(),
        message: briefInput,
        timeAgo: "Sent just now",
        recipients: 12842
      };
      setDispatches(prev => [newDispatch, ...prev]);
      setBriefInput('');

      setTimeout(() => {
        setDispatchStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header telemetry ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="font-data-label text-xs text-[#f2bf52] tracking-widest uppercase">Volunteer Operations Dashboard</span>
          <h1 className="font-display-lg text-2xl md:text-3xl font-black mt-1 text-[#dee2f1]">Volunteer Hub Command</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-4 bg-[#303540]/30 border border-white/10">
            <div className="text-right">
              <p className="font-caption text-[10px] text-[#c4c5d5]">Active Volunteers</p>
              <p className="font-data-label text-base font-bold text-[#b5c4ff]">12,842 / 14,000</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#b5c4ff]/30 flex items-center justify-center text-[#b5c4ff]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Volunteer Status Map (Large Bento) */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-2xl overflow-hidden min-h-[450px] flex flex-col relative border border-white/10 bg-[#303540]/30">
          <div className="p-4.5 border-b border-white/5 flex justify-between items-center bg-[#171c26]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2bf52] text-xl">map</span>
              <h3 className="font-headline-md text-sm font-bold text-white">Volunteer Staff Distribution Heatmap</h3>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="px-2.5 py-0.5 bg-[#c00205]/20 text-[#ffb4a9] border border-red-500/20 rounded-full">Zone A: Critical</span>
              <span className="px-2.5 py-0.5 bg-[#303540]/50 text-[#c4c5d5] rounded-full border border-white/5">Zone B: Nominal</span>
            </div>
          </div>
          
          <div className="flex-1 relative bg-slate-900/60 overflow-hidden">
            {/* Map background image */}
            <div 
              className="absolute inset-0 opacity-35 mix-blend-overlay bg-cover bg-center transition-transform duration-500 hover:scale-105" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBim4p7PY2s4o6P5fN4tGnp_zuY8LPVlVkUJq5s9D_Htrcqe2u4E8sXRNKn9j895UUmeuyDujlyYKmfiWrH8u_ztFw9rqggj0sPiDkJsbBP_BT3BlyMArpHfKAp7kM0sYrbzW_xr2GswMUwu8AoI3g0LX4ufPDKXU-JH6ifzxx0mMqEtwz3rgmRE0DfgBz_GCy9dA-osfZ7TaCUDgwpbyEKOUGJZa1O6PBvpvWYgB9AObYrOxwc7e4Vi_Puugzfv3pHR59tj-3ci7Q')` }} 
            />
            
            {/* Map Accents */}
            <div className="absolute top-1/4 left-1/3 p-3.5 glass-panel rounded-lg border border-[#b5c4ff]/50 animate-bounce shadow-md">
              <p className="font-data-label text-[10px] text-[#b5c4ff] font-semibold">Sector 7: Fan Support</p>
              <p className="font-headline-md text-xs font-bold text-white">42 Staff Active</p>
            </div>
            
            <div className="absolute bottom-1/3 right-1/4 p-3.5 glass-panel rounded-lg border-[#ffb4a9]/50 border shadow-md">
              <p className="font-data-label text-[10px] text-[#ffb4a9] font-semibold">Gate 4: Security Patrols</p>
              <p className="font-headline-md text-xs font-bold text-white">18 Staff • Backup Needed</p>
            </div>

            {/* Glowing heatmap nodes */}
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#ffb4a9]/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-[#f2bf52]/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* 2. AI Briefing Center */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 bg-[#303540]/30 min-h-[450px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#f2bf52] text-xl">record_voice_over</span>
              <h3 className="font-headline-md text-sm font-bold text-white">AI Briefing Center</h3>
            </div>
            
            <form onSubmit={handleDispatchBrief} className="space-y-4">
              <div className="relative">
                <textarea 
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  className="w-full h-28 bg-[#171c26]/60 border border-white/10 rounded-xl p-4 text-xs text-[#dee2f1] focus:ring-1 focus:ring-[#b5c4ff] placeholder-[#c4c5d5]/30 resize-none focus:outline-none" 
                  placeholder="Type global volunteer briefing update here... (translated automatically to device locale)"
                  required
                  disabled={dispatchStatus === 'dispatching'}
                />
                <div className="absolute bottom-3 right-3 flex gap-2 text-[#c4c5d5]">
                  <button 
                    type="button" 
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`hover:text-[#b5c4ff] cursor-pointer transition-colors ${isListening ? 'text-red-400 animate-pulse' : ''}`} 
                    aria-label="voice input"
                  >
                    <span className="material-symbols-outlined text-base">mic</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleTranslateText}
                    className="hover:text-[#b5c4ff] cursor-pointer transition-colors" 
                    aria-label="translate details"
                  >
                    <span className="material-symbols-outlined text-base">translate</span>
                  </button>
                </div>
              </div>

              {/* Language target chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-[#303540]/60 border border-white/5 rounded-full text-[9px] font-semibold text-slate-300">English</span>
                <span className="px-2.5 py-1 bg-[#303540]/60 border border-white/5 rounded-full text-[9px] font-semibold text-slate-300">Spanish</span>
                <span className="px-2.5 py-1 bg-[#303540]/60 border border-white/5 rounded-full text-[9px] font-semibold text-slate-300">French</span>
                <span className="px-2.5 py-1 bg-[#303540]/60 border border-white/5 rounded-full text-[9px] font-semibold text-slate-300">+24 languages</span>
              </div>

              <button 
                type="submit"
                disabled={!briefInput.trim() || dispatchStatus === 'dispatching'}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  dispatchStatus === 'dispatched' ? 'bg-emerald-600 text-white' :
                  dispatchStatus === 'dispatching' ? 'bg-[#003399]/60 text-white animate-pulse' :
                  'bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] border border-white/5 shadow-md shadow-indigo-950/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {dispatchStatus === 'dispatched' ? 'check_circle' : 'send'}
                </span>
                <span>
                  {dispatchStatus === 'dispatched' ? 'BRIEF DISPATCHED' : 
                   dispatchStatus === 'dispatching' ? 'TRANSLATING & DISPATCHING...' : 
                   'DISPATCH MULTILINGUAL BRIEF'}
                </span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="font-data-label text-[10px] text-[#c4c5d5] uppercase tracking-wider mb-3">RECENT DISPATCHES</p>
            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {dispatches.map(item => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-[#f2bf52]/10 flex items-center justify-center text-[#f2bf52] shrink-0">
                    <span className="material-symbols-outlined text-xs">history</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-200 truncate group-hover:text-[#f2bf52] transition-colors">{item.message}</p>
                    <p className="text-[9px] text-[#c4c5d5] mt-0.5">{item.timeAgo} • {item.recipients.toLocaleString()} Recipients</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Second row of grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3. Shift Optimization Panel */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden border border-white/10 bg-[#303540]/30 min-h-[300px]">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4a9] text-xl">analytics</span>
              <h3 className="font-headline-md text-sm font-bold text-white">Shift Allocation Optimization</h3>
            </div>
            <span className="flex items-center gap-1 font-data-label text-[10px] text-[#ffb4a9] font-extrabold animate-pulse">
              ⚡ AI DECISION BOT
            </span>
          </div>

          <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-between">
            <div className={`p-4 rounded-xl border transition-all ${
              shiftReassigned 
                ? 'bg-emerald-950/20 border-emerald-500/20 text-[#c4c5d5]' 
                : 'bg-[#ffb4a9]/5 border-[#ffb4a9]/20 hover:bg-[#ffb4a9]/10'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-data-label text-[10px] text-[#ffb4a9] font-bold">PEAK DETECTED: WEST ENTRANCE G4</span>
                <span className="font-caption text-[10px] text-[#c4c5d5]">Confidence: 98%</span>
              </div>
              <p className="text-xs leading-relaxed text-[#dee2f1]">
                {shiftReassigned 
                  ? 'Successfully reassigned 12 volunteers from Inner Zone Lounge B to West Entrance Gate 4. Staff updated.'
                  : 'Highly congested lines detected at Gate 4. Suggest moving 12 volunteers from "Zone 4 Staff Lounge" to "West Access Entry" immediately.'}
              </p>
              {!shiftReassigned && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setShiftReassigned(true)}
                    className="flex-1 py-2 rounded-lg bg-[#c00205] text-[#ffcdc5] font-data-label text-[11px] font-bold hover:brightness-115 cursor-pointer"
                  >
                    EXECUTE REALLOCATION
                  </button>
                  <button 
                    onClick={() => setShiftReassigned(true)}
                    className="px-2.5 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-[#c4c5d5]"
                    aria-label="dismiss recommendation"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-white/5 bg-[#171c26]/60">
              <div className="flex justify-between items-center text-xs">
                <p className="font-medium text-slate-200">Post-Match Spectator Dispersal Egress Plan</p>
                <span className="text-[10px] text-[#c4c5d5]">T-minus 1h 22m</span>
              </div>
              <div className="w-full bg-[#303540] h-1 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#b5c4ff] h-full w-[35%]" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Inclusion & Accessibility Tracking */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col gap-5 border border-white/10 bg-[#303540]/30 min-h-[300px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b5c4ff] text-xl">settings_accessibility</span>
            <h3 className="font-headline-md text-sm font-bold text-white">Inclusion Operations</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-[#171c26] border border-white/5">
              <p className="font-caption text-[10px] text-[#c4c5d5]">Audio Narration</p>
              <p className="font-headline-md text-lg text-[#b5c4ff] font-bold mt-1">124 <span className="text-[10px] font-normal text-[#c4c5d5]">Staff</span></p>
              <div className="mt-1 text-[9px] text-emerald-400 flex items-center gap-1 font-semibold">100% Coverage</div>
            </div>
            
            <div className="p-3 rounded-xl bg-[#171c26] border border-white/5">
              <p className="font-caption text-[10px] text-[#c4c5d5]">Sign Interpreters</p>
              <p className="font-headline-md text-lg text-[#b5c4ff] font-bold mt-1">82 <span className="text-[10px] font-normal text-[#c4c5d5]">Staff</span></p>
              <div className="mt-1 text-[9px] text-[#f2bf52] flex items-center gap-1 font-semibold">⚠️ 2 needed (Gate 9)</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-data-label text-[10px] text-[#c4c5d5] uppercase tracking-wider mb-2">Active Support requests</p>
            
            {/* Request 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#b5c4ff]/20 bg-[#b5c4ff]/5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#b5c4ff]">hearing</span>
                <span className="font-semibold text-slate-200 truncate">ASL Support - Press Box</span>
              </div>
              <span className="font-data-label text-[9px] text-[#b5c4ff] font-bold shrink-0">ASSIGNED</span>
            </div>

            {/* Request 2 */}
            <div 
              onClick={() => setRequestAssigned(true)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                requestAssigned 
                  ? 'border-[#b5c4ff]/20 bg-[#b5c4ff]/5' 
                  : 'border-white/10 hover:border-[#b5c4ff]/30'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#c4c5d5]">blind</span>
                <span className="font-semibold text-slate-200 truncate">Sighted Escort - Gate 2 Ramp</span>
              </div>
              <span className={`font-data-label text-[9px] font-bold shrink-0 ${
                requestAssigned ? 'text-[#b5c4ff]' : 'text-[#f2bf52]'
              }`}>
                {requestAssigned ? 'ASSIGNED' : 'UNASSIGNED'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Top Teams Leaderboard */}
        <div className="col-span-12 lg:col-span-3 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 bg-[#303540]/30 min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#f2bf52] text-xl">stars</span>
              <h3 className="font-headline-md text-sm font-bold text-white">Top Volunteer Teams</h3>
            </div>

            <div className="space-y-2.5">
              {teams.slice(0, 3).map((item, idx) => (
                <div 
                  key={item.name} 
                  onClick={() => {
                    // Quick score increment simulation
                    setTeams(prev => prev.map(t => t.name === item.name ? { ...t, pts: t.pts + 10 } : t));
                  }}
                  className={`flex items-center gap-3 p-2 rounded-xl border text-xs cursor-pointer hover:border-[#f2bf52]/50 transition-all ${
                    idx === 0 
                      ? 'bg-[#f2bf52]/10 border-[#f2bf52]/20' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-[#f2bf52] text-[#261900]' : 'bg-[#303540] text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-[#c4c5d5] truncate">{item.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-data-label font-bold ${idx === 0 ? 'text-[#f2bf52]' : 'text-slate-300'}`}>
                      {item.pts}
                    </p>
                    <p className="text-[9px] text-[#c4c5d5] uppercase font-bold">Pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowAllTeamsModal(true)}
            className="mt-4 w-full py-2 text-[10px] text-[#f2bf52] hover:underline transition-all cursor-pointer font-bold uppercase tracking-wider text-center"
          >
            View All Teams
          </button>
        </div>

      </div>

      {/* Expanded Leaderboard Modal */}
      {showAllTeamsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#171c26] border border-[#b5c4ff]/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-headline-md text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2bf52]">stars</span>
                <span>FIFA 2026 Volunteer Master Leaderboard</span>
              </h4>
              <button 
                onClick={() => setShowAllTeamsModal(false)}
                className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#dee2f1] cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {teams.map((item, idx) => (
                <div 
                  key={item.name} 
                  onClick={() => {
                    // Increment point on click
                    setTeams(prev => prev.map(t => t.name === item.name ? { ...t, pts: t.pts + 15 } : t));
                  }}
                  className="bg-white/5 border border-white/5 hover:border-[#f2bf52]/40 p-3 rounded-xl flex items-start gap-4 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#303540] text-[#f2bf52] font-black text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-200 truncate">{item.name}</p>
                      <p className="font-data-label text-[#f2bf52] font-bold text-xs">{item.pts} Pts</p>
                    </div>
                    <p className="text-[10px] text-[#b5c4ff] font-semibold mt-0.5">{item.role}</p>
                    <p className="text-[10px] text-[#c4c5d5] mt-1 leading-normal">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#b5c4ff]/5 p-3 rounded-xl border border-[#b5c4ff]/20 text-[10px] text-[#b5c4ff] text-center">
              💡 Tip: Click any team card in this list to award them +15 points!
            </div>

            <button 
              onClick={() => setShowAllTeamsModal(false)}
              className="w-full py-2.5 bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] font-bold text-xs rounded-xl border border-white/5 cursor-pointer uppercase tracking-wider"
            >
              Close Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default VolunteerHub;
