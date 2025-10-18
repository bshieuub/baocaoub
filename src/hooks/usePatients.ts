import { useState, useEffect, useCallback } from 'react';
import { PatientService } from '../services/patientService';
import { Patient, SyncStatus } from '../types/patient';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: 'idle' });
  const [error, setError] = useState<string>('');

  const fetchPatients = useCallback(async () => {
    setSyncStatus({ status: 'loading' });
    setError('');
    
    try {
      const patientsData = await PatientService.getAllPatients();
      setPatients(patientsData);
      setSyncStatus({ status: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      setSyncStatus({ status: 'error', error: errorMessage });
    }
  }, []);

  const addPatient = useCallback(async (patientData: Omit<Patient, 'id'>) => {
    setSyncStatus({ status: 'syncing' });
    setError('');
    
    try {
      const newId = await PatientService.addPatient(patientData);
      const newPatient = { ...patientData, id: newId };
      setPatients(prev => [newPatient, ...prev]);
      setSyncStatus({ status: 'success' });
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      setSyncStatus({ status: 'error', error: errorMessage });
      throw err;
    }
  }, []);

  const updatePatient = useCallback(async (patientId: string, patientData: Partial<Patient>) => {
    setSyncStatus({ status: 'syncing' });
    setError('');
    
    try {
      await PatientService.updatePatient(patientId, patientData);
      setPatients(prev => 
        prev.map(p => p.id === patientId ? { ...p, ...patientData } : p)
      );
      setSyncStatus({ status: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      setSyncStatus({ status: 'error', error: errorMessage });
      throw err;
    }
  }, []);

  const deletePatient = useCallback(async (patientId: string) => {
    setSyncStatus({ status: 'syncing' });
    setError('');
    
    try {
      await PatientService.deletePatient(patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setSyncStatus({ status: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      setSyncStatus({ status: 'error', error: errorMessage });
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Auto-hide success status after 3 seconds
  useEffect(() => {
    if (syncStatus.status === 'success') {
      const timer = setTimeout(() => {
        setSyncStatus({ status: 'idle' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus.status]);

  return {
    patients,
    syncStatus,
    error,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  };
};