import React, { useState } from 'react';
import { FolderArchive, Search, User, Calendar, ArrowRight, Trash2, Download } from 'lucide-react';
import { ClinicalEncounter } from '../types/clinical';
import { Language } from '../utils/translations';

interface PatientArchiveModalProps {
  encounters: ClinicalEncounter[];
  onSelectEncounter: (encounter: ClinicalEncounter) => void;
  onDeleteEncounter: (id: string) => void;
  onClose: () => void;
  language: Language;
}

export const PatientArchiveModal: React.FC<PatientArchiveModalProps> = ({
  encounters,
  onSelectEncounter,
  onDeleteEncounter,
  onClose,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = encounters.filter(
    (e) =>
      e.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(encounters, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `DrGill_CDS_Patient_Archive_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <FolderArchive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Patient Encounter Archive & Records</h3>
              <p className="text-xs text-indigo-200">Search previous patient encounters, reload findings, or export clinical records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient Name, ID / MRN, or Chief Complaint..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-800"
            />
          </div>

          {encounters.length > 0 && (
            <button
              onClick={downloadAllJson}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
              title="Export all encounters as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export JSON</span>
            </button>
          )}
        </div>

        {/* Encounters List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FolderArchive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-500">No Patient Encounters Found</p>
              <p className="mt-1">Saved clinical encounters will appear here for subsequent follow-up.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.patient.name || 'Unnamed Patient'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 font-bold">
                      {item.patient.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.patient.age}Y • {item.patient.sex}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    <strong>Complaint:</strong> {item.chiefComplaint || 'None documented'}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>Date: {new Date(item.date).toLocaleDateString()}</span>
                    <span>BP: {item.vitals.bpSys}/{item.vitals.bpDia}</span>
                    <span>HR: {item.vitals.heartRate} bpm</span>
                    <span>SpO2: {item.vitals.spo2}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectEncounter(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteEncounter(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
