import { GET } from '../../../../app/api/orders/[id]/route';
import { NextRequest } from 'next/server';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OrderModel as Order } from '../../../../models/Order';
import { connectDB } from '../../../../lib/db';

vi.mock('../../../../lib/db', () => ({
  connectDB: vi.fn(),
}));

vi.mock('../../../../models/Order', () => ({
  OrderModel: {
    findOne: vi.fn(),
  }
}));

describe('GET /api/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 when order is not found', async () => {
    (Order.findOne as any).mockResolvedValue(null);

    // Mock NextRequest is not strictly needed for standard Request, but we pass what GET expects
    const req = new Request('http://localhost:3000/api/orders/invalid');
    const response = await GET(req, { params: Promise.resolve({ id: 'invalid' }) } as any);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Order not found');
  });

  it('should return 200 and the order data on success', async () => {
    const mockOrderData = { id: 'ORD-1234', totalAmount: 5000, status: 'Confirmed' };
    (Order.findOne as any).mockResolvedValue(mockOrderData);

    const req = new Request('http://localhost:3000/api/orders/ORD-1234');
    const response = await GET(req, { params: Promise.resolve({ id: 'ORD-1234' }) } as any);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockOrderData);
  });

  it('should return 500 on database error', async () => {
    (Order.findOne as any).mockRejectedValue(new Error('DB connection failed'));

    const req = new Request('http://localhost:3000/api/orders/ORD-1234');
    const response = await GET(req, { params: Promise.resolve({ id: 'ORD-1234' }) } as any);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch order details');
  });
});
