"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatINRFromUSD } from "@/lib/utils";
import { useSession } from "next-auth/react";
import SalesChart from "@/components/seller/SalesChart";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const sellerName = session.user.name || "B For Bottoms";
  const sellerEmail = session.user.email || "info@bforbottoms.com";
  const avatarFallback = sellerName.charAt(0).toUpperCase();

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-zinc-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="text-purple-600 dark:text-purple-400">{sellerName}</span>!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s Your Current Sales Overview
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-zinc-800">
            <AvatarImage src="" alt={sellerName} />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{sellerName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sellerEmail}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="AVG. Order Value"
          value={formatINRFromUSD(77.21, { seed: "avg-order-value" })}
          change="+3.16%"
          positive
        />
        <StatCard
          title="Total Orders"
          value={formatINRFromUSD(2107, { seed: "total-orders" })}
          change="-1.18%"
        />
        <StatCard
          title="Lifetime Value"
          value={formatINRFromUSD(653, { seed: "lifetime-value" })}
          change="+2.24%"
          positive
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="col-span-2 bg-white dark:bg-zinc-900/60 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-850 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Overtime</h3>
          <SalesChart />
        </div>

        <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-850">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Product</h3>
          <div className="space-y-6">
            <ProductItem
              name="B For Bottoms Premium Leggings"
              sales="12,439"
              stock="135"
            />
            <ProductItem
              name="B For Bottoms High-Rise Denim Jeans"
              sales="7,232"
              stock="76"
            />
            <ProductItem
              name="B For Bottoms Linen Wide-Leg Trousers"
              sales="1,543"
              stock="465"
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Orders</h2>
        <LatestOrders />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <Card className="p-6 rounded-2xl shadow-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850">
      <CardContent className="space-y-2 p-0">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
        <p
          className={`text-sm ${positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {change} From last month
        </p>
      </CardContent>
    </Card>
  );
}

function ProductItem({
  name,
  sales,
  stock,
}: {
  name: string;
  sales: string;
  stock: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sales} Sales</p>
      </div>
      <div className="text-right">
        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
          Available
        </Badge>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{stock} Stocks Remaining</p>
      </div>
    </div>
  );
}

function LatestOrders() {
  const orders = [
    {
      id: "#2456JL",
      product: "B For Bottoms Premium Leggings",
      date: "Jan 12, 12:23 pm",
      price: 134,
      payment: "Transfer",
      status: "Processing",
    },
    {
      id: "#5435DF",
      product: "B For Bottoms Casual Joggers",
      date: "May 01, 01:13 pm",
      price: 23,
      payment: "Credit Card",
      status: "Completed",
    },
    {
      id: "#9876XC",
      product: "B For Bottoms Formal Trousers",
      date: "Sep 20, 09:08 am",
      price: 441,
      payment: "Transfer",
      status: "Completed",
    },
  ];

  return (
    <div className="overflow-auto rounded-2xl shadow-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-zinc-850 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-semibold">Order ID</th>
            <th className="px-6 py-3 font-semibold">Product</th>
            <th className="px-6 py-3 font-semibold">Order Date</th>
            <th className="px-6 py-3 font-semibold">Price</th>
            <th className="px-6 py-3 font-semibold">Payment</th>
            <th className="px-6 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-800 dark:text-gray-200">
              <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
              <td className="px-6 py-4">{order.product}</td>
              <td className="px-6 py-4">{order.date}</td>
              <td className="px-6 py-4">
                {formatINRFromUSD(order.price, { seed: order.id })}
              </td>
              <td className="px-6 py-4">{order.payment}</td>
              <td className="px-6 py-4">
                <Badge
                  variant={order.status === "Completed" ? "default" : "outline"}
                  className={
                    order.status === "Completed"
                      ? "bg-green-500 text-white dark:bg-green-600"
                      : "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-800"
                  }
                >
                  {order.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
