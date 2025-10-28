import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

interface OfflineData {
  patients: any[];
  lastSync: string;
  pendingChanges: any[];
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      syncPendingChanges();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline data from localStorage
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
        if (stored) {
          const data = JSON.parse(stored);
          setOfflineData(data);
          setPendingChanges(data.pendingChanges || []);
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();
  }, []);

  // Save data to localStorage when offline
  const saveOfflineData = useCallback((data: any) => {
    if (!isOnline) {
      try {
        const offlineData: OfflineData = {
          patients: data,
          lastSync: new Date().toISOString(),
          pendingChanges: pendingChanges,
        };
        
        localStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(offlineData));
        setOfflineData(offlineData);
      } catch (error) {
        console.error('Error saving offline data:', error);
      }
    }
  }, [isOnline, pendingChanges]);

  // Add pending change
  const addPendingChange = useCallback((change: any) => {
    if (!isOnline) {
      setPendingChanges(prev => [...prev, { ...change, timestamp: new Date().toISOString() }]);
    }
  }, [isOnline]);

  // Sync pending changes when online
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline || pendingChanges.length === 0) return;

    try {
      // Process pending changes here
      // This would typically involve calling your API
      console.log('Syncing pending changes:', pendingChanges);
      
      // Clear pending changes after successful sync
      setPendingChanges([]);
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    } catch (error) {
      console.error('Error syncing pending changes:', error);
    }
  }, [isOnline, pendingChanges]);

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    setOfflineData(null);
    setPendingChanges([]);
  }, []);

  return {
    isOnline,
    offlineData,
    pendingChanges,
    saveOfflineData,
    addPendingChange,
    syncPendingChanges,
    clearOfflineData,
    hasOfflineData: offlineData !== null,
    hasPendingChanges: pendingChanges.length > 0,
  };
};