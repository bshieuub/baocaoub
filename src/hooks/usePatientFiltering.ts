import { useMemo } from 'react';
import { Patient } from '../types/patient';
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
    const activePatients = patients.filter(p => p.status !== 'Ra viện');
    const dischargedPatients = patients.filter(p => p.status === 'Ra viện');
    
    return { activePatients, dischargedPatients };
  }, [patients]);
};