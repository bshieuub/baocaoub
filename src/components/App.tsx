import React, { useState, useMemo, lazy, Suspense } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { usePatients } from '../hooks/usePatients';
import { usePatientFiltering, usePatientSorting, usePatientGrouping, useDischargedPatientSorting } from '../hooks/usePatientFiltering';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { Patient, AdmissionStatus } from '../types/patient';
import { Modal } from './Modal';
import { PatientForm } from './PatientForm';
import { PatientTable, DesktopHeader } from './PatientTable';
import { ConfirmModal } from './ConfirmModal';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { LoadingSpinner } from './LoadingSpinner';
import { PatientTableSkeleton } from './PatientTableSkeleton';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { PWAStatus } from './PWAStatus';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

// Lazy load heavy components
const ReportView = lazy(() => import('./ReportView').then(module => ({ default: module.ReportView })));

interface AppProps {
  user: any;
}

export const App: React.FC<AppProps> = ({ user }) => {
  const {
    patients,
    syncStatus,
    addPatient,
    updatePatient,
    deletePatient,
  } = usePatients();

  const { isOnline, hasOfflineData, addPendingChange } = useOfflineSync();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDeleteId, setPatientToDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'roomNumber' | 'name'>('roomNumber');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Use custom hooks for filtering and sorting
  const filteredPatients = usePatientFiltering(patients, searchTerm);
  const { activePatients, dischargedPatients } = usePatientGrouping(filteredPatients);
  const sortedActivePatients = usePatientSorting(activePatients, sortBy);
  const sortedDischargedPatients = useDischargedPatientSorting(dischargedPatients);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      setNotification({ type: 'error', message: ERROR_MESSAGES.AUTH_ERROR });
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const patientToDelete = useMemo(() => 
    patientToDeleteId ? patients.find(p => p.id === patientToDeleteId) : null,
    [patientToDeleteId, patients]
  );

  const handleAddPatientClick = () => {
    setPatientToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditPatientClick = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsFormModalOpen(true);
  };

  const handleDeletePatientClick = (patient: Patient) => {
    setPatientToDeleteId(patient.id);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDeletePatient = async () => {
    if (!patientToDeleteId) return;

    try {
      if (isOnline) {
        await deletePatient(patientToDeleteId);
        showNotification('success', SUCCESS_MESSAGES.PATIENT_DELETED);
      } else {
        addPendingChange({ type: 'delete', patientId: patientToDeleteId });
        showNotification('success', 'Đã lưu thay đổi offline. Sẽ đồng bộ khi có kết nối mạng.');
      }
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
      showNotification('error', ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setPatientToDeleteId(null);
    }
  };
  
  const handleSavePatient = async (patientData: any) => {
    try {
      const now = new Date().toISOString();

      if (patientData.id) {
        // UPDATE
        const newHistoryEntry = {
          date: now,
          diagnosis: patientData.diagnosis,
          notes: patientData.newNote || '',
        };

        const statusChangedToDischarged =
          patientToEdit?.status !== AdmissionStatus.DISCHARGED &&
          patientData.status === AdmissionStatus.DISCHARGED;
        const statusChangedFromDischarged =
          patientToEdit?.status === AdmissionStatus.DISCHARGED &&
          patientData.status !== AdmissionStatus.DISCHARGED;

        let dischargedAt = patientToEdit?.dischargedAt ?? null;
        if (statusChangedToDischarged) {
          dischargedAt = now;
        } else if (statusChangedFromDischarged) {
          dischargedAt = null;
        }

        const updatedPatient = {
          ...patientData,
          history: [...(patientToEdit?.history || []), newHistoryEntry],
          dischargedAt,
        };

        if (isOnline) {
          await updatePatient(patientData.id, updatedPatient);
          showNotification('success', SUCCESS_MESSAGES.PATIENT_UPDATED);
        } else {
          addPendingChange({ type: 'update', patientId: patientData.id, data: updatedPatient });
          showNotification('success', 'Đã lưu thay đổi offline. Sẽ đồng bộ khi có kết nối mạng.');
        }
      } else {
        // ADD
        const newHistoryEntry = {
          date: now,
          diagnosis: patientData.diagnosis,
          notes: patientData.notes || patientData.newNote || '',
        };

        const newPatient = {
          ...patientData,
          history: [newHistoryEntry],
          dischargedAt: patientData.status === AdmissionStatus.DISCHARGED ? now : null,
        };

        if (isOnline) {
          await addPatient(newPatient);
          showNotification('success', SUCCESS_MESSAGES.PATIENT_ADDED);
        } else {
          addPendingChange({ type: 'add', data: newPatient });
          showNotification('success', 'Đã lưu thay đổi offline. Sẽ đồng bộ khi có kết nối mạng.');
        }
      }
      
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving patient:', error);
      showNotification('error', ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === 'success' ? '✓' : '⚠'}
            </span>
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium">
          🔌 Bạn đang offline. Các thay đổi sẽ được đồng bộ khi có kết nối mạng.
        </div>
      )}

      <header className="bg-white shadow-md no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              Quản lý bệnh nhân nội trú Ung bướu
            </h1>
            <div className="flex items-center space-x-4">
              <SyncStatusIndicator status={syncStatus} />
              <PWAStatus />
              {hasOfflineData && (
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Có dữ liệu offline
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-3">
              <span 
                className="text-sm text-gray-600 hidden sm:inline" 
                aria-label={`Logged in as ${user.email}`}
              >
                {user.email}
              </span>
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md transition-colors" 
                aria-label="Đăng xuất"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
            <div className="h-8 border-l border-gray-200"></div>
            <button 
              onClick={() => setIsReportModalOpen(true)} 
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path 
                  fillRule="evenodd" 
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="hidden sm:inline">Xem Báo Cáo</span>
            </button>
            <button 
              onClick={handleAddPatientClick} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="hidden sm:inline">Thêm Bệnh Nhân</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow no-print">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-2/3 md:w-1/2">
              <input 
                type="search" 
                placeholder="Tìm theo tên hoặc MSBN..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sort" className="text-sm font-medium text-gray-600">
                Sắp xếp (đang điều trị):
              </label>
              <select 
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'roomNumber' | 'name')}
                className="border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="roomNumber">Số Phòng</option>
                <option value="name">Họ Tên</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Bệnh nhân đang điều trị ({sortedActivePatients.length})
              </h2>
            </div>
            <DesktopHeader />
            {syncStatus.status === 'loading' ? (
              <PatientTableSkeleton count={5} />
            ) : (
              <PatientTable 
                patients={sortedActivePatients} 
                onEdit={handleEditPatientClick} 
                onDelete={handleDeletePatientClick} 
              />
            )}
            {syncStatus.status !== 'loading' && sortedActivePatients.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p>
                  {searchTerm 
                    ? `Không có bệnh nhân đang điều trị khớp với "${searchTerm}".` 
                    : 'Không có bệnh nhân nào đang điều trị.'
                  }
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t overflow-x-auto">
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Bệnh nhân đã ra viện ({sortedDischargedPatients.length})
              </h2>
            </div>
            <DesktopHeader />
            {syncStatus.status === 'loading' ? (
              <PatientTableSkeleton count={3} />
            ) : (
              <PatientTable 
                patients={sortedDischargedPatients} 
                onEdit={handleEditPatientClick} 
                onDelete={handleDeletePatientClick} 
              />
            )}
            {syncStatus.status !== 'loading' && sortedDischargedPatients.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p>
                  {searchTerm 
                    ? `Không có bệnh nhân đã ra viện khớp với "${searchTerm}".` 
                    : 'Chưa có bệnh nhân nào ra viện.'
                  }
                </p>
              </div>
            )}
          </div>

          {patients.length === 0 && searchTerm === '' && syncStatus.status !== 'loading' && (
            <div className="text-center py-16 text-gray-500">
              <p>Chưa có bệnh nhân nào trong hệ thống.</p>
              <p>Nhấn "Thêm Bệnh Nhân" để bắt đầu.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-500 no-print">
        bshieuubdl@gmail.com
      </footer>

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={patientToEdit ? 'Cập Nhật Diễn Biến Bệnh Nhân' : 'Thêm Bệnh Nhân Mới'}
      >
        <PatientForm 
          onSave={handleSavePatient} 
          onClose={() => setIsFormModalOpen(false)} 
          patientToEdit={patientToEdit} 
        />
      </Modal>

      <Modal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        title="Báo Cáo Hàng Ngày"
      >
        <Suspense fallback={<LoadingSpinner size="lg" text="Đang tải báo cáo..." />}>
          <ReportView 
            patients={patients} 
            onClose={() => setIsReportModalOpen(false)} 
          />
        </Suspense>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPatientToDeleteId(null);
        }} 
        onConfirm={confirmDeletePatient}
        title="Xác nhận Xóa Bệnh Nhân"
        confirmText="Xác nhận Xóa"
      >
        <p>
          Bạn có chắc chắn muốn xóa bệnh nhân <strong>{patientToDelete?.name}</strong>? 
          Hành động này không thể được hoàn tác.
        </p>
      </ConfirmModal>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};