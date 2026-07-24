"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package2, Truck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MyOrdersPage() {
  const [trackedOrders, setTrackedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelRating, setCancelRating] = useState(0);

  useEffect(() => {
    try {
      const tracked = JSON.parse(localStorage.getItem("trackedOrders") || "[]");
      setTrackedOrders(tracked);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let email = session?.user?.email;
        if (!email) {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          email = localUser.email;
        }
        
        if (!email) {
          email = "buyer@vogueish.com";
        }

        const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [session?.user?.email]);
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
          <div>
            <p className="text-sm text-gray-500">My Orders</p>
            <h1 className="text-3xl font-semibold text-gray-900">Track your purchases</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Follow each order in real time and open custom tailoring whenever you need a better fit.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            Continue shopping
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found.</div>
          ) : orders.map((order) => (
            <section key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Package2 className="w-4 h-4" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">{order.id}</h2>
                  <p className="mt-1 text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {order.status}
                  </span>
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => setCancellingOrderId(order.id)}
                      className="text-xs text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-3 sm:grid-cols-2">
                  {order.items.map((item: any) => (
                    <div key={`${order.id}-${item.name}`} className="rounded-xl border border-gray-200 p-4">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Size: <span className="font-medium text-gray-900">{item.size}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <Link
                    href={order.trackingHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
                  >
                    Track order
                    <Truck className="w-4 h-4" />
                  </Link>
                  {trackedOrders.includes(order.id) && (
                    <Link
                      href={`/alteration?orderId=${order.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                    >
                      Apply custom tailoring
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* --- Cancel Order Modal --- */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif text-xl text-gray-900">Cancel Order</h3>
              <button onClick={() => setCancellingOrderId(null)} className="text-gray-400 hover:text-black transition">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // In real app, call API to update order status
              setOrders(orders.map(o => o.id === cancellingOrderId ? { ...o, status: "Cancelled" } : o));
              setCancellingOrderId(null);
              setCancelReason("");
              setCancelRating(0);
              alert("Order cancelled successfully.");
            }} className="p-6">
              <p className="text-sm text-gray-600 mb-5">We&apos;re sorry to see you cancel this order. Could you tell us why?</p>
              
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">How was your shopping experience? (Optional)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCancelRating(star)}
                      className={`text-2xl transition ${cancelRating >= star ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Reason for cancellation (Optional)</label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Tell us what went wrong..."
                  className="w-full rounded-lg border-gray-300 py-3 px-3 text-sm focus:border-black focus:ring-black resize-none h-24"
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setCancellingOrderId(null)} className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                  Keep Order
                </button>
                <button type="submit" className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}