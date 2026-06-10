"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package2, Truck } from "lucide-react";
import { demoOrders } from "@/data/orders";

export default function MyOrdersPage() {
  const [trackedOrders, setTrackedOrders] = useState<string[]>([]);

  useEffect(() => {
    try {
      const tracked = JSON.parse(localStorage.getItem("trackedOrders") || "[]");
      setTrackedOrders(tracked);
    } catch {
      // ignore
    }
  }, []);
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
          {demoOrders.map((order) => (
            <section key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Package2 className="w-4 h-4" />
                    <span>{order.placedAt}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">{order.id}</h2>
                  <p className="mt-1 text-gray-600">
                    {order.totalItems} item{order.totalItems > 1 ? "s" : ""} • ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {order.status}
                </span>
              </div>

              <div className="p-6 sm:p-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-3 sm:grid-cols-2">
                  {order.items.map((item) => (
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
                      href={order.applyTailoringHref}
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
    </main>
  );
}