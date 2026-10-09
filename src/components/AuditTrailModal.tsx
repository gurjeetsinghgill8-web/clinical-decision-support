import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, Filter, RefreshCw, FileText } from 'lucide-react';
import { AuditLogItem } from '../types/clinical';

interface AuditTrailModalProps {
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filterAction === 'ALL'
    ? logs
    : logs.filter(l => l.action.includes(filterAction));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Clinical Audit Trail & Access Logs</h3>
              <p className="text-xs text-indigo-200">Statutory immutable record of clinician decisions, emergency triggers, and AI runs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Recorded Actions</option>
              <option value="EMERGENCY">Emergency Triggers</option>
              <option value="ANALYSIS">AI Analyses</option>
              <option value="OCR">Document OCR Extractions</option>
              <option value="SIGN">Clinician Sign-offs</option>
            </select>
          </div>

          <button
            onClick={fetchLogs}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Refresh Logs
          </button>
        </div>

        {/* Log List */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1 font-mono text-xs">
          {loading ? (
            <p className="text-center text-slate-400 py-8">Loading audit trail...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No matching audit logs found.</p>
          ) : (
            filteredLogs.map((log) => {
              const isEmerg = log.action.includes('EMERGENCY');
              const isSign = log.action.includes('SIGN');
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                    isEmerg
                      ? 'bg-rose-50/60 border-rose-200'
                      : isSign
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-500 font-sans">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[9px] uppercase ${
                        isEmerg ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                      <span className="font-semibold text-slate-800">{log.user} ({log.role})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-800 font-sans text-xs pt-0.5">{log.details}</p>
                  <p className="text-[10px] text-slate-400">Log ID: {log.id} {log.patientId ? `• Patient: ${log.patientId}` : ''}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
