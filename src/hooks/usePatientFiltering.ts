import { useMemo } from 'react';
import { Patient, AdmissionStatus } from '../types/patient';
import { UI_CONFIG } from '../constants';

export const usePatientFiltering = (patients: Patient[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm || searchTerm.length < UI_CONFIG.SEARCH_MIN_LENGTH) {
      return patients;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return patients.filter(patient => 
      (patient.name || '').toLowerCase().includes(lowerSearchTerm) ||
      (patient.patientCode || '').toLowerCase().includes(lowerSearchTerm) ||
      (patient.roomNumber || '').toLowerCase().includes(lowerSearchTerm) ||
      (patient.diagnosis || '').toLowerCase().includes(lowerSearchTerm)
    );
  }, [patients, searchTerm]);
};

export const usePatientSorting = (patients: Patient[], sortBy: 'roomNumber' | 'name') => {
  return useMemo(() => {
    return [...patients].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '', 'vi');
      }
      return (a.roomNumber || '').localeCompare(b.roomNumber || '', undefined, { numeric: true });
    });
  }, [patients, sortBy]);
};

export const usePatientGrouping = (patients: Patient[]) => {
  return useMemo(() => {
    const activePatients = patients.filter(p => p.status !== AdmissionStatus.DISCHARGED);
    const dischargedPatients = patients.filter(p => p.status === AdmissionStatus.DISCHARGED);
    
    return { activePatients, dischargedPatients };
  }, [patients]);
};

const getDischargeTimestamp = (patient: Patient) =>
  patient.dischargedAt || patient.updatedAt || patient.createdAt || '';

export const useDischargedPatientSorting = (patients: Patient[]) => {
  return useMemo(() => {
    return [...patients].sort((a, b) => {
      const dateA = getDischargeTimestamp(a);
      const dateB = getDischargeTimestamp(b);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB.localeCompare(dateA);
    });
  }, [patients]);
};