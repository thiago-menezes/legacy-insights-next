import { STORAGE_KEY } from './constants';
import { ShellPreferences } from './types';

export const loadPreferences = (): ShellPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse shell preferences:', e);
  }
  return {
    sidebarVisible: true,
    headerVisible: true,
  };
};
