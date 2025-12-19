import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Create a proper localStorage mock with actual storage
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

const localStorageMock = createLocalStorageMock();
global.localStorage = localStorageMock as unknown as Storage;

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

// Mock navigator.vibrate for haptic tests
Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn(),
  writable: true,
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: vi.fn(),
    writeText: vi.fn(),
  },
  writable: true,
});
