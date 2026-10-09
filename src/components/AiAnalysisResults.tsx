import React from 'react';
import { 
  AlertTriangle, ShieldCheck, Microscope, FileText, CheckCircle, 
  HelpCircle, ChevronRight, Stethoscope, AlertOctagon, BookOpen, Layers
} from 'lucide-react';
import { ComprehensiveCaseAnalysis, CandidateDiagnosis, StagedInvestigationPlan } from '../types/clinical';
import { Language, TRANSLATIONS } from '../utils/translations';
import { InvestigationPlanView } from './InvestigationPlanView';

interface AiAnalysisResultsProps {
  analysis: ComprehensiveCaseAnalysis;
  orderedTests: string[];
  onToggleOrderTest: (testName: string) => void;
  language: Language;
}

export const AiAnalysisResults: React.FC<AiAnalysisResultsProps> = ({
  analysis,
  orderedTests,
  onToggleOrderTest,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const { emergency_screen, case_summary, differential_diagnoses, investigation_plan, decision_branches, evidence_sources } = analysis;

  return (
    <div className="space-y-6">
      {/* 1. Emergency Safety Screening Panel */}
      {emergency_screen && emergency_screen.isEmergency && (
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white p-5 rounded-2xl shadow-xl border-2 border-red-400">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0">
              <AlertOctagon className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/40 text-amber-300 tracking-wider">
                  STAT RED FLAG TRIGGERED
                </span>
                <h3 className="text-base font-extrabold tracking-tight">
                  Deterministic Safety Screener: Level 1 Emergency
                </h3>
              </div>
              <p className="text-xs text-red-100 font-medium">
                {emergency_screen.escalationProtocol}
              </p>

              {/* Triggers & Immediate actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 bg-black/20 rounded-xl space-y-1">
                  <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block">
                    Triggered Findings:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-white/95">
                    {emergency_screen.triggers.map((trig, i) => (
                      <li key={i}>{trig}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-black/20 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider block">
                    Immediate Resuscitative Actions:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-white/95">
                    {emergency_screen.immediateActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[10px] text-amber-200/90 font-mono pt-1">
                {emergency_screen.neverDelayCareNotice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Structured Case Summary (Distinguishing Positive, Absent, Unknown findings) */}
      {case_summary && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Verified Structured Patient Summary
            </h3>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">
              Provenance: Clinician Ingested
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Confirmed Positive */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Confirmed Positive Findings:
              </span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {case_summary.confirmedPositiveFindings?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifically Absent */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Specifically Absent (Pertinent Negatives):
              </span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {case_summary.specificallyAbsentFindings?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unknown or Unrecorded */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1.5">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Unrecorded / Unknown Information:
              </span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {case_summary.unknownOrUnrecordedInfo?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Prioritized Differential Diagnoses */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Prioritized Differential Diagnoses (DDx)
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by clinical urgency, physiological danger if missed, and evidence match
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            {differential_diagnoses?.length || 0} Candidates Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {differential_diagnoses?.map((item: CandidateDiagnosis, idx: number) => {
            const isEmergency = item.priority === 'Emergency';
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEmergency
                    ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
                    : 'bg-slate-50/60 border-slate-200/90'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900">{item.condition}</h4>
                        {item.icd10 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200/80 text-slate-700">
                            ICD-10: {item.icd10}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isEmergency
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                      Urgency: {item.urgency}
                    </span>
                  </div>
                </div>

                {/* Danger if missed */}
                <div className="mt-3 p-2.5 bg-white/80 rounded-xl border border-slate-200 text-xs text-rose-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-900 font-bold">Danger if missed:</strong>{' '}
                    <span>{item.dangerIfMissed}</span>
                  </div>
                </div>

                {/* Clinical Rationale & Next action */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/70 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">Clinical Reasoning:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{item.clinicalRationale}</p>
                  </div>
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-950 block">Recommended Next Action:</span>
                    <p className="text-indigo-900 text-[11px] font-medium leading-relaxed">{item.recommendedNextAction}</p>
                  </div>
                </div>

                {/* Supporting, Contradictory & Missing */}
                <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1">Supporting Findings:</span>
                    <ul className="space-y-0.5 text-slate-600">
                      {item.supportingFindings?.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Contradictory Findings:</span>
                    <ul className="space-y-0.5 text-slate-500">
                      {item.contradictoryFindings?.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 block mb-1">Important Missing Info:</span>
                    <ul className="space-y-0.5 text-slate-600">
                      {item.importantUnknowns?.map((u, i) => (
                        <li key={i}>• {u}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evidence source & Limitations footer */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-2">
                  <span className="flex items-center gap-1 text-slate-600">
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    <strong>Guideline Reference:</strong> {item.evidenceSource}
                  </span>
                  <span>Limitations: {item.limitations}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Staged Investigation Plan */}
      {investigation_plan && (
        <InvestigationPlanView
          plan={investigation_plan}
          orderedTests={orderedTests}
          onToggleOrderTest={onToggleOrderTest}
          language={language}
        />
      )}

      {/* 5. Decision Branches */}
      {decision_branches && decision_branches.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Clinical Decision Pathways</h4>
          </div>

          <div className="space-y-2">
            {decision_branches.map((b, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-indigo-900 block">Scenario: {b.scenario}</span>
                <p className="text-slate-700 text-[11px] flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span><strong>Mandated Action:</strong> {b.clinicalAction}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-[11px] leading-relaxed border border-slate-200">
        <p className="font-semibold text-slate-700 mb-0.5">Statutory Decision-Support Notice:</p>
        <p>{analysis.disclaimer}</p>
        <p className="mt-1 text-[10px] text-slate-400 font-mono">
          Engine: {analysis.aiEngine || 'Gemini 3.8 Flash'} • Knowledge Version: {analysis.knowledge_version}
        </p>
      </div>
    </div>
  );
};
