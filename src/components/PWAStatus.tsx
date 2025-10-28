import React, { useState, useEffect } from 'react';
import { usePWAInstall } from './PWAInstallPrompt';

export const PWAStatus: React.FC = () => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isInstalled) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Ứng dụng đã được cài đặt</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <div className="flex items-center space-x-2 text-sm text-blue-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>Có thể cài đặt ứng dụng</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>
        {isOnline ? 'Trực tuyến' : 'Offline'} 
        {connectionType !== 'unknown' && ` (${connectionType})`}
      </span>
    </div>
  );
};