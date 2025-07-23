import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Make Vitest's test functions available globally
globalThis.describe = vi.describe;
globalThis.test = vi.test;
globalThis.expect = vi.expect;
globalThis.beforeEach = vi.beforeEach;
globalThis.afterEach = vi.afterEach;
globalThis.beforeAll = vi.beforeAll;
globalThis.afterAll = vi.afterAll;
globalThis.jest = vi;