import React from 'react';
import { Patient, AdmissionStatus, TreatmentOption } from '../types/patient';

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

  // Helper function to get the latest note from patient history
  const getLatestNote = (patient: Patient): string => {
    if (!patient.history || patient.history.length === 0) {
      return patient.notes || '';
    }
    const latestEntry = patient.history[patient.history.length - 1];
    return latestEntry.notes || '';
  };

  const handlePrint = () => {
    window.print();
  };
  
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="space-y-6">
      <div id="print-area">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Báo cáo bệnh nhân nội trú Ung bướu
        </h3>
        <p className="text-center text-gray-600 mb-6">Ngày: {today}</p>
        
        <div className="space-y-4">
          {patientsToReport.length > 0 ? (
            patientsToReport.map((patient, index) => (
              <div 
                key={patient.id} 
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 break-inside-avoid"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-indigo-700">
                    {index + 1}. {patient.name} - {patient.birthYear}
                  </h4>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    patient.status === AdmissionStatus.INPATIENT 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  MSBN: {patient.patientCode} | Phòng: {patient.roomNumber}
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="break-words">
                    <span className="font-semibold text-gray-600">Lý do vào viện:</span> {patient.reason}
                  </p>
                  <p className="break-words">
                    <span className="font-semibold text-gray-600">Chẩn đoán:</span> {patient.diagnosis}
                  </p>
                  <p className="col-span-2 break-words">
                    <span className="font-semibold text-gray-600">Ghi chú gần nhất:</span> {getLatestNote(patient)}
                  </p>
                  
                  {/* Treatment Options */}
                  {patient.treatmentOptions && patient.treatmentOptions.length > 0 && (
                    <p className="col-span-2 break-words">
                      <span className="font-semibold text-gray-600">Hướng điều trị:</span> {patient.treatmentOptions.join(', ')}
                    </p>
                  )}
                  
                  {/* Surgery Details */}
                  {patient.treatmentOptions?.includes(TreatmentOption.SURGERY) && patient.surgeryDetails && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-gray-300">
                      <p className="font-semibold text-gray-700 mb-1">Chi tiết phẫu thuật:</p>
                      <div className="ml-4 space-y-1">
                        {patient.surgeryDetails.procedure && (
                          <p><span className="font-semibold text-gray-600">Xử trí:</span> {patient.surgeryDetails.procedure}</p>
                        )}
                        {patient.surgeryDetails.surgeryDate && (
                          <p><span className="font-semibold text-gray-600">Ngày mổ:</span> {new Date(patient.surgeryDetails.surgeryDate).toLocaleDateString('vi-VN')}</p>
                        )}
                        {(patient.surgeryDetails.surgeon || patient.surgeryDetails.assistant1 || patient.surgeryDetails.assistant2) && (
                          <p>
                            <span className="font-semibold text-gray-600">PTV:</span>{' '}
                            {[
                              patient.surgeryDetails.surgeon,
                              patient.surgeryDetails.assistant1,
                              patient.surgeryDetails.assistant2
                            ].filter(Boolean).join(' - ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
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