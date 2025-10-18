import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Patient, PatientHistoryEntry } from '../types/patient';

const COLLECTION_NAME = 'patients';

export class PatientService {
  static async getAllPatients(): Promise<Patient[]> {
    try {
      const patientsCollection = collection(db, COLLECTION_NAME);
      const patientSnapshot = await getDocs(patientsCollection);
      return patientSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Patient));
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Không thể tải danh sách bệnh nhân');
    }
  }

  static async addPatient(patientData: Omit<Patient, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...patientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw new Error('Không thể thêm bệnh nhân mới');
    }
  }

  static async updatePatient(patientId: string, patientData: Partial<Patient>): Promise<void> {
    try {
      const patientDocRef = doc(db, COLLECTION_NAME, patientId);
      await updateDoc(patientDocRef, {
        ...patientData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Không thể cập nhật thông tin bệnh nhân');
    }
  }

  static async deletePatient(patientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Không thể xóa bệnh nhân');
    }
  }

  static async addHistoryEntry(patientId: string, entry: PatientHistoryEntry): Promise<void> {
    try {
      const patientDocRef = doc(db, COLLECTION_NAME, patientId);
      const patient = await this.getPatientById(patientId);
      
      if (!patient) {
        throw new Error('Không tìm thấy bệnh nhân');
      }

      const updatedHistory = [...(patient.history || []), entry];
      await updateDoc(patientDocRef, {
        history: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding history entry:', error);
      throw new Error('Không thể thêm ghi chú mới');
    }
  }

  static async getPatientById(patientId: string): Promise<Patient | null> {
    try {
      const patients = await this.getAllPatients();
      return patients.find(p => p.id === patientId) || null;
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
      return null;
    }
  }
}