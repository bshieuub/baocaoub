import React from 'react';
import { Patient, AdmissionStatus } from '../types/patient';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const StatusBadge: React.FC<{ status: AdmissionStatus }> = ({ status }) => {
  const getStatusClasses = (status: AdmissionStatus) => {
    switch (status) {
      case AdmissionStatus.INPATIENT:
        return 'bg-blue-100 text-blue-800';
      case AdmissionStatus.DISCHARGE_TODAY:
        return 'bg-yellow-100 text-yellow-800';
      case AdmissionStatus.DISCHARGED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
};

const DesktopHeader: React.FC = () => (
  <div className="hidden md:grid md:grid-cols-[40px_minmax(180px,1.5fr)_110px_80px_minmax(200px,2.5fr)_120px_100px] gap-x-6 px-6 py-3 text-xs text-gray-700 uppercase bg-gray-50 font-medium items-center border-b">
    <span className="text-center">STT</span>
    <span>Họ Tên</span>
    <span>MSBN</span>
    <span className="text-center">Phòng</span>
    <span>Chẩn Đoán</span>
    <span className="text-center">Tình Trạng</span>
    <span className="text-right">Hành Động</span>
  </div>
);

export const PatientTable: React.FC<PatientTableProps> = ({ 
  patients, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="md:border-t">
      {patients.map((patient, index) => (
        <div 
          key={patient.id} 
          className="bg-white p-4 mb-4 rounded-lg shadow md:shadow-none md:rounded-none md:mb-0 md:grid md:grid-cols-[40px_minmax(180px,1.5fr)_110px_80px_minmax(200px,2.5fr)_120px_100px] md:gap-x-6 md:px-6 md:py-4 md:border-b hover:bg-gray-50 items-center"
        >
          {/* STT (Desktop) */}
          <div className="hidden md:block text-center text-sm text-gray-500">
            {index + 1}
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-800 mb-2 pr-2 break-words">
                {index + 1}. {patient.name} 
                <span className="font-normal text-gray-500">({patient.birthYear})</span>
              </h3>
              <div className="flex justify-end items-center space-x-3 flex-shrink-0 pl-2">
                <button 
                  onClick={() => onEdit(patient)} 
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                  aria-label={`Sửa thông tin bệnh nhân ${patient.name}`}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => onDelete(patient)} 
                  className="font-medium text-red-600 hover:text-red-800"
                  aria-label={`Xóa bệnh nhân ${patient.name}`}
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-gray-500">MSBN</p>
                <p className="font-medium">{patient.patientCode}</p>
              </div>
              <div>
                <p className="text-gray-500">Phòng</p>
                <p className="font-medium">{patient.roomNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Tình trạng</p>
                <div className="font-medium">
                  <StatusBadge status={patient.status} />
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Chẩn đoán</p>
                <p className="font-medium break-words">{patient.diagnosis}</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block font-medium text-gray-900 break-words">
            {patient.name} <span className="text-gray-500">({patient.birthYear})</span>
          </div>
          <div className="hidden md:block text-sm text-gray-700">
            {patient.patientCode}
          </div>
          <div className="hidden md:block text-sm text-gray-700 text-center">
            {patient.roomNumber}
          </div>
          <div className="hidden md:block text-sm text-gray-700 break-words">
            {patient.diagnosis}
          </div>
          <div className="hidden md:block text-center">
            <StatusBadge status={patient.status} />
          </div>
          <div className="hidden md:flex justify-end items-center space-x-4">
            <button 
              onClick={() => onEdit(patient)} 
              className="font-medium text-indigo-600 hover:text-indigo-800"
              aria-label={`Sửa thông tin bệnh nhân ${patient.name}`}
            >
              Sửa
            </button>
            <button 
              onClick={() => onDelete(patient)} 
              className="font-medium text-red-600 hover:text-red-800"
              aria-label={`Xóa bệnh nhân ${patient.name}`}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { DesktopHeader };