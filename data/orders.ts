export type OrderStatus = "Placed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";

export interface OrderItem {
  name: string;
  brand: string;
  size: string;
  price: number;
}

export interface OrderRecord {
  id: string;
  placedAt: string;
  status: OrderStatus;
  totalItems: number;
  totalAmount: number;
  trackingHref: string;
  applyTailoringHref: string;
  items: OrderItem[];
}

export const demoOrders: OrderRecord[] = [
  {
    id: "ORD-8821",
    placedAt: "04 Jun 2026",
    status: "Shipped",
    totalItems: 2,
    totalAmount: 8188,
    trackingHref: "/tracking?variant=order&orderId=ORD-8821",
    applyTailoringHref: "/custom-tailoring",
    items: [
      { name: "Product 1", brand: "Loro Piana", size: "L", price: 4689 },
      { name: "Product 6", brand: "Nike", size: "L", price: 3499 },
    ],
  },
  {
    id: "ORD-9014",
    placedAt: "30 May 2026",
    status: "Delivered",
    totalItems: 1,
    totalAmount: 6299,
    trackingHref: "/tracking?variant=order&orderId=ORD-9014",
    applyTailoringHref: "/custom-tailoring",
    items: [{ name: "Product 2", brand: "Zegna", size: "XL", price: 6299 }],
  },
];