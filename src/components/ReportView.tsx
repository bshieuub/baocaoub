import React from 'react';
import { Patient, AdmissionStatus, TreatmentDirection } from '../types/patient';

interface ReportViewProps {
  patients: Patient[];
  onClose: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ patients, onClose }) => {
  const patientsToReport = patients
    .filter(
      p => p.status === AdmissionStatus.INPATIENT || p.status === AdmissionStatus.DISCHARGE_TODAY
    )
    .sort((a, b) => (a.roomNumber || '').localeCompare(b.roomNumber || '', undefined, { numeric: true }));

  const handlePrint = () => {
    window.print();
  };
  
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="space-y-6">
      <div id="print-area">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2 print:text-xl print:mb-1">
          Báo cáo bệnh nhân nội trú Ung bướu
        </h3>
        <p className="text-center text-gray-600 mb-6 print:text-sm print:mb-2">Ngày: {today}</p>
        
        <div className="space-y-4 print:space-y-2">
          {patientsToReport.length > 0 ? (
            patientsToReport.map((patient, index) => (
              <div 
                key={patient.id} 
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 break-inside-avoid print:p-2 print:mb-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-indigo-700">
                    {index + 1}. {patient.name} - {patient.birthYear}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      patient.treatmentDirection === TreatmentDirection.SURGERY 
                        ? 'bg-purple-100 text-purple-800' 
                        : patient.treatmentDirection === TreatmentDirection.CHEMOTHERAPY
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {patient.treatmentDirection}
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      patient.status === AdmissionStatus.INPATIENT 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  MSBN: {patient.patientCode} | Phòng: {patient.roomNumber}
                </p>
                
                {patient.treatmentDirection === TreatmentDirection.SURGERY && patient.surgeryTeam && (
                  <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="text-sm">
                      <span className="font-semibold text-purple-700">Ekip phẫu thuật:</span>
                    </p>
                    <p className="text-sm text-gray-700 ml-2">
                      • PTV chính: {patient.surgeryTeam.mainSurgeon}
                    </p>
                    {patient.surgeryTeam.assistant1 && (
                      <p className="text-sm text-gray-700 ml-2">
                        • PTV phụ 1: {patient.surgeryTeam.assistant1}
                      </p>
                    )}
                    {patient.surgeryTeam.assistant2 && (
                      <p className="text-sm text-gray-700 ml-2">
                        • PTV phụ 2: {patient.surgeryTeam.assistant2}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="break-words">
                    <span className="font-semibold text-gray-600">Lý do vào viện:</span> {patient.reason}
                  </p>
                  <p className="break-words">
                    <span className="font-semibold text-gray-600">Chẩn đoán:</span> {patient.diagnosis}
                  </p>
                  <p className="col-span-2 break-words">
                    <span className="font-semibold text-gray-600">Ghi chú gần nhất:</span> {patient.notes}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Không có bệnh nhân nào cần báo cáo.
            </p>
          )}
        </div>
        <div className="mt-8 text-right text-sm text-gray-600">
          <p>bshieuubdl@gmail.com</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 no-print">
        <button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Đóng
        </button>
        <button 
          type="button" 
          onClick={handlePrint} 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>In Báo Cáo</span>
        </button>
      </div>
    </div>
  );
};
