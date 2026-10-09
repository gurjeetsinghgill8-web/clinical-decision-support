import React from 'react';
import { Printer, Download, Check, Stethoscope, Copy } from 'lucide-react';
import { ClinicalEncounter, ClinicianUser, FinalClinicalPlan } from '../types/clinical';

interface PrintSummaryModalProps {
  encounter: ClinicalEncounter;
  currentUser: ClinicianUser;
  finalPlan?: FinalClinicalPlan;
  onClose: () => void;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({
  encounter,
  currentUser,
  finalPlan,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const [copied, setCopied] = React.useState(false);

  const copyAsText = () => {
    const text = `DR. GILL CLINICAL DECISION SUPPORT - ENCOUNTER SUMMARY
Date: ${new Date().toLocaleDateString()}
Patient: ${encounter.patient.name} (${encounter.patient.id})
Age/Sex: ${encounter.patient.age}Y / ${encounter.patient.sex}

VITALS:
BP: ${encounter.vitals.bpSys}/${encounter.vitals.bpDia} mmHg | HR: ${encounter.vitals.heartRate} bpm | SpO2: ${encounter.vitals.spo2}% | Temp: ${encounter.vitals.temperature}°${encounter.vitals.tempUnit}

CHIEF COMPLAINT:
${encounter.chiefComplaint}

PRIMARY DIAGNOSIS:
${finalPlan?.finalDiagnosis || encounter.analysis?.differential_diagnoses?.[0]?.condition || 'Under Evaluation'}

ORDERED INVESTIGATIONS:
${finalPlan?.orderedInvestigations?.join('\n') || 'None recorded'}

MANAGEMENT & PRESCRIPTION:
${finalPlan?.prescriptions || 'Standard care'}

DISPOSITION:
${finalPlan?.escalationDecision || 'Routine follow-up'}

ATTENDING CLINICIAN:
${currentUser.name} (${currentUser.regNumber})
${currentUser.roleTitle}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold">Printable Clinical Consultation Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAsText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formatted Medical Document */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans print:p-0 print:m-0">
          {/* Clinic Header */}
          <div className="border-b-2 border-indigo-950 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black tracking-tight text-indigo-950">
                DR. GILL CLINICAL DECISION SUPPORT SYSTEM
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                Department of Emergency & Inpatient Medical Services • NABH Accredited
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <p>Encounter: #{encounter.id.slice(0, 8)}</p>
              <p>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Patient Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Patient Name</span>
              <strong className="text-slate-900 text-sm">{encounter.patient.name || 'Unspecified'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">ID / MRN</span>
              <strong className="text-slate-900 font-mono">{encounter.patient.id}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Age / Gender</span>
              <strong className="text-slate-900">{encounter.patient.age} Yrs / {encounter.patient.sex}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Known Allergies</span>
              <strong className="text-rose-700">{encounter.patient.allergies || 'None reported'}</strong>
            </div>
          </div>

          {/* Vitals Summary */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 border-b border-slate-200 pb-1">
              Physiological Vitals on Encounter
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded border">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Blood Pressure</span>
                <span className="font-bold font-mono text-xs">{encounter.vitals.bpSys}/{encounter.vitals.bpDia} mmHg</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Heart Rate</span>
                <span className="font-bold font-mono text-xs">{encounter.vitals.heartRate} bpm</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Oxygen SpO2</span>
                <span className="font-bold font-mono text-xs">{encounter.vitals.spo2}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Temperature</span>
                <span className="font-bold font-mono text-xs">{encounter.vitals.temperature}°{encounter.vitals.tempUnit}</span>
              </div>
            </div>
          </div>

          {/* Clinical Presentation */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Clinical Presentation & History
            </h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {encounter.chiefComplaint || 'No history recorded'}
            </p>
          </div>

          {/* Final Primary Diagnosis */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Primary Working Diagnosis
            </h4>
            <p className="text-sm font-bold text-indigo-950 p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200">
              {finalPlan?.finalDiagnosis || encounter.analysis?.differential_diagnoses?.[0]?.condition || 'Clinical evaluation in progress'}
            </p>
          </div>

          {/* Ordered Investigations */}
          {finalPlan?.orderedInvestigations && finalPlan.orderedInvestigations.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Ordered Diagnostic Investigations
              </h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                {finalPlan.orderedInvestigations.map((test, idx) => (
                  <li key={idx} className="font-medium">{test}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Immediate Prescriptions */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Initial Treatment Plan & Prescriptions
            </h4>
            <p className="font-mono text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-line">
              {finalPlan?.prescriptions || 'Standard protocol'}
            </p>
          </div>

          {/* Disposition */}
          {finalPlan?.escalationDecision && (
            <div className="text-[11px] text-slate-600">
              <strong>Escalation / Disposition:</strong> {finalPlan.escalationDecision}
            </div>
          )}

          {/* Signature Footer */}
          <div className="pt-8 border-t border-slate-300 flex justify-between items-end">
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <p>Electronically Generated via Dr. Gill CDS-AI Engine v1.0</p>
              <p>Audit Hash: {encounter.id}</p>
            </div>

            <div className="text-right">
              <div className="w-40 border-b border-slate-400 mb-1" />
              <p className="font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.roleTitle}</p>
              <p className="text-[10px] text-slate-400 font-mono">{currentUser.regNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
