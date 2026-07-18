import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StadiumMap } from './StadiumMap';
import { Send, Sparkles, AlertCircle, Info, RefreshCw, MapPin, Clock, Smartphone, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  routeHighlight?: string;
}

interface GateStatus {
  id: string;
  name: string;
  congestion: number;
  waitTime: number;
  status: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const FanDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string>('default');
  const [gatesData, setGatesData] = useState<GateStatus[]>([]);
  const [selectedGateInfo, setSelectedGateInfo] = useState<GateStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live Countdown Timer state
  const [timeRemaining, setTimeRemaining] = useState({ hrs: 2, mins: 14, secs: 15 });
  const [showAR, setShowAR] = useState(false);

  // Tournament Pulse states
  const [pulseEvents, setPulseEvents] = useState([
    { id: '1', icon: '⚽', title: 'GOAL! France (2) - (1) Argentina', desc: "84' • Mbappé scores header", details: 'Kylian Mbappé converts a towering header from a crossing assist down the left wing. Lusail Stadium decibels peak at 104dB.' },
    { id: '2', icon: '🎵', title: 'Fan Zone Live: DJ Snake', desc: 'Doha Sea plaza • Starts in 20m', details: 'Exclusive post-match set. Free entry for all Ticket Holders. Gates open at 21:00 at the main beach plaza.' },
    { id: '3', icon: '⚠️', title: 'Gate 4 Heavy Load Alert', desc: 'Congestion detected. Direct fans to G3.', details: 'Local crowd telemetry reports queue congestion exceeding nominal limits. Dedicated accessible ramp remains fully open.' }
  ]);
  const [selectedPulse, setSelectedPulse] = useState<any | null>(null);

