import React from 'react';
import { UserCheck, Shield, Stethoscope, Lock, Award, Check } from 'lucide-react';
import { ClinicianUser, UserRole } from '../types/clinical';

export const CLINICIAN_PROFILES: ClinicianUser[] = [
  {
    id: 'DOC-GILL-01',
    name: 'Dr. G. S. Gill',
    role: 'LEAD_CLINICIAN',
    roleTitle: 'Cardio-Physician & Senior Consultant Physician',
    qualifications: 'MBBS, PGDCCP (Non-invasive)',
    department: 'Department of Internal Medicine & Non-invasive Cardiology',
    regNumber: 'MBBS, PGDCCP (Non-invasive)',
    avatarInitials: 'GG',
  },
  {
    id: 'DOC-SHARMA-02',
    name: 'Dr. Ananya Sharma, MD',
    role: 'RESIDENT',
    roleTitle: 'Senior Resident Physician',
    qualifications: 'MBBS, MD',
    department: 'Acute Care & Inpatient Services',
    regNumber: 'DMC-49201',
    avatarInitials: 'AS',
  },
  {
    id: 'NURSE-PRIYA-03',
    name: 'Sister Priya Nair, RN, BSN',
    role: 'TRIAGE_NURSE',
    roleTitle: 'Senior Triage & Resuscitation Officer',
    qualifications: 'BSN, RN',
    department: 'Emergency Triage & Vital Monitoring',
    regNumber: 'INC-88912',
    avatarInitials: 'PN',
  },
  {
    id: 'ADMIN-AUDIT-04',
    name: 'Vikramaditya Seth',
    role: 'ADMIN',
    roleTitle: 'Clinical Audit & Quality Lead',
    qualifications: 'MHA, CPHQ',
    department: 'Hospital Quality Assurance & Governance',
    regNumber: 'QA-GOV-902',
    avatarInitials: 'VS',
  },
];

interface ClinicianAuthModalProps {
  currentUser: ClinicianUser;
  onSelectUser: (user: ClinicianUser) => void;
  onClose: () => void;
}

export const ClinicianAuthModal: React.FC<ClinicianAuthModalProps> = ({
  currentUser,
  onSelectUser,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Clinician Authorization & Role Access</h3>
              <p className="text-xs text-indigo-200">Select active practitioner profile for clinical encounter attribution</p>
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
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            Clinical decision-support actions, emergency overrides, and final care plans will be logged under the selected credentials in the statutory audit log.
          </p>

          <div className="space-y-2.5">
            {CLINICIAN_PROFILES.map((profile) => {
              const isSelected = profile.id === currentUser.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    onSelectUser(profile);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm ${
                      profile.role === 'LEAD_CLINICIAN'
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-800'
                        : profile.role === 'RESIDENT'
                        ? 'bg-gradient-to-br from-sky-600 to-sky-800'
                        : profile.role === 'TRIAGE_NURSE'
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-800'
                        : 'bg-gradient-to-br from-purple-600 to-purple-800'
                    }`}>
                      {profile.avatarInitials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{profile.name}</h4>
                        {profile.qualifications && (
                          <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                            {profile.qualifications}
                          </span>
                        )}
                        {profile.role === 'LEAD_CLINICIAN' && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-200 uppercase">
                            Lead
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{profile.roleTitle}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {profile.department}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 hover:text-indigo-600">
                        Switch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Role-based access control compliant with DISHA & Indian National Digital Health Mission standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
