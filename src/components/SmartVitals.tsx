import React from 'react';
import { Heart, Activity, Wind, Thermometer, AlertCircle, Gauge, Flame, Sparkles } from 'lucide-react';
import { VitalsData } from '../types/clinical';
import { Language, TRANSLATIONS } from '../utils/translations';

interface SmartVitalsProps {
  vitals: VitalsData;
  onChange: (updated: VitalsData) => void;
  language: Language;
}

export const SmartVitals: React.FC<SmartVitalsProps> = ({
  vitals,
  onChange,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const handleUpdate = (field: keyof VitalsData, val: any) => {
    onChange({ ...vitals, [field]: val });
  };

  const bpSys = parseInt(vitals.bpSys || '0', 10);
  const bpDia = parseInt(vitals.bpDia || '0', 10);
  const hr = parseInt(vitals.heartRate || '0', 10);
  const spo2 = parseInt(vitals.spo2 || '100', 10);
  const temp = parseFloat(vitals.temperature || '98.6');
  const rr = parseInt(vitals.respiratoryRate || '16', 10);
  const pain = parseInt(vitals.painScore || '0', 10);

  // Computed MAP
  let mapValue = 0;
  if (bpSys > 0 && bpDia > 0) {
    mapValue = Math.round(bpDia + (bpSys - bpDia) / 3);
  }

  // BP status
  let bpStatus = { label: 'Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isCritical: false };
  if (bpSys >= 180 || bpDia >= 120) {
    bpStatus = { label: 'Hypertensive Crisis', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (bpSys > 0 && (bpSys < 90 || bpDia < 60)) {
    bpStatus = { label: 'Hypotension (Shock Risk)', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (bpSys >= 140 || bpDia >= 90) {
    bpStatus = { label: 'Stage 2 Hypertension', color: 'text-amber-800 bg-amber-50 border-amber-200', isCritical: false };
  } else if (bpSys >= 130 || bpDia >= 80) {
    bpStatus = { label: 'Stage 1 Hypertension', color: 'text-amber-700 bg-amber-50 border-amber-200', isCritical: false };
  } else if (bpSys >= 120) {
    bpStatus = { label: 'Elevated BP', color: 'text-blue-700 bg-blue-50 border-blue-200', isCritical: false };
  }

  // HR status
  let hrStatus = { label: 'Normal Rhythm', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isCritical: false };
  if (hr > 130) {
    hrStatus = { label: 'Severe Tachycardia', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (hr > 100) {
    hrStatus = { label: 'Tachycardia', color: 'text-amber-800 bg-amber-50 border-amber-200', isCritical: false };
  } else if (hr > 0 && hr < 45) {
    hrStatus = { label: 'Severe Bradycardia', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (hr > 0 && hr < 60) {
    hrStatus = { label: 'Bradycardia', color: 'text-blue-700 bg-blue-50 border-blue-200', isCritical: false };
  }

  // SpO2 status
  let spo2Status = { label: 'Adequate Oxygenation', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isCritical: false };
  if (spo2 > 0 && spo2 < 92) {
    spo2Status = { label: 'Severe Hypoxemia (<92%)', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (spo2 >= 92 && spo2 <= 94) {
    spo2Status = { label: 'Mild Hypoxemia (92-94%)', color: 'text-amber-800 bg-amber-50 border-amber-200', isCritical: false };
  }

  // Temp status
  const tempF = vitals.tempUnit === 'C' ? (temp * 9) / 5 + 32 : temp;
  let tempStatus = { label: 'Afebrile / Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isCritical: false };
  if (tempF >= 102.5) {
    tempStatus = { label: 'High Pyrexia (Severe Fever)', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (tempF >= 100.4) {
    tempStatus = { label: 'Febrile', color: 'text-amber-800 bg-amber-50 border-amber-200', isCritical: false };
  } else if (tempF < 95.0 && tempF > 0) {
    tempStatus = { label: 'Hypothermia', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  }

  // Respiratory rate status
  let rrStatus = { label: 'Normal (12-20)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isCritical: false };
  if (rr > 26) {
    rrStatus = { label: 'Severe Tachypnea (>26)', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  } else if (rr > 20) {
    rrStatus = { label: 'Mild Tachypnea', color: 'text-amber-800 bg-amber-50 border-amber-200', isCritical: false };
  } else if (rr > 0 && rr < 10) {
    rrStatus = { label: 'Bradypnea (<10)', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold', isCritical: true };
  }

  // Calculate quick NEWS2 score approximation
  let newsScore = 0;
  if (rr <= 8 || rr >= 25) newsScore += 3;
  else if (rr >= 21) newsScore += 2;
  else if (rr >= 9 && rr <= 11) newsScore += 1;

  if (spo2 <= 91) newsScore += 3;
  else if (spo2 <= 93) newsScore += 2;
  else if (spo2 <= 95) newsScore += 1;

  if (bpSys <= 90 || bpSys >= 220) newsScore += 3;
  else if (bpSys <= 100) newsScore += 2;
  else if (bpSys <= 110) newsScore += 1;

  if (hr <= 40 || hr >= 131) newsScore += 3;
  else if (hr >= 111) newsScore += 2;
  else if (hr <= 50 || hr >= 91) newsScore += 1;

  if (tempF <= 95.0 || tempF >= 102.4) newsScore += 2;
  else if (tempF <= 96.8 || tempF >= 100.6) newsScore += 1;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header & NEWS2 badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {t.vitalsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.vitalsSubtitle}
            </p>
          </div>
        </div>

        {/* Early Warning Score indicator */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs ${
            newsScore >= 7
              ? 'bg-red-50 text-red-700 border-red-300 font-bold'
              : newsScore >= 5
              ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <Gauge className="w-3.5 h-3.5" />
            <span>NEWS2 Score: <strong>{newsScore}</strong></span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70">
              {newsScore >= 7 ? 'High Risk' : newsScore >= 5 ? 'Medium Risk' : 'Low Risk'}
            </span>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          bpStatus.isCritical 
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
            : 'bg-slate-50/60 border-slate-200/80 hover:border-indigo-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className={`w-3.5 h-3.5 ${bpStatus.isCritical ? 'text-rose-600' : 'text-indigo-600'}`} />
              <span>Blood Pressure</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block">Systolic</label>
              <input
                type="number"
                value={vitals.bpSys}
                onChange={(e) => handleUpdate('bpSys', e.target.value)}
                placeholder="120"
                className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block">Diastolic</label>
              <input
                type="number"
                value={vitals.bpDia}
                onChange={(e) => handleUpdate('bpDia', e.target.value)}
                placeholder="80"
                className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-1 text-[11px]">
            <span className={`px-2 py-0.5 rounded-md border text-[10px] ${bpStatus.color}`}>
              {bpStatus.label}
            </span>
            {mapValue > 0 && (
              <span className="text-[10px] text-slate-500 font-mono">
                MAP: {mapValue}
              </span>
            )}
          </div>
        </div>

        {/* Heart Rate / Pulse Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          hrStatus.isCritical 
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
            : 'bg-slate-50/60 border-slate-200/80 hover:border-indigo-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Activity className={`w-3.5 h-3.5 ${hrStatus.isCritical ? 'text-rose-600' : 'text-rose-500'}`} />
              <span>{t.heartRate}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">bpm</span>
          </div>

          <input
            type="number"
            value={vitals.heartRate}
            onChange={(e) => handleUpdate('heartRate', e.target.value)}
            placeholder="72"
            className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
          />

          <div className="mt-3">
            <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] ${hrStatus.color}`}>
              {hrStatus.label}
            </span>
          </div>
        </div>

        {/* SpO2 Oxygenation Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          spo2Status.isCritical 
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
            : 'bg-slate-50/60 border-slate-200/80 hover:border-indigo-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Wind className={`w-3.5 h-3.5 ${spo2Status.isCritical ? 'text-rose-600' : 'text-sky-500'}`} />
              <span>Oxygen SpO2</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">%</span>
          </div>

          <input
            type="number"
            min="50"
            max="100"
            value={vitals.spo2}
            onChange={(e) => handleUpdate('spo2', e.target.value)}
            placeholder="98"
            className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
          />

          <div className="mt-3">
            <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] ${spo2Status.color}`}>
              {spo2Status.label}
            </span>
          </div>
        </div>

        {/* Body Temperature Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          tempStatus.isCritical 
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
            : 'bg-slate-50/60 border-slate-200/80 hover:border-indigo-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Thermometer className={`w-3.5 h-3.5 ${tempStatus.isCritical ? 'text-rose-600' : 'text-amber-500'}`} />
              <span>Temperature</span>
            </span>
            <div className="flex rounded-md border border-slate-200 overflow-hidden text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleUpdate('tempUnit', 'F')}
                className={`px-1.5 py-0.5 transition ${
                  vitals.tempUnit === 'F' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                °F
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('tempUnit', 'C')}
                className={`px-1.5 py-0.5 transition ${
                  vitals.tempUnit === 'C' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                °C
              </button>
            </div>
          </div>

          <input
            type="number"
            step="0.1"
            value={vitals.temperature}
            onChange={(e) => handleUpdate('temperature', e.target.value)}
            placeholder={vitals.tempUnit === 'F' ? '98.6' : '37.0'}
            className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
          />

          <div className="mt-3">
            <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] ${tempStatus.color}`}>
              {tempStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Parameters: Respiratory Rate & Pain Score Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Respiratory Rate */}
        <div className={`p-4 rounded-xl border ${
          rrStatus.isCritical ? 'bg-rose-50 border-rose-300' : 'bg-slate-50/50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.respiratoryRate}</span>
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] ${rrStatus.color}`}>
              {rrStatus.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="60"
              value={vitals.respiratoryRate}
              onChange={(e) => handleUpdate('respiratoryRate', e.target.value)}
              placeholder="16"
              className="w-24 text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none font-mono"
            />
            <span className="text-xs text-slate-500">
              Normal resting adult: 12 - 20 breaths/min
            </span>
          </div>
        </div>

        {/* Pain Scale (0-10 VAS) */}
        <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Pain Intensity (VAS: 0 - 10)</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              pain >= 7
                ? 'bg-rose-100 text-rose-800'
                : pain >= 4
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pain === 0 ? 'No Pain (0)' : pain < 4 ? `Mild (${pain})` : pain < 7 ? `Moderate (${pain})` : `Severe (${pain})`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="10"
              value={pain}
              onChange={(e) => handleUpdate('painScore', e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-sm text-slate-800 w-6 text-center">
              {pain}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
