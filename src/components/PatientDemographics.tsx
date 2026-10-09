import React from 'react';
import { User, AlertOctagon, History, Pill, RefreshCw, Check } from 'lucide-react';
import { PatientData } from '../types/clinical';
import { Language, TRANSLATIONS } from '../utils/translations';

interface PatientDemographicsProps {
  patient: PatientData;
  onChange: (updated: PatientData) => void;
  language: Language;
}

const COMMON_ALLERGIES = ['Penicillin', 'Sulfa Drugs', 'NSAIDs / Aspirin', 'Cephalosporins', 'No Known Allergies (NKDA)'];
const COMMON_COMORBIDITIES = ['Hypertension', 'Type 2 Diabetes', 'Coronary Artery Disease', 'Bronchial Asthma', 'Chronic Kidney Disease', 'Dyslipidemia'];

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient,
  onChange,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const generateNewId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    onChange({ ...patient, id: `GILL-${randomNum}` });
  };

  const handleFieldChange = (field: keyof PatientData, value: string) => {
    onChange({ ...patient, [field]: value });
  };

  const toggleAllergyChip = (allergy: string) => {
    const current = patient.allergies.trim();
    if (allergy.includes('No Known Allergies')) {
      onChange({ ...patient, allergies: 'NKDA (No Known Drug Allergies)' });
      return;
    }
    if (current.includes(allergy)) {
      // Remove
      const filtered = current
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== allergy && s !== '')
        .join(', ');
      onChange({ ...patient, allergies: filtered });
    } else {
      // Add
      const next = current && !current.includes('NKDA') ? `${current}, ${allergy}` : allergy;
      onChange({ ...patient, allergies: next });
    }
  };

  const toggleComorbidityChip = (item: string) => {
    const current = patient.pastHistory.trim();
    if (current.includes(item)) {
      const filtered = current
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== item && s !== '')
        .join(', ');
      onChange({ ...patient, pastHistory: filtered });
    } else {
      const next = current ? `${current}, ${item}` : item;
      onChange({ ...patient, pastHistory: next });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {t.patientTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.patientSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateNewId}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'नई ID बनाएं' : 'New ID'}</span>
        </button>
      </div>

      {/* Primary Demographics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {/* Patient ID */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
            <span>{t.patientId}</span>
            <span className="text-[10px] text-slate-400 font-mono">REQ</span>
          </label>
          <input
            type="text"
            value={patient.id}
            onChange={(e) => handleFieldChange('id', e.target.value)}
            placeholder="GILL-001"
            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-mono font-medium text-slate-800 text-sm transition"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">
            {t.patientName}
          </label>
          <input
            type="text"
            value={patient.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder={language === 'hi' ? 'मरीज का नाम' : 'e.g. John Doe / Amit Kumar'}
            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-slate-800 text-sm transition"
          />
        </div>

        {/* Age & Sex */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              {t.age}
            </label>
            <input
              type="number"
              min="0"
              max="125"
              value={patient.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              placeholder="45"
              className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-slate-800 text-sm transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              {t.sex}
            </label>
            <select
              value={patient.sex}
              onChange={(e) => handleFieldChange('sex', e.target.value as any)}
              className="w-full px-2.5 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-slate-800 text-sm transition"
            >
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">
            {t.weight}
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={patient.weight || ''}
            onChange={(e) => handleFieldChange('weight', e.target.value)}
            placeholder="70"
            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-slate-800 text-sm transition"
          />
        </div>
      </div>

      {/* Allergies & Comorbidities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Allergies */}
        <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.allergies}</span>
            </label>
          </div>
          <input
            type="text"
            value={patient.allergies}
            onChange={(e) => handleFieldChange('allergies', e.target.value)}
            placeholder={t.allergiesPlaceholder}
            className="w-full px-3 py-2 bg-white border border-rose-200 focus:border-rose-400 rounded-lg text-xs font-medium text-rose-950 outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ALLERGIES.map((item) => {
              const active = patient.allergies.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAllergyChip(item)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 ${
                    active
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-rose-800 hover:bg-rose-100/80 border border-rose-200'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Past History & Comorbidities */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.pastHistory}</span>
          </label>
          <input
            type="text"
            value={patient.pastHistory}
            onChange={(e) => handleFieldChange('pastHistory', e.target.value)}
            placeholder={t.pastHistoryPlaceholder}
            className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-400 rounded-lg text-xs font-medium text-slate-800 outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {COMMON_COMORBIDITIES.map((item) => {
              const active = patient.pastHistory.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleComorbidityChip(item)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="p-3.5 bg-indigo-50/40 border border-indigo-100/80 rounded-xl space-y-1.5">
        <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.medications}</span>
        </label>
        <input
          type="text"
          value={patient.currentMedications}
          onChange={(e) => handleFieldChange('currentMedications', e.target.value)}
          placeholder={t.medicationsPlaceholder}
          className="w-full px-3 py-2 bg-white border border-indigo-200 focus:border-indigo-400 rounded-lg text-xs font-medium text-slate-800 outline-none"
        />
      </div>
    </div>
  );
};
