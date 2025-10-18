import React from 'react';
import { SyncStatus } from '../types/patient';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ status }) => {
  if (status.status === 'idle') return null;

  const getStatusContent = () => {
    switch (status.status) {
      case 'loading':
        return { 
          text: 'Đang tải...', 
          icon: 'animate-spin h-4 w-4 mr-2', 
          color: 'text-gray-600' 
        };
      case 'syncing':
        return { 
          text: 'Đang đồng bộ...', 
          icon: 'animate-spin h-4 w-4 mr-2', 
          color: 'text-gray-600' 
        };
      case 'success':
        return { 
          text: 'Đã đồng bộ', 
          icon: 'h-4 w-4 mr-2', 
          color: 'text-green-600' 
        };
      case 'error':
        return { 
          text: `Lỗi: ${status.error}`, 
          icon: 'h-4 w-4 mr-2', 
          color: 'text-red-600' 
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();
  if (!content) return null;

  const iconMap = {
    spinner: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
          clipRule="evenodd" 
        />
      </svg>
    ),
  };
  
  let icon;
  if (status.status === 'loading' || status.status === 'syncing') {
    icon = iconMap.spinner;
  } else if (status.status === 'success') {
    icon = iconMap.success;
  } else if (status.status === 'error') {
    icon = iconMap.error;
  }

  return (
    <div className={`flex items-center text-xs mt-1 ${content.color}`}>
      <div className={content.icon}>{icon}</div>
      <span>{content.text}</span>
    </div>
  );
};