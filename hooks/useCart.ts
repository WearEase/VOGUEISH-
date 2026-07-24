// hooks/useCart.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { CartItem, WishlistItem, Coupon } from '@/types/cart';

const coupons: Coupon[] = [
  { code: "SAVE10", discount: 10, description: "Get 10% off your order", minOrder: 1000 },
  { code: "WELCOME20", discount: 20, description: "New customer discount", minOrder: 2000, maxDiscount: 500 },
  { code: "PREMIUM25", discount: 25, description: "Premium member exclusive", minOrder: 5000, maxDiscount: 1000 },
  { code: "FLAT500", discount: 500, description: "Flat ₹500 off", minOrder: 3000 },
];

const CART_KEY = 'ecommerce-cart';
const WISHLIST_KEY = 'ecommerce-wishlist';

// Module-level tracker to prevent redundant DB writes on rapid tab switching
let lastSyncedCartStr: string | null = null;

// Module-level tracker to deduplicate API calls when useCart is used in multiple components
let currentSyncSessionEmail: string | null = null;

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const { data: session, status } = useSession();

  // Load cart and wishlist from localStorage (Single source of truth)
  const loadCartAndWishlist = () => {
    const savedCart = localStorage.getItem(CART_KEY) || '[]';
    const savedWishlist = localStorage.getItem(WISHLIST_KEY) || '[]';
    
    try {
      const cartData = JSON.parse(savedCart);
      const wishlistData = JSON.parse(savedWishlist);

      // Normalize legacy cart items
      const normalizedCart: CartItem[] = Array.isArray(cartData)
        ? cartData.map((item: any) => {
            const realPrice =
              typeof item?.realPrice === 'number'
                ? item.realPrice
                : typeof item?.price === 'number'
                  ? item.price
                  : 0;

            const inStock = typeof item?.inStock === 'boolean' ? item.inStock : true;

            return {
              ...item,
              realPrice,
              quantity: typeof item?.quantity === 'number' ? item.quantity : 1,
              inStock,
            } as CartItem;
          })
        : [];

      setCart(normalizedCart);
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading cart/wishlist:', error);
      setCart([]);
      setWishlist([]);
    }
    
    setIsLoading(false);
    setIsInitialized(true);
  };

  // Initial load and storage event listener
  useEffect(() => {
    loadCartAndWishlist();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_KEY || e.key === WISHLIST_KEY) {
        loadCartAndWishlist();
      }
    };
    const handleCartUpdated = () => {
      loadCartAndWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ecommerce-cart-updated', handleCartUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ecommerce-cart-updated', handleCartUpdated);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && isInitialized) {
      const currentSaved = localStorage.getItem(CART_KEY);
      const newSaved = JSON.stringify(cart);
      if (currentSaved !== newSaved) {
        localStorage.setItem(CART_KEY, newSaved);
        window.dispatchEvent(new Event('ecommerce-cart-updated'));
      }
    }
  }, [cart, isLoading, isInitialized]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && isInitialized) {
      const currentSaved = localStorage.getItem(WISHLIST_KEY);
      const newSaved = JSON.stringify(wishlist);
      if (currentSaved !== newSaved) {
        localStorage.setItem(WISHLIST_KEY, newSaved);
      }
    }
  }, [wishlist, isLoading, isInitialized]);

  // Handle Login Sync (Lazy Event-Driven Sync)
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && isInitialized) {
      // Deduplicate: If 50 ProductCards mount useCart simultaneously, only the first one should fire the sync API
      if (currentSyncSessionEmail === session.user.email) return;
      currentSyncSessionEmail = session.user.email;

      const syncCartWithDb = async () => {
        try {
          const res = await fetch('/api/cart/sync');
          if (res.ok) {
            const dbData = await res.json();
            const dbCart = JSON.parse(dbData.cartData || '[]');
            const localCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

            if (dbCart.length > 0 && localCart.length === 0) {
              // User logged in on a new device with an empty cart. Restore from DB.
              setCart(dbCart);
              const dbCartStr = JSON.stringify(dbCart);
              localStorage.setItem(CART_KEY, dbCartStr);
              lastSyncedCartStr = dbCartStr;
              window.dispatchEvent(new Event('ecommerce-cart-updated'));
            } else if (localCart.length > 0) {
              // Local cart has items. Push to DB to safely back them up.
              const localCartStr = JSON.stringify(localCart);
              await fetch('/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartData: localCartStr }),
              });
              lastSyncedCartStr = localCartStr;
            }
          }
        } catch (error) {
          console.error('Failed to sync cart on login', error);
        }
      };
      syncCartWithDb();
    }
  }, [status, session?.user?.email, isInitialized]);

  // Tab Close / Background Sync (Visibility Change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && status === 'authenticated' && session?.user?.email) {
        const localCart = localStorage.getItem(CART_KEY);
        // Only fire if cart has items AND it is strictly different from the last synced cart
        if (localCart && localCart !== '[]' && localCart !== lastSyncedCartStr) {
          lastSyncedCartStr = localCart; // Update immediately to prevent duplicate fires
          // keepalive: true ensures the request completes even as the browser tab closes
          fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartData: localCart }),
            keepalive: true,
          }).catch(() => {}); // Silent catch because the tab might be closing
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [status, session?.user?.email]);

  const showNotification = (message: string) => {
    setNotification(message);
    toast.success(message);
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

  const addToCart = (product: any, selectedSize?: string, qty: number = 1): void => {
    const size = selectedSize || (Array.isArray(product.sizesAvailable) && product.sizesAvailable.length > 0 ? String(product.sizesAvailable[0]) : 'M');
    const cartItemId = `${product.slug}-${size}`;
    const numericPrice = typeof product.discountedPrice === 'string'
      ? Number(product.discountedPrice.replace(/[^0-9.]/g, ''))
      : product.discountedPrice;

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === cartItemId);
      if (idx > -1) {
        const nextState = [...prev];
        nextState[idx] = { 
          ...nextState[idx], 
          quantity: (nextState[idx].quantity || 1) + qty 
        };
        return nextState;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          size,
          realPrice: numericPrice,
          quantity: qty,
          image: product.mainImage,
          slug: product.slug,
          inStock: true,
        }
      ];
    });
    showNotification(`Added ${size} size of ${product.name} to cart`);
  };

  const moveToWishlist = (item: CartItem): void => {
    const wishlistItem: WishlistItem = {
      id: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.realPrice,
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
    localStorage.setItem(CART_KEY, "[]");
    window.dispatchEvent(new Event('ecommerce-cart-updated'));
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
    return cart.reduce((total, item) => {
      const price = typeof item.realPrice === 'number' && !isNaN(item.realPrice) ? item.realPrice : (parseFloat(String((item as any).price).replace(/[^\d.-]/g, '')) || 0);
      return total + (price * (item.quantity || 1));
    }, 0);
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
      const originalPrice = Math.round(item.realPrice * 1.25);
      return acc + (originalPrice - item.realPrice) * item.quantity;
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
    addToCart,
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