import { useState } from 'react';
import { ShippingAddress, PaymentMethod, PromoCode, Order } from '@/types/checkout';
import { CartItem } from '@/types/cart';

export const useCheckout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit'
  });
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [homeTrialSelected, setHomeTrialSelected] = useState(false);

  const calculateShipping = (items: CartItem[], address: ShippingAddress): number => {
    // Mock shipping calculation
    const baseShipping = 9.99;
    const freeShippingThreshold = 100;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return totalValue >= freeShippingThreshold ? 0 : baseShipping;
  };

  const calculateTax = (subtotal: number, address: ShippingAddress): number => {
    // Mock tax calculation - 8.5% for US
    return address.country === 'US' ? subtotal * 0.085 : 0;
  };

  const applyPromoCode = (code: string, orderValue: number): PromoCode | null => {
    // Mock promo codes
    const promoCodes: { [key: string]: PromoCode } = {
      'WELCOME10': { code: 'WELCOME10', discount: 10, type: 'percentage' },
      'SAVE20': { code: 'SAVE20', discount: 20, type: 'fixed', minOrderValue: 100 },
      'FIRSTORDER': { code: 'FIRSTORDER', discount: 15, type: 'percentage', minOrderValue: 50 }
    };

    const promo = promoCodes[code.toUpperCase()];
    if (!promo) return null;
    
    if (promo.minOrderValue && orderValue < promo.minOrderValue) {
      return null;
    }

    setPromoCode(promo);
    return promo;
  };

  const processOrder = async (items: CartItem[]): Promise<Order> => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = calculateShipping(items, shippingAddress);
    const tax = calculateTax(subtotal, shippingAddress);
    const discount = promoCode 
      ? promoCode.type === 'percentage' 
        ? subtotal * (promoCode.discount / 100)
        : promoCode.discount
      : 0;
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items,
      subtotal,
      shipping,
      tax,
      discount,
      total: subtotal + shipping + tax - discount,
      shippingAddress,
      paymentMethod,
      promoCode: promoCode || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setIsProcessing(false);
    return order;
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    currentStep,
    shippingAddress,
    paymentMethod,
    promoCode,
    isProcessing,
    homeTrialSelected,
    setShippingAddress,
    setPaymentMethod,
    setPromoCode,
    setHomeTrialSelected,
    calculateShipping,
    calculateTax,
    applyPromoCode,
    processOrder,
    nextStep,
    prevStep,
    goToStep
  };
};
