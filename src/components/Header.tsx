import React from 'react';
import { Activity, Volume2, VolumeX, FolderArchive, Sparkles, UserPlus, Globe } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDemoCases: () => void;
  onOpenArchive: () => void;
  onNewEncounter: () => void;
  archiveCount: number;
  hasActiveEmergency: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isMuted,
  onToggleMute,
  onOpenDemoCases,
  onOpenArchive,
  onNewEncounter,
  archiveCount,
  hasActiveEmergency,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 sticky top-0 z-40 shadow-lg backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
              hasActiveEmergency 
                ? 'bg-rose-600 animate-pulse text-white ring-2 ring-rose-400' 
                : 'bg-indigo-600 text-white ring-1 ring-indigo-400/30'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
              hasActiveEmergency ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                DR. GILL <span className="text-indigo-400 text-sm font-semibold tracking-normal">CDS-AI</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Sound Alarm Toggle */}
          <button
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border rounded-lg transition ${
              isMuted
                ? 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700'
                : 'bg-indigo-950/80 text-indigo-300 border-indigo-700 hover:bg-indigo-900'
            }`}
            title={isMuted ? t.audioMuted : t.audioActive}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden md:inline">{isMuted ? t.audioMuted : t.audioActive}</span>
          </button>

          {/* Demo Cases Preset */}
          <button
            onClick={onOpenDemoCases}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.demoCases}</span>
          </button>

          {/* Patient Archive */}
          <button
            onClick={onOpenArchive}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition relative"
          >
            <FolderArchive className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.archive}</span>
            {archiveCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-indigo-500 text-white rounded-full font-mono font-bold">
                {archiveCount}
              </span>
            )}
          </button>

          {/* New Patient */}
          <button
            onClick={onNewEncounter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.newEncounter}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
