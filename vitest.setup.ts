import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: '/',
      query: {},
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  };
});

// Mock Next-Auth
vi.mock('next-auth/react', () => {
  return {
    useSession: vi.fn(() => ({
      data: null,
      status: 'unauthenticated',
    })),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

// Mock ResizeObserver which is often needed by Radix/Shadcn
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
