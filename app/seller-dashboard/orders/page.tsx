// components/dashboard/Orders.tsx
'use client';

import React, { useState } from 'react';


interface Order {
  id: string;
  dispatchDate: string;
  productId: string;
  userItem: string;
  deliveryLocation: string;
  status: 'dispatched' | 'shipped' | 'delivered';
}

interface SpotBuyRequest {
  srNo: number;
  productName: string;
  grade: string;
  quantity: string;
  pricePerKg: number;
  deliveryLocation: string;
  deliveryTimeline: string;
}

interface ChartDataItem {
  label: string;
  value: number;
}

interface ChartComponentProps {
  title: string;
  data: ChartDataItem[];
  colors: string[];
}

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      dispatchDate: '22/02/25',
      productId: '3213',
      userItem: '1',
      deliveryLocation: 'India',
      status: 'dispatched'
    },
    {
      id: '2',
      dispatchDate: '23/02/25',
      productId: '3213',
      userItem: '1',
      deliveryLocation: 'India',
      status: 'shipped'
    },
    {
      id: '3',
      dispatchDate: '24/02/25',
      productId: '3213',
      userItem: '1',
      deliveryLocation: 'India',
      status: 'delivered'
    },
    {
      id: '4',
      dispatchDate: '25/02/25',
      productId: '3213',
      userItem: '1',
      deliveryLocation: 'India',
      status: 'dispatched'
    },
    {
      id: '5',
      dispatchDate: '26/02/25',
      productId: '3213',
      userItem: '1',
      deliveryLocation: 'India',
      status: 'shipped'
    }
  ]);

  const [spotBuyRequests] = useState<SpotBuyRequest[]>([
    {
      srNo: 24,
      productName: 'Name 1',
      grade: '3213',
      quantity: '05',
      pricePerKg: 4000,
      deliveryLocation: 'Lorem',
      deliveryTimeline: 'Lorem'
    },
    {
      srNo: 24,
      productName: 'Name 1',
      grade: '3213',
      quantity: '10',
      pricePerKg: 4000,
      deliveryLocation: 'Lorem',
      deliveryTimeline: 'Lorem'
    },
    {
      srNo: 24,
      productName: 'Name 1',
      grade: '3213',
      quantity: '200 Kg',
      pricePerKg: 4000,
      deliveryLocation: 'Lorem',
      deliveryTimeline: 'Lorem'
    },
    {
      srNo: 24,
      productName: 'Name 1',
      grade: '3213',
      quantity: '200 Kg',
      pricePerKg: 4000,
      deliveryLocation: 'Lorem',
      deliveryTimeline: 'Lorem'
    },
    {
      srNo: 24,
      productName: 'Name 1',
      grade: '3213',
      quantity: '200 Kg',
      pricePerKg: 4000,
      deliveryLocation: 'Lorem',
      deliveryTimeline: 'Lorem'
    }
  ]);

  const ChartComponent: React.FC<ChartComponentProps> = ({ title, data, colors }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">100%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item: ChartDataItem, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Orders</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-green-600">20</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Sell</p>
            <p className="text-3xl font-bold text-green-600">20</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Products Listed</p>
            <p className="text-3xl font-bold text-green-600">20</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Summary Chart */}
          <ChartComponent
            title="Order Summary"
            data={[
              { label: 'Pending Orders', value: 34 },
              { label: 'Shipped Orders', value: 33 },
              { label: 'Delivered Orders', value: 33 }
            ]}
            colors={['bg-purple-500', 'bg-blue-500', 'bg-teal-500']}
          />

          {/* Payments Chart */}
          <ChartComponent
            title="Payments"
            data={[
              { label: '1-30 Days', value: 34 },
              { label: '31-60 Days', value: 33 },
              { label: '61-90 Days', value: 33 }
            ]}
            colors={['bg-purple-700', 'bg-purple-500', 'bg-purple-300']}
          />

          {/* Review Orders Table */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Orders</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">Returned</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Requested</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Dispatch Date</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Product</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500">User Item</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Delivery Location</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{order.dispatchDate}</td>
                      <td className="py-3 text-gray-900">{order.productId}</td>
                      <td className="py-3 text-gray-900">{order.userItem}</td>
                      <td className="py-3 text-gray-900">{order.deliveryLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Spot Buy Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Spot Buy Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Per Kg</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Timeline</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spotBuyRequests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.srNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${request.pricePerKg}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.deliveryLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.deliveryTimeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;