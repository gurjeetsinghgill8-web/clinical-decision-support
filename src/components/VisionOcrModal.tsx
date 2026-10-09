import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, FileText, Pill, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { OcrExtractionResult, VitalsData, PatientData } from '../types/clinical';
import { Language } from '../utils/translations';

interface VisionOcrModalProps {
  onClose: () => void;
  onApplyExtraction: (extracted: {
    patientName?: string;
    patientAge?: string;
    patientSex?: 'Male' | 'Female' | 'Other';
    patientId?: string;
    chiefComplaint?: string;
    examination?: string;
    vitals?: Partial<VitalsData>;
    medications?: string;
    rawText: string;
    verifiedText: string;
  }) => void;
  language: Language;
}

export const VisionOcrModal: React.FC<VisionOcrModalProps> = ({
  onClose,
  onApplyExtraction,
  language,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrExtractionResult | null>(null);
  const [verifiedText, setVerifiedText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample presets for instant 1-click test without uploading camera photo
  const handleLoadSamplePrescription = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // Create a clean sample prescription canvas representation
      const sampleText = `CLINICAL PRESCRIPTION - ST. MARY'S SPECIALTY HOSPITAL
Date: 12-Oct-2026 | Dr. G. S. Gill, MBBS, PGDCCP (Non-invasive), Cardio-Physician
Patient: Rajesh Sharma, Age: 56/M | ID: GILL-CARD-101

Vitals on Examination:
BP: 160/98 mmHg, HR: 96 bpm, SpO2: 95% on room air

Diagnosis / Impression:
Acute Angina Pectoris / Suspected Acute Coronary Syndrome

Rx:
1. Tab. Aspirin 300 mg STAT (Chewable)
2. Tab. Clopidogrel 300 mg STAT
3. Tab. Atorvastatin 80 mg OD at bedtime
4. S.L. Nitroglycerin 0.4 mg sublingually SOS for chest pain
5. Tab. Metoprolol Tartrate 25 mg BD

Advise: Immediate 12-Lead ECG & Urgent hs-Troponin I test.`;

      setVerifiedText(sampleText);
      setOcrResult({
        documentType: 'Prescription / Clinical Card',
        extractedText: sampleText,
        uncertainItems: [
          { text: 'Clopidogrel 300 mg STAT', reason: 'High loading dose requires allergy & bleeding check' }
        ],
        medicationsFound: [
          { name: 'Aspirin', dose: '300 mg', frequency: 'STAT chewable', isConfident: true },
          { name: 'Clopidogrel', dose: '300 mg', frequency: 'STAT loading', isConfident: true },
          { name: 'Atorvastatin', dose: '80 mg', frequency: 'OD at bedtime', isConfident: true },
          { name: 'Nitroglycerin', dose: '0.4 mg', frequency: 'Sublingual PRN', isConfident: true },
          { name: 'Metoprolol', dose: '25 mg', frequency: 'BD', isConfident: true }
        ],
        keyFindings: ['Acute coronary ischemia suspected', 'Hemodynamic stress noted (BP 160/98)'],
        suggestedChiefComplaint: 'Acute substernal chest heaviness undergoing ACS evaluation',
        vitalsDetected: {
          bpSys: '160',
          bpDia: '98',
          heartRate: '96',
          spo2: '95',
        },
        engine: 'Clinical OCR Verified Sample'
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!imagePreview) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ocr-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: selectedFile?.type || 'image/jpeg',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to extract document text via OCR');
      }

      const data: OcrExtractionResult = await res.json();
      setOcrResult(data);
      setVerifiedText(data.extractedText || '');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error executing OCR service');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndIngest = () => {
    if (!ocrResult) return;

    const medString = ocrResult.medicationsFound
      ?.map(m => `${m.name} ${m.dose} (${m.frequency})`)
      .join(', ');

    onApplyExtraction({
      patientName: ocrResult.patientName,
      patientAge: ocrResult.patientAge,
      patientSex: ocrResult.patientSex,
      patientId: ocrResult.patientId,
      chiefComplaint: ocrResult.suggestedChiefComplaint,
      examination: ocrResult.suggestedExamination,
      vitals: ocrResult.vitalsDetected,
      medications: medString,
      rawText: ocrResult.extractedText,
      verifiedText: verifiedText,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Document Camera & Vision OCR Extraction</h3>
              <p className="text-xs text-indigo-200">Prescription, ECG strip, lab report, or clinical note ingestion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Upload or Sample Selection */}
          {!ocrResult && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                <input
                  type="file"
                  id="ocrFileInput"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="ocrFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedFile ? selectedFile.name : 'Tap to Take Photo or Upload Medical Document'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports camera capture, JPG, PNG, PDF prescriptions & ECG reports
                    </p>
                  </div>
                </label>
              </div>

              {imagePreview && (
                <div className="p-3 bg-slate-100 rounded-xl text-center">
                  <img
                    src={imagePreview}
                    alt="Document preview"
                    className="max-h-48 mx-auto rounded-lg object-contain shadow-sm border border-slate-200"
                  />
                  <button
                    onClick={handleProcessImage}
                    disabled={isProcessing}
                    className="mt-3 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Extracting Clinical Data...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Multimodal Vision OCR</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sample preset button */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>Want to test without taking a picture?</span>
                <button
                  type="button"
                  onClick={handleLoadSamplePrescription}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load Sample Cardiology Prescription</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* OCR Result Verification Screen */}
          {ocrResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {ocrResult.documentType}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Engine: {ocrResult.engine || 'Gemini 3.8 Flash Vision'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOcrResult(null);
                    setImagePreview(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Scan another document
                </button>
              </div>

              {/* Uncertain items warning banner */}
              {ocrResult.uncertainItems && ocrResult.uncertainItems.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Clinician Verification Required (Uncertain items detected):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1 text-[11px]">
                    {ocrResult.uncertainItems.map((u, idx) => (
                      <li key={idx}>
                        <strong>&quot;{u.text}&quot;</strong>: {u.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Editable Extracted Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Editable Extracted Transcription</span>
                  <span className="text-[10px] text-slate-400">Clinician may correct errors before ingestion</span>
                </label>
                <textarea
                  rows={6}
                  value={verifiedText}
                  onChange={(e) => setVerifiedText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-indigo-500 shadow-inner"
                />
              </div>

              {/* Detected Medications */}
              {ocrResult.medicationsFound && ocrResult.medicationsFound.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Identified Medications & Posology</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ocrResult.medicationsFound.map((med, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{med.name} <span className="font-mono text-slate-600 font-normal">{med.dose}</span></p>
                          <p className="text-[10px] text-slate-500">{med.frequency} {med.duration ? `• ${med.duration}` : ''}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                          med.isConfident ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {med.isConfident ? 'Confirmed' : 'Verify'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Vitals */}
              {ocrResult.vitalsDetected && (
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-indigo-900">Extracted Vitals from Document:</p>
                  <div className="flex flex-wrap gap-3 text-slate-700 font-mono text-[11px]">
                    {ocrResult.vitalsDetected.bpSys && <span>BP: {ocrResult.vitalsDetected.bpSys}/{ocrResult.vitalsDetected.bpDia || '80'} mmHg</span>}
                    {ocrResult.vitalsDetected.heartRate && <span>Pulse: {ocrResult.vitalsDetected.heartRate} bpm</span>}
                    {ocrResult.vitalsDetected.spo2 && <span>SpO2: {ocrResult.vitalsDetected.spo2}%</span>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Cancel
          </button>

          {ocrResult && (
            <button
              onClick={handleConfirmAndIngest}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Ingest into Encounter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
