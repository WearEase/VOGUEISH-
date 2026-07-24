import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSession } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    (useSession as any).mockReturnValue({
      data: { user: { email: 'test@vogueish.com' } },
      status: 'authenticated',
    });
    // Mock fetch for sync
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cart: [] })
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adds item to cart with correct size and generates notification', () => {
    const { result } = renderHook(() => useCart());
    
    const mockProduct = {
      id: 'p1',
      name: 'Test Jacket',
      brand: 'Test Brand',
      price: 1500,
      discountedPrice: 1200,
      slug: 'test-jacket',
      mainImage: '/test.jpg',
    };

    act(() => {
      result.current.addToCart(mockProduct, 'XL');
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].size).toBe('XL');
    expect(result.current.cart[0].id).toBe('test-jacket-XL');
    expect(result.current.notification).toBe('Added XL size of Test Jacket to cart');
  });
});
