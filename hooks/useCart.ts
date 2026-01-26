// hooks/useCart.ts
import { useState, useEffect } from 'react';
import { CartItem, WishlistItem, Coupon } from '@/types/cart';

const coupons: Coupon[] = [
  { code: "SAVE10", discount: 10, description: "Get 10% off your order", minOrder: 1000 },
  { code: "WELCOME20", discount: 20, description: "New customer discount", minOrder: 2000, maxDiscount: 500 },
  { code: "PREMIUM25", discount: 25, description: "Premium member exclusive", minOrder: 5000, maxDiscount: 1000 },
  { code: "FLAT500", discount: 500, description: "Flat ₹500 off", minOrder: 3000 },
];

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string>("");

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce-cart') || '[]';
    const savedWishlist = localStorage.getItem('ecommerce-wishlist') || '[]';
    
    try {
      const cartData = JSON.parse(savedCart);
      const wishlistData = JSON.parse(savedWishlist);
      
      setCart(cartData);
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading cart/wishlist:', error);
      setCart([]);
      setWishlist([]);
    }
    
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const updateQuantity = (id: string, change: number): void => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    ));
    showNotification("Cart updated");
  };

  const removeItem = (id: string): void => {
    setCart(cart.filter(item => item.id !== id));
    showNotification("Item removed from cart");
  };

  const moveToWishlist = (item: CartItem): void => {
    const wishlistItem: WishlistItem = {
      id: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: item.image,
      slug: item.slug,
    };
    
    // Check if already in wishlist
    if (!wishlist.some(w => w.id === wishlistItem.id)) {
      setWishlist([...wishlist, wishlistItem]);
    }
    
    removeItem(item.id);
    showNotification("Moved to wishlist");
  };

  const clearCart = (): void => {
    setCart([]);
    removeCoupon();
    showNotification("Cart cleared");
  };

  const applyCouponCode = (couponCode: string): boolean => {
    const validCoupon = coupons.find(c => c.code === couponCode.toUpperCase());
    const subtotal = getSubtotal();
    
    if (!validCoupon) {
      showNotification("Invalid coupon code");
      return false;
    }
    
    if (validCoupon.minOrder && subtotal < validCoupon.minOrder) {
      showNotification(`Minimum order of ₹${validCoupon.minOrder.toLocaleString()} required`);
      return false;
    }
    
    let discountAmount = validCoupon.discount;
    let type: 'percentage' | 'flat' = 'percentage';
    
    // Check if it's a flat discount (amount > 100 suggests flat discount)
    if (validCoupon.discount > 100) {
      type = 'flat';
      discountAmount = validCoupon.discount;
    } else {
      // It's a percentage discount
      discountAmount = (subtotal * validCoupon.discount) / 100;
      if (validCoupon.maxDiscount && discountAmount > validCoupon.maxDiscount) {
        discountAmount = validCoupon.maxDiscount;
      }
    }
    
    setDiscount(discountAmount);
    setDiscountType(type);
    setAppliedCoupon(couponCode.toUpperCase());
    showNotification(`Coupon applied! You saved ₹${discountAmount.toLocaleString()}`);
    return true;
  };

  const removeCoupon = (): void => {
    setDiscount(0);
    setAppliedCoupon("");
    setDiscountType('percentage');
    showNotification("Coupon removed");
  };

  const getSubtotal = (): number => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getShippingFee = (): number => {
    const subtotal = getSubtotal();
    return subtotal >= 1999 ? 0 : 214; // Free shipping above ₹1999
  };

  const getTax = (): number => {
    return Math.round((getSubtotal() - discount) * 0.18); // 18% GST
  };

  const getTotal = (): number => {
    return getSubtotal() - discount + getShippingFee() + getTax();
  };

  const getSavings = (): number => {
    return cart.reduce((acc, item) => {
      // Assuming 20% discount from original price for demo
      const originalPrice = Math.round(item.price * 1.25);
      return acc + (originalPrice - item.price) * item.quantity;
    }, 0) + discount;
  };

  return {
    cart,
    wishlist,
    discount,
    discountType,
    appliedCoupon,
    isLoading,
    notification,
    coupons,
    updateQuantity,
    removeItem,
    moveToWishlist,
    clearCart,
    applyCouponCode,
    removeCoupon,
    getSubtotal,
    getShippingFee,
    getTax,
    getTotal,
    getSavings,
    showNotification,
  };
};