import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

export const InclusiveHub: React.FC = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [assistanceDispatched, setAssistanceDispatched] = useState(false);
  const [stewardEta, setStewardEta] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio player settings states
  const [showSettings, setShowSettings] = useState(false);
  const [backingVolume, setBackingVolume] = useState(30);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  // ASL interpreter states
  const [aslText, setAslText] = useState('');
  const [aslTranslation, setAslTranslation] = useState('Elevator 4B is located 20 meters behind you. Follow the blue accessibility track.');
  const [aslTranslating, setAslTranslating] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);

  // Stop TTS if user navigates away
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update background audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = backingVolume / 100;
    }
  }, [backingVolume]);

  const toggleAudio = () => {
    const nextPlaying = !isAudioPlaying;
    setIsAudioPlaying(nextPlaying);

    if (nextPlaying) {
      // Play backing audio stream
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn("Backing audio autoplay was deferred by browser policy:", err);
        });
      }
      
      // Speak the match description using browser speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // clear queue
        const matchDescription = "Narrator Sarah reporting live: Brazil is setting up a counter-attack down the right flank. The winger is sprinting past the midfield, but a USA defender makes a sliding tackle to clear the ball out of bounds.";
        const utterance = new SpeechSynthesisUtterance(matchDescription);
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleRequestAssistance = () => {
    setAssistanceDispatched(true);
    setStewardEta(Math.floor(Math.random() * 3) + 2); // Random 2-4 mins ETA
    setTimeout(() => {
      setAssistanceDispatched(false);
      setStewardEta(null);
    }, 8000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Audio and Sign Language streams */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Brand Anchor */}
        <div className="flex flex-col gap-1 p-1">
          <h2 className="font-headline-lg text-2xl md:text-3xl text-[#b5c4ff] font-extrabold tracking-tighter leading-none">
            INCLUSIVE HUB
          </h2>
          <p className="font-body-md text-sm text-[#c4c5d5]">Accessibility &amp; Inclusion Services • Lusail Stadium</p>
        </div>

        {/* Live Audio Description Module */}
        <div className="glass-card rounded-xl p-5 flex flex-col gap-4 border border-white/10 relative overflow-hidden bg-[#303540]/30">
          <audio 
            ref={audioRef} 
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
            loop 
            preload="auto"
          />
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#f2bf52] text-xl">audio_description</span>
              <h3 className="font-headline-md text-base font-bold text-white">Live Match Audio</h3>
            </div>
            <div className="px-2.5 py-0.5 bg-[#f2bf52]/20 text-[#f2bf52] rounded text-[10px] font-black tracking-widest flex items-center gap-1 uppercase">
              <span className={`w-1.5 h-1.5 bg-[#f2bf52] rounded-full ${isAudioPlaying ? 'animate-pulse' : ''}`}></span>
              {isAudioPlaying ? 'Streaming' : 'Standby'}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#171c26]/60 rounded-full p-2 border border-white/5">
            <button 
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isAudioPlaying 
                  ? 'bg-[#f2bf52] text-[#261900] shadow-[0_0_15px_rgba(242,191,82,0.4)]' 
                  : 'bg-[#003399] text-white shadow-[0_0_10px_rgba(0,51,153,0.3)]'
              }`}
              aria-label={isAudioPlaying ? "Pause Audio Feed" : "Play Audio Feed"}
            >
              <span className="material-symbols-outlined text-2xl font-black">
                {isAudioPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="flex-1 overflow-hidden">
              <p className="font-data-label text-xs text-[#dee2f1] font-semibold truncate">
                Narrator: AI-Sarah • USA vs BRA
              </p>
              
              {/* Equalizer Visualizer (animated when active) */}
              <div className="flex gap-1 items-end h-6 mt-1.5">
                <div className={`w-1 bg-[#b5c4ff] rounded-full h-1.5 ${isAudioPlaying ? 'animate-[bounce_1.2s_infinite]' : ''}`} />
                <div className={`w-1 bg-[#b5c4ff]/80 rounded-full h-3 ${isAudioPlaying ? 'animate-[bounce_1s_infinite]' : ''}`} style={{ animationDelay: '0.2s' }} />
                <div className={`w-1 bg-[#b5c4ff] rounded-full h-4.5 ${isAudioPlaying ? 'animate-[bounce_0.8s_infinite]' : ''}`} style={{ animationDelay: '0.4s' }} />
                <div className={`w-1 bg-[#b5c4ff]/70 rounded-full h-2.5 ${isAudioPlaying ? 'animate-[bounce_1.1s_infinite]' : ''}`} style={{ animationDelay: '0.1s' }} />
                <div className={`w-1 bg-[#b5c4ff]/90 rounded-full h-3.5 ${isAudioPlaying ? 'animate-[bounce_0.9s_infinite]' : ''}`} style={{ animationDelay: '0.3s' }} />
                <div className={`w-1 bg-[#b5c4ff]/60 rounded-full h-2 ${isAudioPlaying ? 'animate-[bounce_1.3s_infinite]' : ''}`} style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                showSettings ? 'bg-[#b5c4ff]/20 text-white' : 'text-[#c4c5d5] hover:text-white'
              }`}
              aria-label="Audio settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Settings Panel */}
          {showSettings && (
            <div className="bg-[#171c26]/90 p-4 rounded-xl border border-white/5 space-y-4 animate-fade-in text-xs z-10">
              <h4 className="font-bold text-[#b5c4ff] flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                <span className="material-symbols-outlined text-xs">settings</span>
                Audio Narration Settings
              </h4>
              
              {/* Backing track volume slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[#dee2f1] text-[10px]">
                  <span>Backing Crowd Ambiance Volume</span>
                  <span className="font-bold text-[#f2bf52]">{backingVolume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={backingVolume}
                  onChange={(e) => setBackingVolume(Number(e.target.value))}
                  className="w-full accent-[#b5c4ff] h-1 bg-[#303540] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Narration speed */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#c4c5d5] block">Narration Speed</span>
                  <div className="flex gap-1">
                    {([0.8, 1.0, 1.2, 1.5] as number[]).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          setSpeechRate(rate);
                          // If playing, re-speak to apply settings
                          if (isAudioPlaying && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const desc = "Live description adjusted. Ready.";
                            const ut = new SpeechSynthesisUtterance(desc);
                            ut.rate = rate;
                            ut.pitch = speechPitch;
                            window.speechSynthesis.speak(ut);
                          }
                        }}
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          speechRate === rate 
                            ? 'bg-[#003399] text-white border border-[#b5c4ff]/30' 
                            : 'bg-[#303540]/60 text-[#c4c5d5] border border-transparent'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narration pitch */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#c4c5d5] block">Narrator Pitch</span>
                  <div className="flex gap-1">
                    {([0.8, 1.0, 1.2] as number[]).map((pitch, idx) => (
                      <button
                        key={pitch}
                        type="button"
                        onClick={() => {
                          setSpeechPitch(pitch);
                          if (isAudioPlaying && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const desc = "Narrator pitch adjusted. Ready.";
                            const ut = new SpeechSynthesisUtterance(desc);
                            ut.rate = speechRate;
                            ut.pitch = pitch;
                            window.speechSynthesis.speak(ut);
                          }
                        }}
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          speechPitch === pitch 
                            ? 'bg-[#003399] text-white border border-[#b5c4ff]/30' 
                            : 'bg-[#303540]/60 text-[#c4c5d5] border border-transparent'
                        }`}
                      >
                        {idx === 0 ? 'Low' : idx === 1 ? 'Med' : 'High'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#c4c5d5] italic bg-black/20 p-2.5 rounded-lg border border-white/5">
            "{isAudioPlaying 
              ? 'Currently describing: Brazil setting up a counter-attack down the right flank, USA defender sliding to clear.' 
              : 'Audio description standby. Tap the play button to connect to the live narrator feed.'}"
          </p>
        </div>

        {/* AI Sign Language Assistant */}
        <div className="glass-card rounded-xl overflow-hidden border border-white/10 bg-[#303540]/30">
          <div className="bg-[#b5c4ff]/10 p-3.5 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b5c4ff] text-xl">sign_language</span>
              <h3 className="font-headline-md text-sm font-bold text-white">ASL / Sign Assistant</h3>
            </div>
            <span className="material-symbols-outlined text-[#c4c5d5] text-sm cursor-pointer">open_in_full</span>
          </div>

          <div className="relative aspect-video bg-black">
            <img 
              className="w-full h-full object-cover opacity-80" 
              alt="ASL virtual steward stream" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbLE-jwhuF2r1EvZOuPcPjaU6JUVIFnWxxtHbxvcKz3s5XIERA4ieGHeOWCukPHZJsEzZGBDGT1IkWVvy6fxmjIT7PACSaEMtg_E7RwbND0u2VGGSxj4RBI487XwhxS2plmW3T3Xj9LWErcWr5sZoOUWzBRaHzT9NX3eP7x2ZpwZiOwu9j3QDLuj8_TevgpaGbUoN-Zrf4l9hdaV3WQQlfGwbq-0jRC-XFwD0v86_vWCDuIXzjVuNb03v4DvI0-lWkYESJX_ieIQM"
            />
            {aslTranslating && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-10 animate-fade-in">
                <span className="material-symbols-outlined text-3xl text-[#b5c4ff] animate-spin">sync</span>
                <span className="text-[10px] text-[#b5c4ff] uppercase font-bold tracking-widest">Translating to ASL...</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <p className="font-body-md text-white text-xs text-center font-medium leading-relaxed">
                "{aslTranslation}"
              </p>
            </div>
          </div>

          {/* Interactive Translation Input */}
          <div className="p-3 border-t border-white/5 bg-[#171c26]/60">
            <div className="flex gap-2">
              <input
                type="text"
                value={aslText}
                onChange={(e) => setAslText(e.target.value)}
                placeholder="Type announcements or questions to translate..."
                className="flex-1 bg-[#303540]/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-[#b5c4ff] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!aslText.trim()) return;
                  setAslTranslating(true);
                  setTimeout(() => {
                    setAslTranslation(aslText);
                    setAslTranslating(false);
                    setAslText('');
                  }, 1200);
                }}
                disabled={aslTranslating || !aslText.trim()}
                className="px-3.5 py-1.5 bg-[#003399] hover:bg-[#153ea3] disabled:opacity-50 text-[#b5c4ff] font-bold text-xs rounded-lg border border-white/5 cursor-pointer uppercase tracking-wider"
              >
                Translate
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Pathfinding and Sensory alerts */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Accessible Wayfinding Map */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-sm font-bold tracking-wide uppercase text-white">Accessible Wayfinding</h3>
            <button 
              onClick={() => setShowExpandedMap(true)}
              className="text-[#b5c4ff] font-bold text-xs hover:underline cursor-pointer"
            >
              EXPAND MAP
            </button>
          </div>

          <div 
            onClick={() => setShowExpandedMap(true)}
            className="glass-card rounded-xl h-64 relative overflow-hidden border border-white/10 cursor-pointer group"
          >
            {/* Map background image */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center opacity-65" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6QKbCGD-ESW_zR8wjnnlYEdX_gJeY2apurwuB583YS19oeBeVk9DTLTo8DL74XSR12jSjhDnyU_Gj06HX9hRX99YF9quf_0DyIwHtK1bInIvNdldNhuyMdCT6H-7OD88PvPPe0LNWry1NwynixTnMrZEU4Jny4Jzvk15md9gq3fIByAcUDOpzaTIZyoBl7lsD66FrMje3Pq6ZCYkZ3jGxQOxm-52vPZmXKNGn4Nk4GONFsd618JCqqb8qcuuFH2fcx9WxX05nZHI')` }} 
            />
            
            {/* Overlaid UI labels */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="bg-[#171c26]/90 backdrop-blur-md p-2 rounded-lg flex items-center gap-2 text-[#dee2f1] text-[10px] font-bold border border-white/5 shadow-md">
                <span className="material-symbols-outlined text-[#f2bf52] text-sm">elevator</span>
                ELEVATOR 4B (OPERATIONAL)
              </div>
              <div className="bg-[#171c26]/90 backdrop-blur-md p-2 rounded-lg flex items-center gap-2 text-[#dee2f1] text-[10px] font-bold border border-white/5 shadow-md">
                <span className="material-symbols-outlined text-[#b5c4ff] text-sm">bedtime</span>
                QUIET ZONE (SECTOR 102)
              </div>
            </div>

            {/* Glowing location pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#b5c4ff]/30 rounded-full animate-ping"></div>
                <div className="w-4.5 h-4.5 bg-[#b5c4ff] rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sensory Alerts Feed */}
        <div className="flex flex-col gap-3">
          <h3 className="font-headline-md text-sm font-bold tracking-wide uppercase text-[#dee2f1]">Sensory Status</h3>
          <div className="grid grid-cols-1 gap-2.5">
            
            {/* Loud noise item */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252a35] border-l-4 border-[#c00205] border-y border-r border-white/5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#c00205]/10 flex items-center justify-center text-[#ffb4ab] shrink-0">
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-white">High Decibel alert</h4>
                  <span className="text-[9px] text-[#ffb4ab] font-extrabold px-1.5 py-0.5 rounded bg-[#c00205]/20">NOW</span>
                </div>
                <p className="text-[11px] text-[#c4c5d5] mt-1">Goal celebration. Noise levels peaked at 108dB in Sectors 112-115.</p>
              </div>
            </div>

            {/* Light strobe item */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252a35] border-l-4 border-[#f2bf52] border-y border-r border-white/5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#f2bf52]/10 flex items-center justify-center text-[#f2bf52] shrink-0">
                <span className="material-symbols-outlined text-lg">flare</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-white">Light Sensitivity Trigger</h4>
                  <span className="text-[9px] text-[#f2bf52] font-extrabold px-1.5 py-0.5 rounded bg-[#f2bf52]/20">IN 12 MIN</span>
                </div>
                <p className="text-[11px] text-[#c4c5d5] mt-1">Strobe effect drone show scheduled at half-time. Light filters suggested.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Steward Button */}
        <div className="pt-2">
          <button 
            onClick={handleRequestAssistance}
            disabled={assistanceDispatched}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer text-sm font-bold uppercase tracking-wider ${
              assistanceDispatched 
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                : 'bg-[#c00205] text-[#ffcdc5] border border-red-500/20 hover:brightness-110 active:scale-95 duration-100 emergency-pulse'
            }`}
          >
            <span className="material-symbols-outlined text-xl font-bold">
              {assistanceDispatched ? 'check_circle' : 'emergency_share'}
            </span>
            <span>{assistanceDispatched ? 'STEWARD DISPATCHED' : 'REQUEST STEWARD ASSISTANCE'}</span>
          </button>
          
          {assistanceDispatched && (
            <div className="mt-3 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 animate-bounce">
              <strong>Steward dispatched!</strong> Steward arriving at your seat coordinate in ~{stewardEta} mins.
            </div>
          )}
          
          <p className="text-center text-[10px] text-[#c4c5d5] mt-2 px-8">
            Tapping this will instantly alert the nearest stadium accessibility steward to your GPS seating location.
          </p>
        </div>

      </div>

      {/* Expanded Wayfinding Map Modal */}
      {showExpandedMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#171c26] border border-[#b5c4ff]/30 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-[#1e2330] p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b5c4ff] text-xl">map</span>
                <h3 className="font-headline-md text-sm font-bold text-white uppercase tracking-wider">
                  Stadium Accessibility Master Map
                </h3>
              </div>
              <button 
                onClick={() => setShowExpandedMap(false)}
                className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold cursor-pointer uppercase transition-colors"
              >
                Close Map
              </button>
            </div>

            {/* Map Canvas */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center">
              <img 
                className="w-full h-full object-cover opacity-75" 
                alt="Detailed stadium accessibility map layout" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6QKbCGD-ESW_zR8wjnnlYEdX_gJeY2apurwuB583YS19oeBeVk9DTLTo8DL74XSR12jSjhDnyU_Gj06HX9hRX99YF9quf_0DyIwHtK1bInIvNdldNhuyMdCT6H-7OD88PvPPe0LNWry1NwynixTnMrZEU4Jny4Jzvk15md9gq3fIByAcUDOpzaTIZyoBl7lsD66FrMje3Pq6ZCYkZ3jGxQOxm-52vPZmXKNGn4Nk4GONFsd618JCqqb8qcuuFH2fcx9WxX05nZHI"
              />

              {/* Pins & Waypoints Overlay */}
              <div className="absolute inset-0 p-6 pointer-events-none">
                
                {/* Pin 1: Elevator 4B */}
                <div className="absolute top-[30%] left-[25%] bg-[#171c26]/90 border border-emerald-500/30 p-2 rounded-xl text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xl animate-bounce">
                  <span className="material-symbols-outlined text-emerald-400 text-xs">elevator</span>
                  <span>Elevator 4B (Ramp A Entrance)</span>
                </div>

                {/* Pin 2: Sensory quiet room */}
                <div className="absolute top-[50%] left-[60%] bg-[#171c26]/90 border border-[#b5c4ff]/30 p-2 rounded-xl text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xl">
                  <span className="material-symbols-outlined text-[#b5c4ff] text-xs">bedtime</span>
                  <span>Sensory Room (Sector 102)</span>
                </div>

                {/* Pin 3: Accessible Gate 2 */}
                <div className="absolute top-[75%] left-[45%] bg-[#171c26]/90 border border-[#f2bf52]/30 p-2 rounded-xl text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xl">
                  <span className="material-symbols-outlined text-[#f2bf52] text-xs">accessible</span>
                  <span>Gate 2 (Accessible Ramp G3)</span>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 p-3 rounded-lg text-[9px] text-[#c4c5d5] space-y-1.5">
                  <p className="font-bold text-white uppercase text-[8px] tracking-widest border-b border-white/5 pb-1">Master Legend</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Elevators (Wheelchair Priority)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#b5c4ff]" />
                    <span>Quiet Zones (Sensory decompression)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f2bf52]" />
                    <span>Steward Help Desks</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#171c26] p-4 border-t border-white/10 flex justify-between items-center text-xs text-[#c4c5d5]">
              <span>♿ Real-time GPS tracking and transit routes are synchronized with Doha Metro.</span>
              <button 
                onClick={() => setShowExpandedMap(false)}
                className="py-2 px-5 bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] font-bold rounded-lg border border-[#b5c4ff]/20 cursor-pointer uppercase text-[10px]"
              >
                Return to Hub
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default InclusiveHub;
