// Jest setup file
// Note: @testing-library/jest-dom is not installed, so we'll mock it
// import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./config/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null,
  },
  db: {
    collection: jest.fn(() => ({
      get: jest.fn(),
      add: jest.fn(),
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      })),
    })),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};