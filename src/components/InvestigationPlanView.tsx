import React, { useState } from 'react';
import { Microscope, ArrowRight, ShieldCheck, CheckSquare, Square, Info, Sparkles } from 'lucide-react';
import { StagedInvestigationPlan, StageInvestigation } from '../types/clinical';
import { Language } from '../utils/translations';

interface InvestigationPlanViewProps {
  plan: StagedInvestigationPlan;
  orderedTests: string[];
  onToggleOrderTest: (testName: string) => void;
  language: Language;
}

export const InvestigationPlanView: React.FC<InvestigationPlanViewProps> = ({
  plan,
  orderedTests,
  onToggleOrderTest,
  language,
}) => {
  const [activeStage, setActiveStage] = useState<'stage1' | 'stage2' | 'stage3'>('stage1');

  const stage1Count = plan.stage1_bedside?.length || 0;
  const stage2Count = plan.stage2_highValueLabs?.length || 0;
  const stage3Count = plan.stage3_targetedImaging?.length || 0;

  const currentList =
    activeStage === 'stage1'
      ? plan.stage1_bedside
      : activeStage === 'stage2'
      ? plan.stage2_highValueLabs
      : plan.stage3_targetedImaging;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Staged Diagnostic Workup & Decision Branches
            </h3>
            <p className="text-xs text-slate-500">
              Sequenced investigations with rationale, result branches, and interpretation guardrails
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Selected for Order: <strong className="text-indigo-600">{orderedTests.length}</strong> tests
        </span>
      </div>

      {/* Stage Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
        <button
          onClick={() => setActiveStage('stage1')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeStage === 'stage1'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Stage 1: Bedside STAT</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
            {stage1Count}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('stage2')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeStage === 'stage2'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Stage 2: High-Value Labs</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
            {stage2Count}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('stage3')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeStage === 'stage3'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Stage 3: Targeted Imaging</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
            {stage3Count}
          </span>
        </button>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {(!currentList || currentList.length === 0) && (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            No specific investigations flagged in this stage for the present clinical profile.
          </div>
        )}

        {currentList?.map((item, idx) => {
          const isOrdered = orderedTests.includes(item.exactInvestigation);
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isOrdered
                  ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-slate-50/50 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleOrderTest(item.exactInvestigation)}
                    className="mt-0.5 text-indigo-600 hover:text-indigo-800 transition shrink-0"
                    title={isOrdered ? 'Remove from clinician order' : 'Select for clinician order'}
                  >
                    {isOrdered ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.exactInvestigation}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {item.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-700">Clinical Question:</strong> {item.clinicalQuestion}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleOrderTest(item.exactInvestigation)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition shrink-0 ${
                    isOrdered
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isOrdered ? 'Ordered' : '+ Order'}
                </button>
              </div>

              {/* Rationale & Limitations */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 block">Why Useful:</span>
                  <p className="text-slate-600">{item.whyUseful}</p>
                </div>
                {item.interpretationLimitations && (
                  <div className="space-y-0.5">
                    <span className="font-semibold text-amber-800 flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-600" />
                      Interpretation Limitations:
                    </span>
                    <p className="text-slate-600">{item.interpretationLimitations}</p>
                  </div>
                )}
              </div>

              {/* Result Branches (Decision logic) */}
              {item.resultBranches && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 bg-white/70 p-3 rounded-lg border border-slate-100 space-y-2 text-[11px]">
                  <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                    Diagnostic Decision Branches:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2 bg-emerald-50/60 rounded border border-emerald-100">
                      <span className="font-bold text-emerald-800 block">If Positive:</span>
                      <p className="text-slate-700 text-[10px] mt-0.5">{item.resultBranches.positive}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-700 block">If Negative:</span>
                      <p className="text-slate-600 text-[10px] mt-0.5">{item.resultBranches.negative}</p>
                    </div>
                    <div className="p-2 bg-amber-50/60 rounded border border-amber-100">
                      <span className="font-bold text-amber-800 block">If Inconclusive:</span>
                      <p className="text-slate-700 text-[10px] mt-0.5">{item.resultBranches.inconclusive}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
