import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { LanguageType } from '../context/LanguageContext';
import { Trophy, Globe, Activity, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: 'fan' | 'ops';
  setActiveTab: (tab: 'fan' | 'ops') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: LanguageType) => {
    setLanguage(lang);
  };

  return (
    <header className="glass-panel border-b border-indigo-950 p-6 rounded-b-3xl shadow-lg relative overflow-hidden mb-8">
      {/* Decorative accent background banner */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        {/* Branding & Logo */}
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-2xl glow-gold text-slate-950">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Qatar FIFA 2026
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Live Telemetry Connected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              {t('appTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{t('subTitle')}</p>
          </div>
        </div>

        {/* Action Controls (Tabs & Language Selection) */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Mode Switcher */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-indigo-950/80 flex" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'fan'}
              aria-controls="tabpanel-fan"
              onClick={() => setActiveTab('fan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'fan'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {t('fanMode')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'ops'}
              aria-controls="tabpanel-ops"
              onClick={() => setActiveTab('ops')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ops'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {t('opsMode')}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-indigo-950/60">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex gap-1.5">
              {(['en', 'es', 'fr'] as LanguageType[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-[10px] font-black uppercase px-2 py-1 rounded transition-colors cursor-pointer ${
                    language === lang
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label={`Switch language to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
