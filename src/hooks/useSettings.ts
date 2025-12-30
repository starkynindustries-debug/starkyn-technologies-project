import { useState, useEffect, useCallback } from 'react';

export interface Settings {
  apiBaseUrl: string;
  refreshRate: number; // in milliseconds
  simulationMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  apiBaseUrl: 'http://192.168.1.100',
  refreshRate: 1000,
  simulationMode: true,
};

const STORAGE_KEY = 'motor-dashboard-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSettings, resetSettings };
};
