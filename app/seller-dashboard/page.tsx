'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // const { data: session, status } = useSession();
  
  // if (status === "loading") {
  //   return <div className="flex items-center justify-center h-screen">Loading...</div>;
  // }
  
  // if (status === "unauthenticated" || !session) {
  //   redirect("/seller-sign-in");
  //   return null;
  // }
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, <span className="text-primary">Himanshi</span>!</h1>
          <p className="text-gray-500 mt-1">Here&apos;s Your Current Sales Overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt="Himanshi" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium">Himanshi Kathuria</p>
            <p className="text-xs text-gray-500">himanshikathuria64@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="AVG. Order Value" value="$77.21" change="+3.16%" positive />
        <StatCard title="Total Orders" value="$2,107" change="-1.18%" />
        <StatCard title="Lifetime Value" value="$653" change="+2.24%" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Overtime</h3>
          {/* Insert chart component here */}
          <div className="h-64 flex items-center justify-center text-gray-400">Chart Placeholder</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Product</h3>
          <div className="space-y-4">
            <ProductItem name="NYRIKA Women Printed Tunic" sales="12,439" stock="135" />
            <ProductItem name="Women Typographic T-Shirt" sales="1,543" stock="76" />
            <ProductItem name="Men Checked Slim Shirt" sales="7,232" stock="465" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Latest Orders</h2>
        <LatestOrders />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, positive }: { title: string; value: string; change: string; positive?: boolean }) {
  return (
    <Card className="p-6 rounded-2xl shadow-md">
      <CardContent className="space-y-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>{change} From last month</p>
      </CardContent>
    </Card>
  );
}

function ProductItem({ name, sales, stock }: { name: string; sales: string; stock: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-500">{sales} Sales</p>
      </div>
      <div className="text-right">
        <Badge variant="outline" className="text-green-600 border-green-600">Available</Badge>
        <p className="text-xs text-gray-400 mt-1">{stock} Stocks Remaining</p>
      </div>
    </div>
  );
}

function LatestOrders() {
  const orders = [
    { id: '#2456JL', product: 'Nike Sportswear', date: 'Jan 12, 12:23 pm', price: '$134.00', payment: 'Transfer', status: 'Processing' },
    { id: '#5435DF', product: 'Acqua di Parma', date: 'May 01, 01:13 pm', price: '$23.00', payment: 'Credit Card', status: 'Completed' },
    { id: '#9876XC', product: 'Allen Solly', date: 'Sep 20, 09:08 am', price: '$441.00', payment: 'Transfer', status: 'Completed' },
  ];

  return (
    <div className="overflow-auto rounded-2xl shadow bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 font-semibold">Order ID</th>
            <th className="px-6 py-3 font-semibold">Product</th>
            <th className="px-6 py-3 font-semibold">Order Date</th>
            <th className="px-6 py-3 font-semibold">Price</th>
            <th className="px-6 py-3 font-semibold">Payment</th>
            <th className="px-6 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">{order.product}</td>
              <td className="px-6 py-4">{order.date}</td>
              <td className="px-6 py-4">{order.price}</td>
              <td className="px-6 py-4">{order.payment}</td>
              <td className="px-6 py-4">
                <Badge variant={order.status === 'Completed' ? 'default' : 'outline'} className={order.status === 'Completed' ? 'bg-green-500 text-white' : 'text-blue-600 border-blue-600'}>
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
