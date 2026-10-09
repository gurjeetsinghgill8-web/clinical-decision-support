import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Camera, FileText, Plus, Check, Sparkles, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ClinicalHistoryProps {
  complaint: string;
  onComplaintChange: (text: string) => void;
  symptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  onOpenOcrModal: () => void;
  ocrExtractedText?: string;
  language: Language;
}

const COMMON_SYMPTOMS = [
  'Chest Pain',
  'Shortness of Breath',
  'Diaphoresis / Sweating',
  'Radiation to Left Arm/Jaw',
  'High Fever',
  'Chills / Rigors',
  'Severe Headache',
  'Altered Mental Status',
  'Abdominal Pain',
  'Nausea & Vomiting',
  'Dizziness / Vertigo',
  'Palpitations',
  'Productive Cough',
  'Wheezing',
  'Syncope / Fainting',
];

export const ClinicalHistory: React.FC<ClinicalHistoryProps> = ({
  complaint,
  onComplaintChange,
  symptoms,
  onToggleSymptom,
  onOpenOcrModal,
  ocrExtractedText,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalChunk = event.results[i][0].transcript;
          onComplaintChange(complaint ? `${complaint} ${finalChunk}` : finalChunk);
        }
      }
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition error:', e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, complaint, onComplaintChange]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {t.historyTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.historySubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons: Voice & OCR */}
        <div className="flex items-center gap-2">
          {/* Voice Input */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse ring-2 ring-rose-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Speech-to-Text Dictation"
          >
            {isRecording ? <MicOff className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4 text-indigo-600" />}
            <span>{isRecording ? t.voiceStop : t.voiceInput}</span>
          </button>

          {/* OCR Upload */}
          <button
            type="button"
            onClick={onOpenOcrModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl transition"
          >
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>{t.ocrButton}</span>
          </button>
        </div>
      </div>

      {/* Voice Recording Active Wave Banner */}
      {isRecording && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>{t.voiceRecording} ({language === 'hi' ? 'हिन्दी में बोलें' : 'English'})</span>
          </div>
          <span className="text-[10px] text-rose-600">Web Speech API Active</span>
        </div>
      )}

      {/* Chief Complaint Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">
          {t.chiefComplaint}
        </label>
        <textarea
          rows={4}
          value={complaint}
          onChange={(e) => onComplaintChange(e.target.value)}
          placeholder={t.chiefComplaintPlaceholder}
          className="w-full p-4 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-sm text-slate-800 leading-relaxed transition shadow-inner"
        />
      </div>

      {/* Quick Symptom Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.symptomTags}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((symptom) => {
            const active = symptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => onToggleSymptom(symptom)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                }`}
              >
                {active ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                <span>{symptom}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OCR Ingested Records Display */}
      {ocrExtractedText && (
        <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Extracted Medical Records (Vision OCR)</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-mono">Multimodal Ingested</span>
          </div>
          <p className="text-xs text-slate-700 whitespace-pre-line bg-white/70 p-3 rounded-lg border border-indigo-100 font-mono">
            {ocrExtractedText}
          </p>
        </div>
      )}
    </div>
  );
};
