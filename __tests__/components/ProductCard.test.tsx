import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/shop/ProductCard';
import { useCart } from '../../hooks/useCart';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

// Mock the useCart hook
vi.mock('../../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

const mockProduct = {
  id: 'p1',
  name: 'Test Product',
  brand: 'Test Brand',
  price: 1000,
  realPrice: 1200,
  discountedPrice: 800,
  slug: 'test-product',
  mainImage: '/test.jpg',
  sizesAvailable: ['S', 'M', 'L'],
  description: 'Test description',
};

describe('ProductCard Component', () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    (useCart as any).mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct as any} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  it('toggles the size selection popup when cart icon is clicked', () => {
    render(<ProductCard product={mockProduct as any} />);
    
    // Popup should not be visible initially
    expect(screen.queryByText('Select Size:')).not.toBeInTheDocument();

    // Click cart icon
    const cartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(cartButton);

    // Popup should now be visible
    expect(screen.getByText('Select Size:')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('calls addToCart with selected size when a size is clicked', () => {
    render(<ProductCard product={mockProduct as any} />);
    
    // Open popup
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    // Select size 'L'
    fireEvent.click(screen.getByText('L'));

    // Check if addToCart was called with correct size
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 'L');
    
    // Popup should close
    expect(screen.queryByText('Select Size:')).not.toBeInTheDocument();
  });
});
