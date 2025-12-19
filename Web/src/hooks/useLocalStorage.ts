"use client";

import { useState, useEffect } from 'react';

/**
 * SSR-safe localStorage hook
 * Returns null during SSR and hydration, then the actual value
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        setValue(JSON.parse(stored));
      } catch {
        setValue(stored as unknown as T);
      }
    }
    setIsHydrated(true);
  }, [key]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof newValue === 'string') {
      localStorage.setItem(key, newValue);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue, isHydrated];
}

/**
 * SSR-safe localStorage getter
 * Returns null during SSR
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

/**
 * SSR-safe localStorage setter
 */
export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

/**
 * SSR-safe localStorage remover
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
