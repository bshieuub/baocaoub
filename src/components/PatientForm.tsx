import React, { useState, useEffect } from 'react';
import { Patient, PatientFormData, AdmissionStatus, TreatmentOption } from '../types/patient';
import { validatePatientForm, sanitizeInput, ValidationError } from '../utils/validation';

interface PatientFormProps {
  onSave: (patientData: any) => void;
  onClose: () => void;
  patientToEdit?: Patient | null;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onSave, 
  onClose, 
  patientToEdit 
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    birthYear: '',
    patientCode: '',
    roomNumber: '',
    reason: '',
    diagnosis: '',
    status: AdmissionStatus.INPATIENT,
    newNote: '',
    treatmentOptions: [],
    surgeryProcedure: '',
    surgeryDate: '',
    surgeon: '',
    assistant1: '',
    assistant2: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        birthYear: patientToEdit.birthYear.toString(),
        patientCode: patientToEdit.patientCode,
        roomNumber: patientToEdit.roomNumber,
        reason: patientToEdit.reason,
        diagnosis: patientToEdit.diagnosis,
        status: patientToEdit.status,
        newNote: '',
        treatmentOptions: patientToEdit.treatmentOptions || [],
        surgeryProcedure: patientToEdit.surgeryDetails?.procedure || '',
        surgeryDate: patientToEdit.surgeryDetails?.surgeryDate || '',
        surgeon: patientToEdit.surgeryDetails?.surgeon || '',
        assistant1: patientToEdit.surgeryDetails?.assistant1 || '',
        assistant2: patientToEdit.surgeryDetails?.assistant2 || '',
      });
    } else {
      setFormData({
        name: '',
        birthYear: '',
        patientCode: '',
        roomNumber: '',
        reason: '',
        diagnosis: '',
        status: AdmissionStatus.INPATIENT,
        newNote: '',
        treatmentOptions: [],
        surgeryProcedure: '',
        surgeryDate: '',
        surgeon: '',
        assistant1: '',
        assistant2: '',
      });
    }
    setErrors([]);
  }, [patientToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nativeEvent = e.nativeEvent as InputEvent & { inputType?: string; isComposing?: boolean };
    const isExplicitlyComposing = nativeEvent?.isComposing ?? false;
    const isPotentialCompositionInput = nativeEvent?.inputType === 'insertCompositionText';
    const shouldDeferSanitize = isExplicitlyComposing || (isPotentialCompositionInput && nativeEvent?.isComposing !== false);

    const sanitizedValue = name === 'roomNumber'
      ? sanitizeInput(value, { skipCharacterWhitelist: true, maxLength: 50 })
      : sanitizeInput(value);

    setFormData(prev => ({ ...prev, [name]: shouldDeferSanitize ? value : sanitizedValue }));

    if (!shouldDeferSanitize && errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  const handleTreatmentOptionChange = (option: TreatmentOption) => {
    setFormData(prev => {
      const isSelected = prev.treatmentOptions.includes(option);
      const newOptions = isSelected
        ? prev.treatmentOptions.filter(o => o !== option)
        : [...prev.treatmentOptions, option];
      return { ...prev, treatmentOptions: newOptions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validatePatientForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const patientData: any = {
        name: formData.name,
        birthYear: parseInt(formData.birthYear, 10),
        patientCode: formData.patientCode,
        roomNumber: formData.roomNumber,
        reason: formData.reason,
        diagnosis: formData.diagnosis,
        status: formData.status,
        treatmentOptions: formData.treatmentOptions,
      };

      // Add surgery details if surgery is selected
      if (formData.treatmentOptions.includes(TreatmentOption.SURGERY)) {
        patientData.surgeryDetails = {
          procedure: formData.surgeryProcedure,
          surgeryDate: formData.surgeryDate,
          surgeon: formData.surgeon,
          assistant1: formData.assistant1,
          assistant2: formData.assistant2,
        };
      }
      
      if (patientToEdit) {
        onSave({ ...patientData, id: patientToEdit.id });
      } else {
        onSave({ ...patientData, notes: formData.newNote });
      }
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedHistory = patientToEdit?.history?.slice().reverse() ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Họ tên bệnh nhân *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.find(e => e.field === 'name') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            maxLength={100}
          />
          {errors.find(e => e.field === 'name') && (
            <p className="mt-1 text-sm text-red-600">
              {errors.find(e => e.field === 'name')?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Năm sinh *
          </label>
          <input
            type="number"
            name="birthYear"
            value={formData.birthYear}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.find(e => e.field === 'birthYear') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            min="1900"
            max={new Date().getFullYear()}
          />
          {errors.find(e => e.field === 'birthYear') && (
            <p className="mt-1 text-sm text-red-600">
              {errors.find(e => e.field === 'birthYear')?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mã số bệnh nhân *
          </label>
          <input
            type="text"
            name="patientCode"
            value={formData.patientCode}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.find(e => e.field === 'patientCode') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            maxLength={20}
          />
          {errors.find(e => e.field === 'patientCode') && (
            <p className="mt-1 text-sm text-red-600">
              {errors.find(e => e.field === 'patientCode')?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số phòng *
          </label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.find(e => e.field === 'roomNumber') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            maxLength={50}
          />
          {errors.find(e => e.field === 'roomNumber') && (
            <p className="mt-1 text-sm text-red-600">
              {errors.find(e => e.field === 'roomNumber')?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tình trạng nhập viện *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.values(AdmissionStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lý do vào viện *
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.find(e => e.field === 'reason') ? 'border-red-500' : 'border-gray-300'
          }`}
          required
          maxLength={500}
        />
        {errors.find(e => e.field === 'reason') && (
          <p className="mt-1 text-sm text-red-600">
            {errors.find(e => e.field === 'reason')?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chẩn đoán hiện tại *
        </label>
        <textarea
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.find(e => e.field === 'diagnosis') ? 'border-red-500' : 'border-gray-300'
          }`}
          required
          maxLength={500}
        />
        {errors.find(e => e.field === 'diagnosis') && (
          <p className="mt-1 text-sm text-red-600">
            {errors.find(e => e.field === 'diagnosis')?.message}
          </p>
        )}
      </div>

      {/* Treatment Options Section */}
      <div className="pt-4 mt-4 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Hướng điều trị
        </label>
        <div className="space-y-2">
          {Object.values(TreatmentOption).map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.treatmentOptions.includes(option)}
                onChange={() => handleTreatmentOptionChange(option)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Surgery Details Section */}
      {formData.treatmentOptions.includes(TreatmentOption.SURGERY) && (
        <div className="pt-4 mt-4 border-t bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-800 mb-3">Chi tiết phẫu thuật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Xử trí
              </label>
              <input
                type="text"
                name="surgeryProcedure"
                value={formData.surgeryProcedure}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày mổ
              </label>
              <input
                type="date"
                name="surgeryDate"
                value={formData.surgeryDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phẫu thuật viên
              </label>
              <input
                type="text"
                name="surgeon"
                value={formData.surgeon}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phụ 1
              </label>
              <input
                type="text"
                name="assistant1"
                value={formData.assistant1}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phụ 2
              </label>
              <input
                type="text"
                name="assistant2"
                value={formData.assistant2}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={100}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ghi chú / Diễn biến mới
        </label>
        <textarea
          name="newNote"
          value={formData.newNote}
          onChange={handleChange}
          placeholder="Thêm diễn biến, y lệnh, hoặc thông tin bàn giao mới..."
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={1000}
        />
      </div>

      {patientToEdit && sortedHistory.length > 0 && (
        <div className="pt-4 mt-4 border-t">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Lịch sử điều trị & Ghi chú
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {sortedHistory.map((entry, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {new Date(entry.date).toLocaleString('vi-VN')}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Chẩn đoán:</span> {entry.diagnosis}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Ghi chú:</span> {entry.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang lưu...' : (patientToEdit ? 'Cập nhật' : 'Thêm mới')}
        </button>
      </div>
    </form>
  );
};