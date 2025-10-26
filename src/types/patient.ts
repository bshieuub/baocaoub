export enum AdmissionStatus {
  INPATIENT = 'Nội trú',
  DISCHARGED = 'Ra viện',
  DISCHARGE_TODAY = 'Dự kiến ra viện',
}

export enum TreatmentDirection {
  SURGERY = 'Phẫu thuật',
  CHEMOTHERAPY = 'Hoá trị',
  PALLIATIVE_CARE = 'Chăm sóc giảm nhẹ',
}

export interface SurgeryTeam {
  mainSurgeon: string;
  assistant1: string;
  assistant2: string;
}

export interface PatientHistoryEntry {
  date: string;
  diagnosis: string;
  notes: string;
  treatmentDirection?: TreatmentDirection;
  surgeryTeam?: SurgeryTeam;
}

export interface Patient {
  id: string;
  name: string;
  birthYear: number;
  patientCode: string;
  roomNumber: string;
  reason: string;
  diagnosis: string;
  status: AdmissionStatus;
  notes: string;
  treatmentDirection: TreatmentDirection;
  surgeryTeam?: SurgeryTeam;
  history?: PatientHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormData {
  name: string;
  birthYear: string;
  patientCode: string;
  roomNumber: string;
  reason: string;
  diagnosis: string;
  status: AdmissionStatus;
  treatmentDirection: TreatmentDirection;
  mainSurgeon: string;
  assistant1: string;
  assistant2: string;
  newNote: string;
}

export interface SyncStatus {
  status: 'idle' | 'loading' | 'syncing' | 'success' | 'error';
  error?: string;
}
