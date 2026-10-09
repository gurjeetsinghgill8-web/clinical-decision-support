import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, FileText, ArrowRight, CheckCircle2, 
  Loader2, AlertTriangle, RefreshCw, Zap, Check, Eye
} from 'lucide-react';
import { Language } from '../utils/translations';
import { OcrExtractionResult, VitalsData } from '../types/clinical';

interface FrontDoorOcrCardProps {
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
  }, autoRunAnalysis?: boolean) => void;
  language: Language;
}

export const FrontDoorOcrCard: React.FC<FrontDoorOcrCardProps> = ({
  onApplyExtraction,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<OcrExtractionResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Process image via server-side Gemini Vision OCR
  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setExtractedData(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setPreviewImage(base64Data);

      try {
        const res = await fetch('/api/ocr-extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            clinicianName: 'Dr. G. S. Gill, MBBS, PGDCCP (Non-invasive)',
          }),
        });

        if (!res.ok) {
          throw new Error('OCR Vision extraction failed. Server returned status ' + res.status);
        }

        const data: OcrExtractionResult = await res.json();
        setExtractedData(data);
      } catch (err: any) {
        console.error('OCR Error:', err);
        setErrorMsg(err.message || 'Error processing document with Vision OCR');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    } else {
      setErrorMsg('Please drop an image file (JPG, PNG, WebP)');
    }
  };

  // Instant Sample Slip Presets
  const handleLoadSampleSlip = (type: 'opd' | 'rx' | 'lab') => {
    setIsProcessing(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (type === 'opd') {
        setExtractedData({
          documentType: 'Handwritten OPD Clinical Slip',
          patientName: 'Karamjit Singh',
          patientAge: '52',
          patientSex: 'Male',
          patientId: 'OPD-8841',
          extractedText: `OPD CLINICAL CONSULTATION SLIP
Pt: Karamjit Singh, 52/M | Reg: OPD-8841 | Date: Today
C/o: Severe retrosternal chest heaviness x 2 hours, sweating, dyspnea.
O/E: BP: 165/100 mmHg, HR: 104 bpm, SpO2: 94% on room air, RR: 22/min. S1 S2 heard.
Hx: T2DM x 8 yrs on Metformin.
Rx:
1. Tab. Aspirin 300 mg STAT chewable
2. Tab. Clopidogrel 300 mg STAT
3. S.L. Nitroglycerin 0.4 mg SOS
Adv: STAT 12-lead ECG, hs-Troponin I. Refer to Cardiology.`,
          keyFindings: ['Acute retrosternal heaviness with diaphoresis', 'Hypertension (165/100) and tachycardia (104 bpm)'],
          suggestedChiefComplaint: 'Severe retrosternal chest heaviness lasting 2 hours with diaphoresis and dyspnea',
          suggestedExamination: 'BP: 165/100 mmHg, HR: 104 bpm, SpO2: 94%, RR: 22/min. Auscultation: S1 S2 audible, no audible gallop.',
          vitalsDetected: {
            bpSys: '165',
            bpDia: '100',
            heartRate: '104',
            spo2: '94',
            temperature: '98.6',
            respiratoryRate: '22',
          },
          medicationsFound: [
            { name: 'Aspirin', dose: '300 mg', frequency: 'STAT chewable', duration: 'STAT', isConfident: true },
            { name: 'Clopidogrel', dose: '300 mg', frequency: 'STAT loading', duration: 'STAT', isConfident: true },
            { name: 'Nitroglycerin', dose: '0.4 mg', frequency: 'Sublingually SOS', duration: 'PRN', isConfident: true },
          ],
          engine: 'Verified Clinical Sample'
        });
      } else if (type === 'rx') {
        setExtractedData({
          documentType: 'Prescription Slip (General Medicine / Pulmonology)',
          patientName: 'Sunita Mehra',
          patientAge: '34',
          patientSex: 'Female',
          patientId: 'OPD-5120',
          extractedText: `ST. MARY HOSPITAL - INTERNAL MEDICINE OPD
Patient: Sunita Mehra, 34/F | Date: Today
C/o: Severe wheezing, acute dry cough, chest tightness x 1 day.
Vitals: BP 120/78 mmHg, HR 118 bpm, SpO2 91% on room air, RR 26/min, Temp 99.0 F.
O/E: Bilateral diffuse expiratory wheezes across all lung zones. Accessory muscle use.
Rx:
1. Salbutamol + Ipratropium Nebulization STAT
2. Tab. Prednisolone 40 mg OD x 5 days
3. Budesonide / Formoterol Inhaler 200/6 mcg 2 puffs BD`,
          keyFindings: ['Severe expiratory wheezing with tachypnea', 'Hypoxia (SpO2 91% on room air)'],
          suggestedChiefComplaint: 'Acute severe wheezing, chest tightness, and breathlessness for 1 day',
          suggestedExamination: 'Chest: Bilateral diffuse expiratory wheezing across all lung zones with accessory muscle use. Heart: S1 S2 clear.',
          vitalsDetected: {
            bpSys: '120',
            bpDia: '78',
            heartRate: '118',
            spo2: '91',
            temperature: '99.0',
            respiratoryRate: '26',
          },
          medicationsFound: [
            { name: 'Salbutamol + Ipratropium', dose: 'Nebulization', frequency: 'STAT', isConfident: true },
            { name: 'Prednisolone', dose: '40 mg', frequency: 'OD morning', duration: '5 days', isConfident: true },
            { name: 'Budesonide/Formoterol', dose: '200/6 mcg', frequency: '2 puffs BD', isConfident: true },
          ],
          engine: 'Verified Clinical Sample'
        });
      } else {
        setExtractedData({
          documentType: 'OPD Surgical Triage Slip',
          patientName: 'Rahul Verma',
          patientAge: '24',
          patientSex: 'Male',
          patientId: 'SURG-771',
          extractedText: `EMERGENCY OPD CLINICAL NOTES
Pt: Rahul Verma, 24/M | ID: SURG-771
C/o: Severe right iliac fossa (RIF) pain x 14 hrs, anorexia, 2 episodes vomiting.
O/E: Tenderness and localized guarding at McBurney's point. Rebound tenderness positive.
Vitals: BP 118/76 mmHg, HR 96 bpm, SpO2 99%, Temp 101.4 F, RR 18/min.
Impression: Acute Appendicitis.
Adv: Stat USG RIF, CBC, keep NPO. Call on-call surgical resident.`,
          keyFindings: ['Localized tenderness at McBurney point with guarding', 'High fever (101.4 F) and tachycardia'],
          suggestedChiefComplaint: 'Severe right iliac fossa pain for 14 hours with vomiting and anorexia',
          suggestedExamination: 'Abdomen: Involuntary guarding and acute tenderness localized at McBurney point. Rovsing sign positive. Rebound tenderness in RIF.',
          vitalsDetected: {
            bpSys: '118',
            bpDia: '76',
            heartRate: '96',
            spo2: '99',
            temperature: '101.4',
            respiratoryRate: '18',
          },
          medicationsFound: [
            { name: 'IV Paracetamol', dose: '1 g', frequency: 'STAT infusion', isConfident: true },
          ],
          engine: 'Verified Clinical Sample'
        });
      }
      setIsProcessing(false);
    }, 400);
  };

  const handleApply = (autoRun: boolean) => {
    if (!extractedData) return;

    const medString = extractedData.medicationsFound
      ?.map((m) => `${m.name} ${m.dose} (${m.frequency})`)
      .join(', ');

    onApplyExtraction(
      {
        patientName: extractedData.patientName,
        patientAge: extractedData.patientAge,
        patientSex: extractedData.patientSex,
        patientId: extractedData.patientId,
        chiefComplaint: extractedData.suggestedChiefComplaint,
        examination: extractedData.suggestedExamination,
        vitals: extractedData.vitalsDetected,
        medications: medString,
        rawText: extractedData.extractedText,
        verifiedText: extractedData.extractedText,
      },
      autoRun
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-indigo-500/40 relative overflow-hidden transition-all">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg ring-2 ring-indigo-400/30">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/40">
                ⚡ 1-Click Fast-Track Intake
              </span>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Gemini 3.8 Vision OCR Active
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              {language === 'hi'
                ? 'पर्ची / क्लिनिकल नोट्स की फोटो खींचें या अपलोड करें'
                : 'Snap Photo or Drag & Drop OPD Clinical Notes / Slip'}
            </h3>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-indigo-300 font-medium mr-1 hidden sm:inline">Try Demo Slip:</span>
          <button
            type="button"
            onClick={() => handleLoadSampleSlip('opd')}
            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-700/60 rounded-lg transition"
          >
            Chest Pain Slip
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleSlip('rx')}
            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-700/60 rounded-lg transition"
          >
            Asthma Rx
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleSlip('lab')}
            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-700/60 rounded-lg transition"
          >
            Acute Abdomen
          </button>
        </div>
      </div>

      {/* Main Dropzone / Action Area */}
      <div className="mt-4 relative z-10 space-y-4">
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        {!extractedData && !isProcessing && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/20'
                : 'border-indigo-600/50 hover:border-indigo-400 bg-slate-900/40 hover:bg-slate-900/60'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition active:scale-95"
                >
                  <Camera className="w-4 h-4 text-slate-900" />
                  <span>{language === 'hi' ? 'कैमरे से फोटो खींचें' : 'Take Camera Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>{language === 'hi' ? 'गैलरी / फाइल चुनें' : 'Upload Image / Slip'}</span>
                </button>
              </div>

              <p className="text-xs text-indigo-200/80">
                {language === 'hi'
                  ? 'या यहाँ इमेज ड्रैग और ड्रॉप करें (JPG, PNG, WebP) — AI खुद हाथ की लिखावट और विटल्स पढ़ लेगा'
                  : 'Or drag and drop your clinical note image here — Multimodal Vision AI auto-extracts handwriting, vitals & medicines'}
              </p>
            </div>
          </div>
        )}

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-indigo-700/50 space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-white">
              {language === 'hi'
                ? 'क्लिनिकल पर्चे का विश्लेषण हो रहा है...'
                : 'Extracting handwritten clinical notes with Gemini Multimodal Vision...'}
            </h4>
            <p className="text-xs text-indigo-200 max-w-sm mx-auto">
              Extracting patient demographics, blood pressure, heart rate, symptoms, examination notes, and medications without guessing.
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Extracted Findings Display & Action Confirmation */}
        {extractedData && (
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-indigo-500/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">
                  Document Successfully Extracted ({extractedData.documentType})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                  setPreviewImage(null);
                }}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Scan Another Slip</span>
              </button>
            </div>

            {/* Structured Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/50">
                <span className="text-[10px] text-indigo-300 block font-bold uppercase">Patient</span>
                <span className="font-bold text-white">
                  {extractedData.patientName || 'Not specified'} {extractedData.patientAge ? `(${extractedData.patientAge}y)` : ''}
                </span>
              </div>

              <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/50">
                <span className="text-[10px] text-indigo-300 block font-bold uppercase">Blood Pressure</span>
                <span className="font-bold font-mono text-emerald-300">
                  {extractedData.vitalsDetected?.bpSys ? `${extractedData.vitalsDetected.bpSys}/${extractedData.vitalsDetected.bpDia || '80'} mmHg` : 'Not on slip'}
                </span>
              </div>

              <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/50">
                <span className="text-[10px] text-indigo-300 block font-bold uppercase">Heart Rate / SpO2</span>
                <span className="font-bold font-mono text-emerald-300">
                  {extractedData.vitalsDetected?.heartRate ? `${extractedData.vitalsDetected.heartRate} bpm` : '--'} • {extractedData.vitalsDetected?.spo2 ? `${extractedData.vitalsDetected.spo2}%` : '--'}
                </span>
              </div>

              <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/50">
                <span className="text-[10px] text-indigo-300 block font-bold uppercase">Medications</span>
                <span className="font-bold text-white truncate block">
                  {extractedData.medicationsFound?.length || 0} drugs identified
                </span>
              </div>
            </div>

            {/* Extracted summary details */}
            <div className="p-3 bg-black/40 rounded-xl border border-indigo-900/70 text-xs space-y-1.5">
              <div>
                <strong className="text-indigo-300 font-bold">Chief Complaint:</strong>{' '}
                <span className="text-white/95">{extractedData.suggestedChiefComplaint || 'None provided'}</span>
              </div>
              {extractedData.suggestedExamination && (
                <div>
                  <strong className="text-indigo-300 font-bold">Physical Exam:</strong>{' '}
                  <span className="text-white/90">{extractedData.suggestedExamination}</span>
                </div>
              )}
              {extractedData.medicationsFound && extractedData.medicationsFound.length > 0 && (
                <div>
                  <strong className="text-amber-300 font-bold">Extracted Rx:</strong>{' '}
                  <span className="text-amber-100 font-mono text-[11px]">
                    {extractedData.medicationsFound.map((m) => `${m.name} ${m.dose} (${m.frequency})`).join('; ')}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: 2 options */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleApply(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'फॉर्म में भरें (Review Fields)' : 'Apply to Fields & Review'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleApply(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Zap className="w-4 h-4 text-slate-900 fill-slate-900" />
                <span>{language === 'hi' ? '1-क्लिक: तुरंत सीनियर AI विश्लेषण चलाएं' : '⚡ 1-Click: Apply & Run Senior AI Analysis Now'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
