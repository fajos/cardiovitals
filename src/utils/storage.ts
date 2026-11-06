import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In-memory fallback if native storage and localStorage are both unavailable
const memoryStorage = new Map<string, string>();

export const UniversalStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      // If running on web, prefer localStorage for immediate, non-blocking synchronous access
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (err: any) {
      // Fallback for Web or unlinked native modules
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          return window.localStorage.getItem(key);
        } catch {
          // ignore
        }
      }
      return memoryStorage.get(key) || null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (err: any) {
      // Fallback for Web or unlinked native modules
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(key, value);
          return;
        } catch {
          // ignore
        }
      }
      memoryStorage.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (err: any) {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.removeItem(key);
          return;
        } catch {
          // ignore
        }
      }
      memoryStorage.delete(key);
    }
  },

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
        return;
      }
      await AsyncStorage.clear();
    } catch (err: any) {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.clear();
          return;
        } catch {
          // ignore
        }
      }
      memoryStorage.clear();
    }
  },
};
