/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';

const parseNumericPrice = (val: any): number => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import { useCart } from '@/hooks/useCart';
import { Form } from '@/components/ui/form';
import FormField from '@/components/FormField';
import AddressSelector from '@/components/ui/AddressSelector';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(4, 'ZIP / Pincode is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  payment: z.enum(['card', 'upi', 'cod']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();
  const [localUserEmail, setLocalUserEmail] = useState('');
  React.useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.email) {
        setLocalUserEmail(user.email);
      }
    } catch {
      // ignore
    }
  }, []);



  const {
    cart,
    clearCart,
    getSubtotal,
    getShippingFee,
    getTax,
    getTotal,
    appliedCoupon,
    discount,
  } = useCart();

  // Sync cart to MongoDB on mount for cross-device sync
  React.useEffect(() => {
    if (session?.user?.email && cart.length > 0) {
      fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartData: JSON.stringify(cart) }),
      }).catch(err => console.error('Failed to sync cart on checkout', err));
    }
  }, [session?.user?.email, cart.length]); // Only sync when cart length changes or user loads

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      country: 'India',
      payment: 'card',
    },
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();

  const handleSelectAddress = (address: any) => {
    setSelectedAddressId(address._id);
    form.setValue('street', address.street, { shouldValidate: true });
    form.setValue('city', address.city, { shouldValidate: true });
    form.setValue('state', address.state, { shouldValidate: true });
    form.setValue('zipCode', address.postalCode, { shouldValidate: true });
    form.setValue('country', address.country || 'India', { shouldValidate: true });
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      router.push('/shop');
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const email = session?.user?.email || localUserEmail || "buyer@vogueish.com";
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      id: orderId,
      userEmail: email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      shippingAddress: {
        street: values.street,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
      },
      items: cart.map(item => ({
        productId: String(item.id || item.productId || (item as any)._id || Math.random().toString()),
        name: String(item.name || (item as any).title || 'Unknown Product'),
        brand: String(item.brand || 'Vogueish'),
        price: parseNumericPrice(item.realPrice || (item as any).price || (item as any).discountedPrice),
        quantity: Number(item.quantity) || 1,
        size: String((item as any).selectedSize || item.size || 'M'),
        image: String(item.image || (item as any).mainImage || ''),
      })),
      subtotal,
      shippingFee,
      tax,
      discount,
      totalAmount: total,
      paymentMethod: values.payment,
    };

    const placeOrder = async (finalPayload: any) => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });

        if (!res.ok) {
          throw new Error('Failed to create order');
        }

        clearCart();
        toast.success('Order placed successfully!');
        router.push('/otp?next=/thank-you');
      } catch (err) {
        console.error(err);
        toast.error('Failed to place order. Please try again.');
        setIsProcessing(false);
      }
    };

    if (values.payment === 'cod' || (values.payment as string) === 'skip_razorpay') {
      await placeOrder(orderPayload);
    } else {
      // Razorpay Flow
      try {
        const loadScript = () => {
          return new Promise((resolve) => {
            if ((window as any).Razorpay) {
              resolve(true);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const res = await loadScript();
        if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setIsProcessing(false);
          return;
        }

        // 1. Create order on server
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        });
        
        const orderData = await createRes.json();
        
        if (!createRes.ok || !orderData.orderId) {
          toast.error(orderData.error || 'Failed to initialize payment');
          setIsProcessing(false);
          return;
        }

        // 2. Initialize Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: orderData.amount,
          currency: "INR",
          name: "Vogueish",
          description: "Order Payment",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              const finalPayload = {
                ...orderPayload,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                paymentStatus: 'Paid',
              };
              await placeOrder(finalPayload);
            } else {
              toast.error('Payment verification failed!');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${values.firstName} ${values.lastName}`,
            email: email,
            contact: values.phone,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: function() {
              toast.error('Payment cancelled');
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error(response.error.description || 'Payment failed');
          setIsProcessing(false);
        });
        rzp.open();
      } catch (err) {
        console.error(err);
        toast.error('Error initializing payment. Please try again.');
        setIsProcessing(false);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-serif text-center mb-10">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>

              <div className="p-8">
                <AddressSelector onSelectAddress={handleSelectAddress} selectedAddressId={selectedAddressId} />
                <div className="pt-6" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        label="First Name"
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        label="Last Name"
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="street"
                      label="Street Address"
                      placeholder="Flat / House No / Building / Street"
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        label="City"
                        placeholder="e.g. Bengaluru"
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        label="State"
                        placeholder="e.g. Karnataka"
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        label="Pincode"
                        placeholder="e.g. 560001"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="country"
                        label="Country"
                        placeholder="e.g. India"
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        label="Phone"
                      />
                    </div>

                    <div className="pt-2" />

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold">Payment Method</h2>
                      </div>

                      <div className="p-6 space-y-3">
                        {(
                          [
                            { value: 'card' as const, label: 'Credit / Debit Card' },
                            { value: 'upi' as const, label: 'UPI / Wallet' },
                            { value: 'cod' as const, label: 'Cash on Delivery' },
                            { value: 'skip_razorpay' as const, label: 'Skip Razorpay (Test Mode)' },
                          ] as const
                        ).map((method) => (
                          <label
                            key={method.value}
                            className="flex items-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-black transition-all"
                          >
                            <input
                              type="radio"
                              value={method.value}
                              className="w-4 h-4 text-black focus:ring-black"
                              {...form.register('payment')}
                            />
                            <span className="ml-3 font-medium text-gray-700">{method.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium tracking-wide hover:bg-neutral-800 transition-all shadow-lg disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isProcessing ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-28">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({appliedCoupon})</span>
                  <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

