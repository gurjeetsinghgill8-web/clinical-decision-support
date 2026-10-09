import React from 'react';
import { Sparkles, ArrowRight, HeartPulse, ShieldAlert, Wind, AlertCircle } from 'lucide-react';
import { DEMO_CASES, DemoCase } from '../utils/demoCases';

interface DemoCasesModalProps {
  onSelectCase: (demo: DemoCase) => void;
  onClose: () => void;
}

export const DemoCasesModal: React.FC<DemoCasesModalProps> = ({ onSelectCase, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pre-configured Clinical Scenarios</h3>
              <p className="text-xs text-indigo-200">One-click test cases for emergency red flags & staged diagnostic reasoning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* List of cases */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {DEMO_CASES.map((demo) => (
            <div
              key={demo.id}
              onClick={() => {
                onSelectCase(demo);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">
                      {demo.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${demo.badgeColor}`}>
                      {demo.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {demo.patient.name} ({demo.patient.age}Y / {demo.patient.sex}) • ID: {demo.patient.id}
                  </p>
                </div>

                <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-lg border border-indigo-200 group-hover:border-indigo-600 transition flex items-center gap-1 shrink-0">
                  <span>Load</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 bg-white/70 p-2 rounded-lg border border-slate-100">
                {demo.chiefComplaint}
              </p>

              <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-mono">
                <span>BP: {demo.vitals.bpSys}/{demo.vitals.bpDia} mmHg</span>
                <span>Pulse: {demo.vitals.heartRate} bpm</span>
                <span>SpO2: {demo.vitals.spo2}%</span>
                <span>Temp: {demo.vitals.temperature}°F</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
