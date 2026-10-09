export type UserRole = 'LEAD_CLINICIAN' | 'RESIDENT' | 'TRIAGE_NURSE' | 'ADMIN';

export interface ClinicianUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  qualifications?: string;
  department: string;
  regNumber: string;
  avatarInitials: string;
}

export type TriageLevel = 'CRITICAL' | 'URGENT' | 'STANDARD' | 'NONE';

export interface VitalsData {
  bpSys: string;
  bpDia: string;
  heartRate: string;
  spo2: string;
  temperature: string;
  tempUnit: 'F' | 'C';
  respiratoryRate: string;
  painScore: string;
  bloodGlucose?: string;
  weight?: string;
}

export interface PatientData {
  id: string;
  name: string;
  age: string;
  sex: 'Male' | 'Female' | 'Other';
  weight?: string;
  allergies: string;
  pastHistory: string;
  surgicalHistory?: string;
  familyHistory?: string;
  currentMedications: string;
  registeredDate?: string;
}

export interface UncertainOcrItem {
  text: string;
  reason: string;
}

export interface ExtractedMedication {
  name: string;
  dose: string;
  frequency: string;
  duration?: string;
  isConfident: boolean;
}

export interface OcrExtractionResult {
  documentType: string;
  extractedText: string;
  patientName?: string;
  patientAge?: string;
  patientSex?: 'Male' | 'Female' | 'Other';
  patientId?: string;
  uncertainItems?: UncertainOcrItem[];
  medicationsFound?: ExtractedMedication[];
  keyFindings?: string[];
  suggestedChiefComplaint?: string;
  suggestedExamination?: string;
  vitalsDetected?: {
    bpSys?: string;
    bpDia?: string;
    heartRate?: string;
    spo2?: string;
    temperature?: string;
    respiratoryRate?: string;
  };
  engine?: string;
  note?: string;
}

export interface EmergencyScreenResult {
  isEmergency: boolean;
  level: 'CRITICAL' | 'URGENT' | 'NONE';
  triggers: string[];
  immediateActions: string[];
  escalationProtocol: string;
  neverDelayCareNotice: string;
}

export interface CandidateDiagnosis {
  rank: number;
  condition: string;
  icd10?: string;
  priority: 'Emergency' | 'Urgent' | 'Routine';
  urgency: string;
  dangerIfMissed: string;
  supportingFindings: string[];
  contradictoryFindings: string[];
  importantUnknowns: string[];
  clinicalRationale: string;
  recommendedNextAction: string;
  evidenceSource: string;
  limitations: string;
  // Clinician review flags
  clinicianStatus?: 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'PENDING';
  clinicianOverrideNote?: string;
}

export interface ResultBranches {
  positive: string;
  negative: string;
  inconclusive: string;
}

export interface StageInvestigation {
  exactInvestigation: string;
  indication: string;
  clinicalQuestion: string;
  urgency: string;
  whyUseful: string;
  precautions?: string;
  interpretationLimitations?: string;
  resultBranches?: ResultBranches;
  evidenceReference?: string;
  // Clinician order flag
  ordered?: boolean;
}

export interface StagedInvestigationPlan {
  stage1_bedside: StageInvestigation[];
  stage2_highValueLabs: StageInvestigation[];
  stage3_targetedImaging: StageInvestigation[];
}

export interface DecisionBranch {
  scenario: string;
  clinicalAction: string;
}

export interface CaseSummaryStructured {
  patientId: string;
  age: string;
  sex: string;
  confirmedPositiveFindings: string[];
  specificallyAbsentFindings: string[];
  unknownOrUnrecordedInfo: string[];
  pendingResults: string[];
}

export interface ClinicalGuideline {
  id: string;
  title: string;
  organization: string;
  version: string;
  publicationDate: string;
  applicability: string;
  status: string;
  evidenceLevel: string;
  keyRecommendation: string;
}

export interface FinalClinicalPlan {
  signedBy: string;
  signedAt: string;
  clinicianRole: string;
  finalDiagnosis: string;
  prescriptions: string;
  orderedInvestigations: string[];
  escalationDecision: string;
  followUpInstructions: string;
  isSigned: boolean;
}

export interface SeniorPhysicianGuidance {
  consultantSummary: string;
  primaryDepartment: string;
  pearlsAndPitfalls: string[];
  immediateBedsideActions: string[];
  escalationCriteria: string;
}

export interface ComprehensiveCaseAnalysis {
  source?: string;
  aiEngine?: string;
  model_version?: string;
  knowledge_version?: string;
  primaryDepartment?: string;
  seniorPhysicianGuidance?: SeniorPhysicianGuidance;
  clinician_review_required?: boolean;
  case_summary: CaseSummaryStructured;
  emergency_screen: EmergencyScreenResult;
  differential_diagnoses: CandidateDiagnosis[];
  investigation_plan: StagedInvestigationPlan;
  decision_branches: DecisionBranch[];
  evidence_sources: ClinicalGuideline[];
  disclaimer: string;
  warning?: string;
}

export interface ClinicalEncounter {
  id: string;
  date: string;
  status: 'DRAFT' | 'EMERGENCY_ACTIVE' | 'AI_REVIEWED' | 'CLINICIAN_SIGNED';
  clinicianId: string;
  clinicianName: string;
  patient: PatientData;
  vitals: VitalsData;
  chiefComplaint: string;
  symptoms: string[];
  examination: string;
  ocrDocument?: {
    uploadedImage?: string;
    rawText: string;
    verifiedText: string;
    extraction: OcrExtractionResult;
  };
  emergencyScreen?: EmergencyScreenResult;
  analysis?: ComprehensiveCaseAnalysis;
  finalPlan?: FinalClinicalPlan;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  patientId?: string;
  details: string;
}
