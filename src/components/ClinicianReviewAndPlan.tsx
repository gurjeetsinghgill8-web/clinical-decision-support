import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit3, Award, FileSignature, ShieldAlert, Send, Printer } from 'lucide-react';
import { CandidateDiagnosis, FinalClinicalPlan, ClinicianUser } from '../types/clinical';
import { Language } from '../utils/translations';

interface ClinicianReviewAndPlanProps {
  differentials: CandidateDiagnosis[];
  orderedTests: string[];
  currentUser: ClinicianUser;
  onUpdateDifferentials: (updated: CandidateDiagnosis[]) => void;
  onSignEncounter: (finalPlan: FinalClinicalPlan) => void;
  onOpenPrintModal: () => void;
  isSigned: boolean;
  language: Language;
}

export const ClinicianReviewAndPlan: React.FC<ClinicianReviewAndPlanProps> = ({
  differentials,
  orderedTests,
  currentUser,
  onUpdateDifferentials,
  onSignEncounter,
  onOpenPrintModal,
  isSigned,
  language,
}) => {
  const [workingDifferentials, setWorkingDifferentials] = useState<CandidateDiagnosis[]>(differentials);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState(
    differentials[0]?.condition || ''
  );
  const [prescriptions, setPrescriptions] = useState(
    '1. Tab. Aspirin 300mg oral chewable STAT\n2. Tab. Clopidogrel 300mg loading dose\n3. High-flow oxygen to maintain SpO2 >94%'
  );
  const [disposition, setDisposition] = useState('Immediate CCU / Cardiac Catheterization Admission');
  const [followUp, setFollowUp] = useState('Continuous ECG telemetric monitoring. Repeat hs-Troponin in 2 hours.');

  const handleSetStatus = (index: number, status: 'ACCEPTED' | 'REJECTED' | 'MODIFIED') => {
    const updated = [...workingDifferentials];
    updated[index].clinicianStatus = status;
    setWorkingDifferentials(updated);
    onUpdateDifferentials(updated);
  };

  const handleSetOverrideNote = (index: number, note: string) => {
    const updated = [...workingDifferentials];
    updated[index].clinicianOverrideNote = note;
    setWorkingDifferentials(updated);
    onUpdateDifferentials(updated);
  };

  const handleSignOff = () => {
    const finalPlan: FinalClinicalPlan = {
      signedBy: currentUser.name,
      signedAt: new Date().toISOString(),
      clinicianRole: currentUser.roleTitle,
      finalDiagnosis: primaryDiagnosis,
      prescriptions,
      orderedInvestigations: orderedTests,
      escalationDecision: disposition,
      followUpInstructions: followUp,
      isSigned: true,
    };
    onSignEncounter(finalPlan);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Clinician Review, Differential Override & Final Plan
            </h3>
            <p className="text-xs text-slate-500">
              Independent clinician validation of AI recommendations with statutory electronic sign-off
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPrintModal}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600" />
          <span>Print / Export Summary</span>
        </button>
      </div>

      {/* Differential Evaluation Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          1. Candidate Diagnosis Validation Matrix
        </h4>
        <div className="space-y-3">
          {workingDifferentials.map((diff, idx) => {
            const status = diff.clinicianStatus || 'PENDING';
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  status === 'ACCEPTED'
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : status === 'REJECTED'
                    ? 'bg-rose-50/40 border-rose-200 opacity-75'
                    : status === 'MODIFIED'
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">#{diff.rank}</span>
                      <h5 className="text-sm font-bold text-slate-900">{diff.condition}</h5>
                      {diff.icd10 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                          {diff.icd10}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{diff.clinicalRationale}</p>
                  </div>

                  {/* Clinician Decision Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSetStatus(idx, 'ACCEPTED')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1 ${
                        status === 'ACCEPTED'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStatus(idx, 'REJECTED')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1 ${
                        status === 'REJECTED'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStatus(idx, 'MODIFIED')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1 ${
                        status === 'MODIFIED'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modify</span>
                    </button>
                  </div>
                </div>

                {/* Clinician Override Input */}
                {status !== 'PENDING' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                    <input
                      type="text"
                      value={diff.clinicianOverrideNote || ''}
                      onChange={(e) => handleSetOverrideNote(idx, e.target.value)}
                      placeholder="Doctor's rationale for acceptance/rejection (e.g. Ruled out by normal bedside ECG, or Primary working diagnosis)..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400 font-medium"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Treatment & Disposition Plan Form */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          2. Final Clinical Decision & Care Plan
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Primary Working Diagnosis (Attending Doctor)
            </label>
            <input
              type="text"
              value={primaryDiagnosis}
              onChange={(e) => setPrimaryDiagnosis(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Escalation / Disposition Pathway
            </label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-medium text-slate-800 outline-none"
            >
              <option value="Immediate CCU / Cardiac Catheterization Admission">Immediate CCU / Cath Lab Resuscitation</option>
              <option value="Emergency Department High-Dependency Observation">Emergency Department HDU Observation</option>
              <option value="Inpatient Ward Admission">Inpatient Medical / Surgical Ward</option>
              <option value="Outpatient Discharge with 48h Follow-up">Discharge with Outpatient Follow-up</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Immediate Medications & Prescriptions
          </label>
          <textarea
            rows={3}
            value={prescriptions}
            onChange={(e) => setPrescriptions(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-mono text-slate-800 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Follow-up Protocols & Safety Net Instructions
          </label>
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Attending Clinician Signature Block */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold tracking-wide uppercase text-indigo-300">
              Electronic Signature Attestation
            </span>
          </div>
          <p className="text-sm font-bold text-white mt-1">
            {currentUser.name} ({currentUser.regNumber})
          </p>
          <p className="text-xs text-slate-400">
            {currentUser.roleTitle} • {currentUser.department}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOff}
          disabled={isSigned}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition ${
            isSigned
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isSigned ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Signed & Archived</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Sign & Commit Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
