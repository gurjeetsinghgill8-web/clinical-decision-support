import React, { useState } from 'react';
import { Rocket, Download, ExternalLink, CheckCircle2, AlertCircle, FileArchive, GitBranch, Key, Loader2, Sparkles } from 'lucide-react';

interface StreamlitDeployModalProps {
  onClose: () => void;
}

export const StreamlitDeployModal: React.FC<StreamlitDeployModalProps> = ({ onClose }) => {
  const [token, setToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ success: boolean; message: string; repoUrl?: string } | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);

  const githubUploadUrl = "https://github.com/gurjeetsinghgill8-web/DR.-GILL-Clinical-Decision-Support-Emergency-Triage-System/upload/main";
  const githubRepoUrl = "https://github.com/gurjeetsinghgill8-web/DR.-GILL-Clinical-Decision-Support-Emergency-Triage-System";
  const tokenGenUrl = "https://github.com/settings/tokens/new?scopes=repo&description=Dr-Gill-CDS-Sync";

  const handlePushToGithub = async () => {
    if (!token.trim()) {
      setPushError('Please paste your GitHub Personal Access Token (starts with ghp_ or github_pat_)');
      return;
    }

    setIsPushing(true);
    setPushError(null);
    setPushStatus(null);

    try {
      const res = await fetch('/api/github-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.trim(),
          repoOwner: 'gurjeetsinghgill8-web',
          repoName: 'DR.-GILL-Clinical-Decision-Support-Emergency-Triage-System',
          branch: 'main',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to push to GitHub');
      }

      setPushStatus({
        success: true,
        message: 'Successfully pushed all code directly to your GitHub repository!',
        repoUrl: data.repoUrl || githubRepoUrl,
      });
    } catch (err: any) {
      setPushError(err.message || 'An error occurred during git push');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">GitHub Sync & Deploy Center</h3>
              <p className="text-xs text-rose-100">डॉ. गिल क्लिनिकल सिस्टम को GitHub पर अपडेट करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed overflow-y-auto max-h-[75vh]">
          {/* Method 1: Automated 1-Click Server Push */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-700" />
                <span className="font-bold text-indigo-950 text-sm">
                  तरीका 1: डायरेक्ट 1-क्लिक GitHub ऑटो-पुश (Recommended)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto
              </span>
            </div>

            <p className="text-slate-600 text-xs">
              आपको कोई कमांड नहीं चलानी! बस अपना GitHub Access Token यहाँ पेस्ट करें और नीचे हरा बटन दबाएं। बैकएंड सर्वर तुरंत <strong>app.py</strong>, <strong>requirements.txt</strong> और पूरा कोड आपकी रिपॉजिटरी में पुश कर देगा:
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  GitHub Personal Access Token (PAT):
                </label>
                <a
                  href={tokenGenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-bold underline flex items-center gap-1"
                >
                  टोकन नहीं है? यहाँ 1-क्लिक से बनाएं <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handlePushToGithub}
                disabled={isPushing}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
              >
                {isPushing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Pushing code to GitHub repository...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Push All Code to GitHub Now (खुद ब खुद)</span>
                  </>
                )}
              </button>

              {pushStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{pushStatus.message}</p>
                    <a
                      href={pushStatus.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 underline font-semibold mt-1 inline-block"
                    >
                      View updated repository on GitHub →
                    </a>
                  </div>
                </div>
              )}

              {pushError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="font-medium text-xs break-all">{pushError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Explanation banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">ब्राउज़र में पहले क्या गलती हुई थी?</p>
              <p className="mt-0.5 text-amber-800 text-[11px]">
                ब्राउज़र ने फाइल को <code className="bg-amber-200/70 px-1 py-0.5 rounded font-mono font-bold text-rose-900">app.py.html</code> बना दिया था। Streamlit में चलने के लिए उसका नाम शुद्ध <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold text-emerald-900">app.py</code> होना आवश्यक है।
              </p>
            </div>
          </div>

          {/* Method 2: Download ZIP */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">
                  तरीका 2: बिना टोकन के ZIP फाइल डाउनलोड करें
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-[11px]">
              अगर आपके पास टोकन नहीं है, तो नीचे दिए गए बटन से ZIP फाइल डाउनलोड करें। इसके अंदर की फाइल्स कभी रीनेम नहीं होतीं:
            </p>

            <a
              href="/api/download/streamlit-files.zip"
              download="streamlit-files.zip"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-center shadow-sm flex items-center justify-center gap-2 text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download streamlit-files.zip (app.py + requirements.txt)</span>
            </a>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">डाउनलोड के बाद GitHub पर अपलोड करें:</span>
              <a
                href={githubUploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition"
              >
                <span>GitHub Upload Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Target Repo: <strong className="text-slate-700 font-mono">gurjeetsinghgill8-web</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