  const simulatePulseEvent = () => {
    const alerts = [
      { id: '4', icon: '⚽', title: 'PENALTY! Argentina awarded kick', desc: "89' • Foul inside box", details: 'USA referee awards a penalty kick after a sliding challenge on Lautaro Martínez. Tensions high at the penalty spot.' },
      { id: '5', icon: '⚽', title: 'GOAL! France (2) - (2) Argentina', desc: "90' • Messi converts penalty!", details: 'Lionel Messi calmly slots the ball into the bottom-right corner. The stadium crowd erupts into chants. Game heads to extra time!' },
      { id: '6', icon: '🟨', title: 'Yellow Card: Romero (ARG)', desc: "93' • Tactical foul", details: 'Romero stops a counter-attack down the right flank. Referee displays a yellow card immediately.' }
    ];
    
    // Pick the next alert in queue
    const nextAlert = alerts.find(a => !pulseEvents.some(p => p.title === a.title));
    if (nextAlert) {
      setPulseEvents(prev => [nextAlert, ...prev]);
    } else {
      alert("All live scenario events have already been simulated!");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { hrs, mins, secs } = prev;
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hrs > 0) {
              hrs--;
            } else {
              clearInterval(timer);
            }
          }
        }
        return { hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(timeRemaining.hrs)}:${pad(timeRemaining.mins)}:${pad(timeRemaining.secs)}`;
  };

  // Load telemetry from backend on load
  const fetchTelemetry = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch(`${API_BASE}/api/stadium/status`);
      if (!res.ok) throw new Error('Failed to fetch stadium status');
      const json = await res.json();
      if (json.status === 'success') {
        setGatesData(json.data.gates);
      }
    } catch (err: any) {
      console.error('Telemetry fetch error:', err);
      setErrorMessage('Stadium telemetry server is currently offline. Running in local simulation mode.');
      setGatesData([
        { id: 'gate_1', name: 'Gate 1 (VIP - North)', congestion: 20, waitTime: 2, status: 'clear' },
        { id: 'gate_2', name: 'Gate 2 (East - Accessible)', congestion: 45, waitTime: 8, status: 'moderate' },
        { id: 'gate_3', name: 'Gate 3 (South)', congestion: 15, waitTime: 2, status: 'clear' },
        { id: 'gate_4', name: 'Gate 4 (West)', congestion: 92, waitTime: 28, status: 'critical' },
        { id: 'gate_5', name: 'Gate 5 (Northeast - Accessible)', congestion: 30, waitTime: 5, status: 'clear' }
      ]);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  // Welcome Chat logic based on language selection
  useEffect(() => {
    let welcome = '';
    if (language === 'es') {
      welcome = "¡Hola Alex! Soy tu asistente oficial de FanPulse 2026. Pregúntame sobre el partido, el acceso para discapacitados, los autobuses de conexión, las colas de las puertas o las restricciones del estadio.";
    } else if (language === 'fr') {
      welcome = "Bonjour Alex ! Je suis votre assistant officiel FanPulse 2026. Posez-moi des questions sur le match, l'accès PMR, les navettes de transit, les files d'attente aux portes ou le règlement du stade.";
    } else {
      welcome = "Hello Alex! I am your official FanPulse 2026 AI Assistant. Ask me about match schedules, wheelchair accessibility, shuttle schedules, gate queues, or stadium safety rules.";
    }

    setMessages([
      {
        id: 'welcome',
        text: welcome,
        sender: 'bot'
      }
    ]);
  }, [language]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    const newMsg: Message = { id: userMsgId, text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, language })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'API query failed');
      }

      const json = await res.json();
      if (json.status === 'success') {
        const botMsg: Message = {
          id: Date.now().toString() + '_bot',
          text: json.data.response,
          sender: 'bot',
          routeHighlight: json.data.routeHighlight
        };
        setMessages(prev => [...prev, botMsg]);
        
        if (json.data.routeHighlight) {
          setActiveHighlight(json.data.routeHighlight);
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      let fallbackText = "I couldn't contact the server. Let me help you locally: ";
      let route = 'default';
      
      const q = textToSend.toLowerCase();
      if (q.includes('gate 4') || q.includes('queue') || q.includes('congest')) {
        fallbackText += "Gate 4 has critical congestion (92% load). Use Gate 3 or Gate 5 for rapid entrance.";
        route = 'gate_4';
      } else if (q.includes('wheelchair') || q.includes('disabled') || q.includes('access') || q.includes('ramp')) {
        fallbackText += "Accessible paths run from Gate 2 and Gate 5 to Sectors A and B.";
        route = 'accessibility_path';
      } else if (q.includes('bag') || q.includes('restrict') || q.includes('bottle')) {
        fallbackText += "Bags must be clear plastic, maximum size 12x12x6 inches. Glass/metal containers are prohibited.";
        route = 'gate_1';
      } else {
        fallbackText += "Express shuttles leave every 4 minutes. Gates open at 15:00, kickoff is at 18:00.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          text: fallbackText,
          sender: 'bot',
          routeHighlight: route
        }
      ]);
      setActiveHighlight(route);
    } finally {
      setLoading(false);
    }
  };

  const handleMapSelection = (zoneId: string) => {
    setActiveHighlight(zoneId);
    const gate = gatesData.find(g => g.id === zoneId);
    if (gate) {
      setSelectedGateInfo(gate);
      
      let queryText = '';
      if (language === 'es') {
        queryText = `Estado de cola y accesos para ${gate.name}`;
      } else if (language === 'fr') {
        queryText = `Statut file d'attente et accès pour ${gate.name}`;
      } else {
        queryText = `Queue status and entry paths for ${gate.name}`;
      }
      handleSend(queryText);
    } else {
      setSelectedGateInfo(null);
    }
  };

  const triggerQuickSuggest = (key: string) => {
    let queryText = '';
    if (key === 'gate') {
      queryText = language === 'es' ? '¿Cómo está la cola en la Puerta 4?' : language === 'fr' ? 'Quel est l\'état de la file à la porte 4 ?' : 'What is the queue status at Gate 4?';
    } else if (key === 'access') {
      queryText = language === 'es' ? 'Rutas accesibles para sillas de ruedas' : language === 'fr' ? 'Accès fauteuil roulant et rampe' : 'Wheelchair accessible pathways and ramps';
    } else if (key === 'bags') {
      queryText = language === 'es' ? '¿Cuáles son las restricciones de bolsas y artículos prohibidos?' : language === 'fr' ? 'Règlement sur les sacs et objets interdits' : 'What is the bag size limit and prohibited items list?';
    } else if (key === 'transit') {
      queryText = language === 'es' ? '¿A qué hora empieza el partido y horarios de transporte?' : language === 'fr' ? 'Horaires du match et navettes de transit' : 'Shuttle train schedules and match kickoff time';
    }
    handleSend(queryText);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Welcome & Match Telemetry Cards */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col gap-1 p-2">
          <p className="font-data-label text-xs text-[#b5c4ff] tracking-widest uppercase">FIFA 2026 COMMAND</p>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-[#dee2f1] font-bold leading-tight">Welcome, Alex</h2>
          <div className="flex items-center gap-2 text-[#c4c5d5] font-caption text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#b5c4ff]" />
            <span>Lusail Stadium, Doha</span>
          </div>
        </div>

        {/* Live Match Card */}
        <div className="relative overflow-hidden rounded-xl bg-[#252a35] border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 rounded-full bg-[#ffb4a9] text-[#690001] font-data-label text-[10px] font-black animate-pulse">LIVE</span>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-center w-1/3">
                <img 
                  className="w-12 h-12 mx-auto mb-2 object-contain drop-shadow-lg" 
                  alt="USA team logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIXkepO1DXUlgxbBKvO4aD14Ud4UDa5YUpfLqsitn3mwzJG6E4OdL505K8B-2R3x3ZJLcFMhzMVjkx3nUSK0yM2jMUNi_ET6UGGv4tA7EVpukppRAIQMEeiQyiJ9mfplWdqLXGPrKghFf2Hj-km6laLGITuz0CVJmA--iMvfumjWIX2EAaZCnfXI-da7bjW1xMP7CviPzBv1bYnYOOctbQlXMCbGL79zWoyt0NlavkCXtXQS4vhZVXLuxbLxlTJ5VY3G-OlxVMKwE"
                />
                <span className="font-headline-md text-sm font-extrabold text-[#dee2f1] block">USA</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="font-headline-lg text-lg text-[#f2bf52] font-black">vs</span>
                <span className="font-data-label text-[10px] text-[#c4c5d5] mt-2">19:30 Local</span>
              </div>
              <div className="text-center w-1/3">
                <img 
                  className="w-12 h-12 mx-auto mb-2 object-contain drop-shadow-lg" 
                  alt="Brazil team logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDdyVKi-DyccL-0gKFIafKn_37gUqFI4LHa5CxysL6IaTqCzqywTxwnTW9Nt8DwRX-Cqt8qge89Xf2p41GONukxWOMqB92nmGbSzW84wME4mQ67NFuBShQq1jMmDJapEQwb_QUHQ8vaOkWDZ82khnFsFazeT_pmzudC7J3sh2fITy3jkV2dTQcNMNpMANsgNtAlmrEp3RBS-CL8e12J81Us4ZTiBLXZ8Fpam---4vBqbyAgaQrvBaJqn8Ars1YWIg3nMu8ga61ApI"
                />
                <span className="font-headline-md text-sm font-extrabold text-[#dee2f1] block">BRA</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3 rounded-lg border-l-4 border-[#b5c4ff]">
                <p className="font-caption text-[10px] text-[#c4c5d5] uppercase">Target Entrance</p>
                <p className="font-headline-md text-base text-[#b5c4ff] font-bold">Gate 4 (West)</p>
              </div>
              <div className="glass-card p-3 rounded-lg border-l-4 border-[#f2bf52]">
                <p className="font-caption text-[10px] text-[#c4c5d5] uppercase">Gate Congestion</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-headline-md text-base text-[#f2bf52] font-bold">Critical</p>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#b5c4ff]/10 p-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#b5c4ff]" />
              <span className="font-data-label text-xs text-[#dee2f1] font-semibold">Countdown: {formatCountdown()}</span>
            </div>
            <button className="font-data-label text-xs text-[#b5c4ff] font-bold uppercase tracking-wider hover:underline cursor-pointer">
              Fast-Pass Entry
            </button>
          </div>
        </div>

        {/* Smart AR Wayfinding card */}
        <div 
          onClick={() => setShowAR(true)}
          className="relative h-44 rounded-xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-50" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuArkGCsQdxK_x-jQz9im19_os5yVPNQqL7DUqm6u6Rw0RbweeA-VBgX55lHpSehF4em7Qq88toJplWvcFLTgZrUKQc3J99nT0vS9LLnCg3rN7r4LbuOq-bOYfe5jng2Cex_8SLyUsgmGQaCqla59N6rZBp_YNZ4oNWCexYX8Df2ieEgbslR7J8lrsj8-xIMhYNxy9wYLlBrbOnK3ViQKhh7K_KUYunV4e31ToaN7ZX_hf3zlmJyC3cdB11RdRoMW3J5OySc02QnMts')` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e131d] via-[#0e131d]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end">
            <div>
              <span className="px-2 py-0.5 bg-[#b5c4ff] text-[#00287d] text-[9px] rounded font-extrabold uppercase mb-1.5 inline-block">New Feature</span>
              <h3 className="font-headline-md text-base font-bold text-white">AR Wayfinding</h3>
              <p className="text-xs text-[#c4c5d5]">Find your seat through your lens</p>
            </div>
            <button className="w-10 h-10 bg-[#b5c4ff] hover:scale-105 active:scale-95 transition-all rounded-full flex items-center justify-center shadow-lg text-[#00287d]">
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tournament Pulse Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-sm font-bold tracking-wide uppercase text-[#dee2f1]">Tournament Pulse</h3>
            <button 
              onClick={() => setSelectedPulse(pulseEvents[0])}
              className="text-[#b5c4ff] font-data-label text-xs hover:underline cursor-pointer"
            >
              View Hub
            </button>
          </div>
          
          <div className="space-y-2.5">
            {pulseEvents.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedPulse(item)}
                className="glass-card p-3.5 rounded-xl flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#303540] rounded-lg flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#dee2f1] truncate group-hover:text-[#b5c4ff] transition-colors">{item.title}</p>
                  <p className="text-[#c4c5d5] text-[10px] mt-0.5 truncate">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#c4c5d5]" />
              </div>
            ))}
          </div>

          <button
            onClick={simulatePulseEvent}
            className="w-full py-2 bg-[#303540]/60 hover:bg-[#b5c4ff]/10 text-xs font-semibold text-[#b5c4ff] border border-white/5 rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
          >
            ⚡ Simulate Match Alert Event
          </button>
        </div>

      </div>

      {/* Center Column: Smart AI Assistant Chat Panel */}
      <div className="xl:col-span-5 flex flex-col h-[640px] glass-panel rounded-2xl p-5 shadow-2xl relative overflow-hidden border border-white/10">
        
        <div className="flex items-center justify-between border-b border-[#444653]/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#b5c4ff]/10 p-2 rounded-xl text-[#b5c4ff] border border-white/5">
              <Sparkles className="w-5 h-5 text-[#b5c4ff] animate-pulse" />
            </div>
            <div>
              <h3 className="font-headline-md text-sm font-bold text-white">FIFA AI Assistant</h3>
              <p className="text-[10px] text-[#b5c4ff]">Multi-lingual stadium guide</p>
            </div>
          </div>
          <button 
            onClick={fetchTelemetry}
            className="p-1.5 rounded-lg hover:bg-[#303540]/40 text-[#c4c5d5] hover:text-[#b5c4ff] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-2 text-[10px] text-red-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scroll-smooth" aria-live="polite">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#003399] text-white rounded-tr-none border border-[#b5c4ff]/20'
                    : 'bg-[#171c26]/90 text-[#dee2f1] border border-white/5 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>
                {msg.routeHighlight && msg.routeHighlight !== 'default' && (
                  <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-[#b5c4ff]">
                    <Info className="w-3 h-3" />
                    <span>Highlighted: <strong>{msg.routeHighlight.toUpperCase().replace('_', ' ')}</strong></span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#171c26]/90 border border-white/5 rounded-xl rounded-tl-none px-3.5 py-2.5 text-xs text-[#c4c5d5] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#b5c4ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#b5c4ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#b5c4ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[10px]">{t('consulting')}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          <button
            onClick={() => triggerQuickSuggest('gate')}
            className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-[#303540]/30 hover:bg-[#b5c4ff]/10 hover:border-[#b5c4ff]/40 text-[#c4c5d5] cursor-pointer"
          >
            🔥 {t('suggestGate')}
          </button>
          <button
            onClick={() => triggerQuickSuggest('access')}
            className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-[#303540]/30 hover:bg-[#b5c4ff]/10 hover:border-[#b5c4ff]/40 text-[#c4c5d5] cursor-pointer"
          >
            ♿ {t('suggestAccess')}
          </button>
          <button
            onClick={() => triggerQuickSuggest('bags')}
            className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-[#303540]/30 hover:bg-[#b5c4ff]/10 hover:border-[#b5c4ff]/40 text-[#c4c5d5] cursor-pointer"
          >
            🎒 {t('suggestBags')}
          </button>
        </div>

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 pt-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI guide anything..."
            className="flex-1 glass-input rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#b5c4ff] focus:outline-none"
            maxLength={1000}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#003399] hover:bg-[#153ea3] disabled:opacity-40 disabled:hover:bg-[#003399] p-2.5 rounded-full text-white cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Right Column: Interactive Map Panel */}
      <div className="xl:col-span-3 space-y-6">
        <div className="glass-panel rounded-2xl p-5 shadow-2xl border border-white/10">
          <h3 className="font-headline-md text-sm font-bold text-[#dee2f1] mb-1">{t('mapHeader')}</h3>
          <p className="text-[10px] text-[#c4c5d5] mb-4">{t('mapSub')}</p>

          <StadiumMap
            highlightZone={activeHighlight}
            onGateSelect={handleMapSelection}
            gatesData={gatesData}
          />
        </div>

        {selectedGateInfo && (
          <div className="glass-panel rounded-2xl p-4 border border-[#b5c4ff]/30 shadow-lg glow-purple transition-all duration-300">
            <h4 className="font-bold text-xs text-[#dee2f1] flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                selectedGateInfo.congestion >= 80 ? 'bg-[#ef4444] animate-ping' :
                selectedGateInfo.congestion >= 40 ? 'bg-[#f2bf52]' : 'bg-[#00cc66]'
              }`} />
              {selectedGateInfo.name}
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div className="bg-[#171c26] p-2.5 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#c4c5d5] block mb-0.5">Crowd Load</span>
                <span className={`font-bold ${
                  selectedGateInfo.congestion >= 80 ? 'text-[#ffb4a9]' :
                  selectedGateInfo.congestion >= 40 ? 'text-[#f2bf52]' : 'text-emerald-400'
                }`}>
                  {selectedGateInfo.congestion}%
                </span>
              </div>
              <div className="bg-[#171c26] p-2.5 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#c4c5d5] block mb-0.5">Est. Queue</span>
                <span className="font-bold text-[#dee2f1]">
                  {selectedGateInfo.waitTime} min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AR Camera Simulation Modal Overlay */}
      {showAR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#171c26] border border-[#b5c4ff]/30 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Mock Camera Feed Background */}
            <div 
              className="w-full aspect-video bg-cover bg-center relative"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540747737956-37872404a8de?q=80&w=1200')` }}
            >
              {/* Radial Camera Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
              
              {/* Interactive HUD */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-[9px] text-[#00cc66] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 bg-[#00cc66] rounded-full animate-ping" />
                AR ENGAGED • GPS CALIBRATED • 120 FPS
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowAR(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer uppercase shadow-md border border-red-500/20"
              >
                Exit AR
              </button>

              {/* Floating 3D Arrows & Directives Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                
                {/* Bouncing Target Reticle */}
                <div className="w-24 h-24 border-2 border-dashed border-[#b5c4ff] rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }} />
                
                {/* 3D Arrow */}
                <div className="text-[#f2bf52] text-3xl font-black mt-3 animate-bounce">
                  ▲
                </div>
                
                <div className="bg-black/80 border border-[#b5c4ff]/40 p-3.5 rounded-xl text-center shadow-lg mt-2 max-w-xs">
                  <p className="text-xs font-black text-[#b5c4ff] uppercase tracking-wider">PATH FINDER ENGAGED</p>
                  <p className="text-[11px] text-white mt-1">Walk 15 meters straight towards <strong>Concourse Gate 4</strong></p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Turn right at Sector C, Row 12, Seat 24</p>
                </div>
              </div>
            </div>
            
            {/* Footer walkthrough guide */}
            <div className="bg-[#171c26] p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <span className="text-[#c4c5d5]">
                📱 Point your smartphone camera at indicators around the stadium concourse.
              </span>
              <button 
                onClick={() => setShowAR(false)}
                className="w-full sm:w-auto py-2 px-5 bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] font-bold rounded-lg border border-[#b5c4ff]/20 cursor-pointer uppercase text-[10px]"
              >
                Okay, Got it
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tournament Pulse Event Details Modal */}
      {selectedPulse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#171c26] border border-[#b5c4ff]/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-headline-md text-sm font-bold text-white flex items-center gap-2">
                <span className="text-base">{selectedPulse.icon}</span>
                <span>Tournament Pulse Event</span>
              </h4>
              <button 
                onClick={() => setSelectedPulse(null)}
                className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#dee2f1] cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#f2bf52]">{selectedPulse.title}</h3>
              <p className="text-[11px] text-[#c4c5d5] font-semibold">{selectedPulse.desc}</p>
              <div className="bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs text-[#dee2f1] leading-relaxed">
                {selectedPulse.details}
              </div>
            </div>

            <button 
              onClick={() => setSelectedPulse(null)}
              className="w-full py-2.5 bg-[#003399] hover:bg-[#153ea3] text-[#b5c4ff] font-bold text-xs rounded-xl border border-white/5 cursor-pointer uppercase tracking-wider"
            >
              Okay, Dismiss Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
