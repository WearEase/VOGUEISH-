import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddressSelector from '../AddressSelector';
import { useSession } from 'next-auth/react';

const mockAddresses = [
  {
    _id: '1',
    street: '123 Test St',
    city: 'Testville',
    state: 'TS',
    postalCode: '12345',
    country: 'India',
    isDefault: true,
  },
  {
    _id: '2',
    street: '456 Other Ave',
    city: 'Other City',
    state: 'OS',
    postalCode: '67890',
    country: 'India',
    isDefault: false,
  }
];

describe('AddressSelector', () => {
  const mockOnSelectAddress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSession as any).mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });
    global.fetch = vi.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ addresses: mockAddresses }),
      })
    ) as any;
  });

  it('renders loading state initially', () => {
    render(<AddressSelector onSelectAddress={mockOnSelectAddress} />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders null if user is not authenticated', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    const { container } = render(<AddressSelector onSelectAddress={mockOnSelectAddress} />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('fetches and displays addresses', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ addresses: mockAddresses }),
      })
    ) as any;

    render(<AddressSelector onSelectAddress={mockOnSelectAddress} />);
    
    await waitFor(() => {
      expect(screen.getByText('Select Delivery Address')).toBeInTheDocument();
    });

    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('456 Other Ave')).toBeInTheDocument();
    
    // Auto-selects default address
    expect(mockOnSelectAddress).toHaveBeenCalledWith(mockAddresses[0]);
  });

  it('opens add new address form when clicked', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ addresses: [] }),
      })
    ) as any;

    render(<AddressSelector onSelectAddress={mockOnSelectAddress} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Address')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add New Address'));

    expect(screen.getByText('New Address Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Flat / House No / Street')).toBeInTheDocument();
  });
});
