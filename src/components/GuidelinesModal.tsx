import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ClinicalGuideline } from '../types/clinical';

interface GuidelinesModalProps {
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ onClose }) => {
  const [guidelines, setGuidelines] = useState<ClinicalGuideline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/guidelines')
      .then((res) => res.json())
      .then((data) => {
        setGuidelines(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Approved Clinical Knowledge-Base & Protocols</h3>
              <p className="text-xs text-indigo-200">Controlled, versioned library of peer-reviewed clinical guidelines used by CDS-AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-500 font-medium">
            AI recommendations are grounded strictly in the following activated guidelines. Unverified sources and synthetic hallucinations are suppressed.
          </p>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-slate-400 py-8 text-xs">Loading approved knowledge library...</p>
            ) : (
              guidelines.map((g) => (
                <div
                  key={g.id}
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{g.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{g.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-indigo-900 font-medium mt-0.5">
                        {g.organization} • Version {g.version} (Published {g.publicationDate})
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 shrink-0">
                      {g.evidenceLevel}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <strong className="text-slate-800">Core Directive:</strong> {g.keyRecommendation}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong>Applicability:</strong> {g.applicability}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
