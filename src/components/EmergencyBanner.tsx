import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language } from '../utils/translations';

interface EmergencyBannerProps {
  reasons: string[];
  acknowledged: boolean;
  onAcknowledge: () => void;
  language: Language;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  reasons,
  acknowledged,
  onAcknowledge,
  language,
}) => {
  if (reasons.length === 0 || acknowledged) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-2xl shadow-xl border-2 border-red-400/80 mb-6 animate-pulse transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-white/20 rounded-xl shrink-0 backdrop-blur-md">
            <ShieldAlert className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black/30 rounded text-[10px] font-black tracking-widest uppercase text-amber-300 border border-amber-300/40">
                STAT EMERGENCY
              </span>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                {language === 'hi' ? 'आपातकालीन क्लिनिकल चेतावनी (Critical Alert)' : 'CRITICAL CLINICAL ALERT'}
              </h2>
            </div>
            <p className="text-xs text-red-100 mt-0.5">
              {language === 'hi'
                ? 'तत्काल क्लिनिकल हस्तक्षेप और डॉक्टर के ध्यान की आवश्यकता है:'
                : 'Immediate hemodynamic stabilization and physician intervention required:'}
            </p>
            <ul className="mt-2 space-y-1">
              {reasons.map((r, i) => (
                <li key={i} className="text-xs font-semibold flex items-center gap-1.5 text-white/95">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onAcknowledge}
          className="self-stretch sm:self-auto px-4 py-2 bg-white text-red-700 hover:bg-red-50 active:scale-95 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'पुष्टि करें (Acknowledge)' : 'Acknowledge Alert'}</span>
        </button>
      </div>
    </div>
  );
};
