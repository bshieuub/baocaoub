import React, { useRef, useState } from 'react';
import { Patient } from '../types/patient';
import { exportPatients, exportPatientsCSV, importPatients, generateBackup } from '../utils/dataExport';
import { LoadingSpinner } from './LoadingSpinner';

interface DataManagementProps {
  patients: Patient[];
  onImportPatients: (patients: Patient[]) => void;
  onClose: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  patients,
  onImportPatients,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportJSON = () => {
    exportPatients(patients);
  };

  const handleExportCSV = () => {
    exportPatientsCSV(patients);
  };

  const handleExportBackup = () => {
    const backup = generateBackup(patients);
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `patients-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    try {
      const importedPatients = await importPatients(file);
      onImportPatients(importedPatients);
      setImportMessage({
        type: 'success',
        text: `Đã import thành công ${importedPatients.length} bệnh nhân.`
      });
    } catch (error) {
      setImportMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Có lỗi xảy ra khi import dữ liệu.'
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quản lý dữ liệu</h3>
        
        {/* Export Section */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Xuất dữ liệu</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Backup
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Nhập dữ liệu</h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
              {isImporting ? 'Đang import...' : 'Chọn file JSON'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Chỉ hỗ trợ file JSON. File phải chứa danh sách bệnh nhân hợp lệ.
          </p>
        </div>

        {/* Import Message */}
        {importMessage && (
          <div className={`p-3 rounded-md ${
            importMessage.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {importMessage.text}
          </div>
        )}

        {/* Statistics */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-md font-medium text-gray-700 mb-2">Thống kê dữ liệu</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Tổng số</p>
              <p className="font-semibold text-lg">{patients.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Đang điều trị</p>
              <p className="font-semibold text-lg text-blue-600">
                {patients.filter(p => p.status !== 'Ra viện').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Đã ra viện</p>
              <p className="font-semibold text-lg text-green-600">
                {patients.filter(p => p.status === 'Ra viện').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Dự kiến ra viện</p>
              <p className="font-semibold text-lg text-yellow-600">
                {patients.filter(p => p.status === 'Dự kiến ra viện').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};