import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSession } from 'next-auth/react';

// The vi.mock for next-auth/react is handled in vitest.setup.ts

describe('useCart Hook', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorage.clear();
    // Clear any mocks
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cart: [] }),
    });
  });

  it('should initialize with an empty cart and correct default state', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cart).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.discount).toBe(0);
  });

  it('should add a product to the cart and update localStorage', () => {
    const { result } = renderHook(() => useCart());
    
    const mockProduct = {
      id: 'prod-123',
      slug: 'test-shirt',
      name: 'Test Shirt',
      brand: 'TestBrand',
      sizesAvailable: ['M', 'L'],
      discountedPrice: 999,
      mainImage: '/test.jpg'
    };

    act(() => {
      // simulate initial load completion
      window.dispatchEvent(new Event('storage'));
    });

    act(() => {
      result.current.addToCart(mockProduct, 'M', 1);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe('test-shirt-M');
    expect(result.current.cart[0].quantity).toBe(1);
    
    // It should have updated localStorage
    const savedCart = JSON.parse(localStorage.getItem('ecommerce-cart') || '[]');
    expect(savedCart).toHaveLength(1);
  });

  it('should save to the unified ecommerce-cart for logged-in users', () => {
    // Mock user being logged in
    (useSession as any).mockReturnValue({
      data: { user: { email: 'user@example.com' } },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useCart());
    
    const mockProduct = {
      id: 'prod-456',
      slug: 'test-pants',
      name: 'Test Pants',
      brand: 'TestBrand',
      sizesAvailable: ['L'],
      discountedPrice: 1500,
      mainImage: '/test2.jpg'
    };

    act(() => {
      result.current.addToCart(mockProduct, 'L', 1);
    });

    // Expect it to save to the unified cart key
    const savedCart = JSON.parse(localStorage.getItem('ecommerce-cart') || '[]');
    expect(savedCart).toHaveLength(1);
  });
});
