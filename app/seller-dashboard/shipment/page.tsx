// components/dashboard/Shipments.tsx
'use client';

import React, { useState } from 'react';
import { Search, Plus, MapPin, Clock, User, Phone, MessageCircle, Package, Truck, CheckCircle } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'on-the-way' | 'in-sorting-center' | 'in-transit' | 'delivered';
  estimatedTime: string;
  estimatedDate: string;
  pickupAddress: string;
  deliveryAddress: string;
  driver: {
    name: string;
    rating: number;
    phone?: string;
  };
}

interface ShippingInfo {
  trackingNumber: string;
  courier: string;
  type: string;
  duration: string;
  weight: string;
  cost: number;
}

interface RouteDetail {
  date: string;
  time: string;
  status: string;
  location: string;
}

const Shipments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<string>('#657890');

  const [shipments] = useState<Shipment[]>([
    {
      id: '#657890',
      trackingNumber: '#657890',
      status: 'on-the-way',
      estimatedTime: '03:50',
      estimatedDate: 'Dec 12, 2025',
      pickupAddress: 'Random Address',
      deliveryAddress: 'Random Address',
      driver: {
        name: 'Mairender',
        rating: 4.5,
        phone: '+1234567890'
      }
    },
    {
      id: '#540775',
      trackingNumber: '#540775',
      status: 'in-sorting-center',
      estimatedTime: '05:30',
      estimatedDate: 'Dec 13, 2025',
      pickupAddress: 'Random Address',
      deliveryAddress: 'Random Address',
      driver: {
        name: 'John Doe',
        rating: 4.2
      }
    },
    {
      id: '#201998',
      trackingNumber: '#201998',
      status: 'in-transit',
      estimatedTime: '02:15',
      estimatedDate: 'Dec 14, 2025',
      pickupAddress: 'Random Address',
      deliveryAddress: 'Random Address',
      driver: {
        name: 'Jane Smith',
        rating: 4.8
      }
    },
    {
      id: '#898766',
      trackingNumber: '#898766',
      status: 'delivered',
      estimatedTime: '00:00',
      estimatedDate: 'Dec 11, 2025',
      pickupAddress: 'Random Address',
      deliveryAddress: 'Random Address',
      driver: {
        name: 'Mike Johnson',
        rating: 4.9
      }
    }
  ]);

  const [shippingInfo] = useState<ShippingInfo>({
    trackingNumber: '#657890',
    courier: 'DHL Express',
    type: 'Furniture',
    duration: '7-10 Package',
    weight: '20 kg',
    cost: 2250.00
  });

  const [routeDetails] = useState<RouteDetail[]>([
    {
      date: 'Dec 9, 2025',
      time: '09:00 AM',
      status: 'Pick Up',
      location: 'Random Address'
    },
    {
      date: 'Dec 10, 2025',
      time: '02:30 PM',
      status: 'In Transit',
      location: 'Sorting Center'
    },
    {
      date: 'Dec 11, 2025',
      time: '11:45 AM',
      status: 'In Sorting Center',
      location: 'Random Address'
    },
    {
      date: 'Dec 12, 2025',
      time: '03:30 PM',
      status: 'On The Way',
      location: 'Random Address'
    },
    {
      date: 'Dec 12, 2025',
      time: '06:00 PM',
      status: 'Delivered',
      location: 'Random Address'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-the-way':
        return 'bg-orange-100 text-orange-800';
      case 'in-sorting-center':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-the-way':
        return <Truck className="w-4 h-4" />;
      case 'in-sorting-center':
        return <Package className="w-4 h-4" />;
      case 'in-transit':
        return <Clock className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatStatusText = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentShipment = shipments.find(s => s.id === selectedShipment);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shipments</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipment List */}
          <div className="lg:col-span-1">
            {/* Search and Add Load */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tracking number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Load
              </button>
            </div>

            {/* Active Shipment Card */}
            {currentShipment && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">{currentShipment.trackingNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentShipment.status)}`}>
                    {formatStatusText(currentShipment.status)}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
                  <p className="text-2xl font-bold text-gray-900">{currentShipment.estimatedTime} <span className="text-sm font-normal text-gray-500">hrs</span></p>
                  <p className="text-sm text-gray-500">{currentShipment.estimatedDate}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pickup Address</p>
                      <p className="text-sm text-gray-500">{currentShipment.pickupAddress}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Random Address</p>
                      <p className="text-sm text-gray-500">{currentShipment.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-300"></div>
                    <div className="flex items-center justify-between">
                      <div className="w-3 h-3 bg-black rounded-full relative z-10"></div>
                      <div className="w-3 h-3 bg-gray-300 rounded-full relative z-10"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{currentShipment.driver.name}</p>
                    <p className="text-sm text-gray-500">Recipient</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-black text-white rounded-full shadow-sm hover:bg-gray-800">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Shipments */}
            <div className="space-y-3">
              {filteredShipments.filter(s => s.id !== selectedShipment).map((shipment) => (
                <div
                  key={shipment.id}
                  onClick={() => setSelectedShipment(shipment.id)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{shipment.trackingNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(shipment.status)}`}>
                      {formatStatusText(shipment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Map and Details */}
          <div className="lg:col-span-2">
            {/* Map */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
              <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
                <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-sm">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                  Live Tracking
                </div>
                {/* Simulated route line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 50 200 Q 150 100 250 150 T 350 120"
                    stroke="black"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tracking Number</span>
                    <span className="text-sm font-medium text-gray-900">{shippingInfo.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Courier</span>
                    <span className="text-sm font-medium text-gray-900">{shippingInfo.courier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Type</span>
                    <span className="text-sm font-medium text-gray-900">{shippingInfo.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="text-sm font-medium text-gray-900">{shippingInfo.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="text-sm font-medium text-gray-900">{shippingInfo.weight}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Cost</span>
                    <span className="text-lg font-bold text-gray-900">${shippingInfo.cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Driver Info</h4>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{currentShipment?.driver.name}</p>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                        <MessageCircle className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium text-gray-900">TH-35-40-5</p>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
                <div className="space-y-4">
                  {routeDetails.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === routeDetails.length - 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getStatusIcon(detail.status.toLowerCase().replace(' ', '-'))}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{detail.status}</p>
                            <p className="text-sm text-gray-500">{detail.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{detail.date}</p>
                            <p className="text-sm text-gray-500">{detail.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipments;