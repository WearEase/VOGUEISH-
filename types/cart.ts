// types/cart.ts
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  color?: string;
  size: string;
  realPrice: number;
  quantity: number;
  image: string;
  slug: string;
  inStock: boolean;
}

export interface Coupon {
  code: string;
  discount: number;
  description: string;
  minOrder?: number;
  maxDiscount?: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon: string;
  discount: number;
  discountType: 'percentage' | 'flat';
}