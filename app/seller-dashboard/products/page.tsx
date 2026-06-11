"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Clock
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: 'active' | 'out_of_stock' | 'low_stock' | 'draft';
  rating: number;
  image: string;
  createdAt: string;
  lastUpdated: string;
}

interface Stat {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'green' | 'red' | 'yellow';
}

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Rebranded product data reflecting "B For Bottoms"
  const [products] = useState<Product[]>([
    {
      id: 'PRD001',
      name: 'B For Bottoms Premium Leggings',
      category: 'Bottom Wear',
      price: 1299,
      stock: 135,
      sold: 12439,
      status: 'active',
      rating: 4.5,
      image: '/product1.jpg',
      createdAt: '2024-01-15',
      lastUpdated: '2024-03-10'
    },
    {
      id: 'PRD002',
      name: 'B For Bottoms High-Rise Denim Jeans',
      category: 'Denim',
      price: 1899,
      stock: 76,
      sold: 1543,
      status: 'active',
      rating: 4.2,
      image: '/product2.jpg',
      createdAt: '2024-02-20',
      lastUpdated: '2024-03-08'
    },
    {
      id: 'PRD003',
      name: 'B For Bottoms Linen Wide-Leg Trousers',
      category: 'Bottom Wear',
      price: 1499,
      stock: 465,
      sold: 7232,
      status: 'active',
      rating: 4.7,
      image: '/product3.jpg',
      createdAt: '2024-01-05',
      lastUpdated: '2024-03-12'
    },
    {
      id: 'PRD004',
      name: 'B For Bottoms Pleated Corduroy Skirt',
      category: 'Skirts',
      price: 1199,
      stock: 0,
      sold: 456,
      status: 'out_of_stock',
      rating: 4.3,
      image: '/product4.jpg',
      createdAt: '2024-03-01',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'PRD005',
      name: 'B For Bottoms Casual Knit Joggers',
      category: 'Active Wear',
      price: 999,
      stock: 23,
      sold: 234,
      status: 'low_stock',
      rating: 4.1,
      image: '/product5.jpg',
      createdAt: '2024-02-10',
      lastUpdated: '2024-03-05'
    }
  ]);

  // Calendar slot scheduling state
  const [selectedProductForSlots, setSelectedProductForSlots] = useState<Product | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>((() => {
    const d = new Date();
    d.setFullYear(2026, 5, 11); // June 2026 for consistency with workspace datetime
    return d;
  })());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 15)); // June 15, 2026
  const [slotsData, setSlotsData] = useState<Record<string, TimeSlot[]>>({});
  const [newSlotTime, setNewSlotTime] = useState<string>('');

  // Load slot data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vogueish-seller-slots");
      if (stored) {
        setSlotsData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load slots from localStorage", e);
    }
  }, []);

  // Save slot data to localStorage
  const saveSlots = (updated: Record<string, TimeSlot[]>) => {
    setSlotsData(updated);
    try {
      localStorage.setItem("vogueish-seller-slots", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save slots to localStorage", e);
    }
  };

  // Get date key format: productID_YYYY-MM-DD
  const dateKey = useMemo(() => {
    if (!selectedProductForSlots) return "";
    const YYYY = selectedDate.getFullYear();
    const MM = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const DD = String(selectedDate.getDate()).padStart(2, "0");
    return `${selectedProductForSlots.id}_${YYYY}-${MM}-${DD}`;
  }, [selectedProductForSlots, selectedDate]);

  // Default slots loaded if none exist in state
  const currentSlots = useMemo(() => {
    if (!dateKey) return [];
    if (slotsData[dateKey]) return slotsData[dateKey];
    return [
      { id: "s1", time: "9:00 - 11:00 AM", isAvailable: true },
      { id: "s2", time: "11:00 AM - 1:00 PM", isAvailable: true },
      { id: "s3", time: "2:00 - 4:00 PM", isAvailable: true },
      { id: "s4", time: "4:00 - 6:00 PM", isAvailable: false },
    ];
  }, [dateKey, slotsData]);

  // Toggle availability of a slot
  const handleToggleSlot = (slotId: string) => {
    const updatedSlots = currentSlots.map(s => 
      s.id === slotId ? { ...s, isAvailable: !s.isAvailable } : s
    );
    const updatedData = { ...slotsData, [dateKey]: updatedSlots };
    saveSlots(updatedData);
  };

  // Add custom time slot
  const handleAddCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;
    const newSlot: TimeSlot = {
      id: `custom-${Date.now()}`,
      time: newSlotTime.trim(),
      isAvailable: true
    };
    const updatedSlots = [...currentSlots, newSlot];
    const updatedData = { ...slotsData, [dateKey]: updatedSlots };
    saveSlots(updatedData);
    setNewSlotTime('');
  };

  // Delete slot
  const handleDeleteSlot = (slotId: string) => {
    const updatedSlots = currentSlots.filter(s => s.id !== slotId);
    const updatedData = { ...slotsData, [dateKey]: updatedSlots };
    saveSlots(updatedData);
  };

  // Calendar rendering grid calculation
  const calendarCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const leadingEmptyDays = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const cells: (Date | null)[] = [];
    for (let i = 0; i < leadingEmptyDays; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const yearName = currentDate.getFullYear();

  // Filters & sorting
  const filteredProducts: Product[] = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'stock') return a.stock - b.stock;
    if (sortBy === 'sold') return b.sold - a.sold;
    return 0;
  });

  const getStatusBadge = (status: string): React.ReactElement => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">Out of Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">Low Stock</Badge>;
      default:
        return <Badge variant="outline" className="dark:text-zinc-400 dark:border-zinc-800">Draft</Badge>;
    }
  };

  const stats: Stat[] = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'blue' },
    { title: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'green' },
    { title: 'Out of Stock', value: products.filter(p => p.status === 'out_of_stock').length, icon: AlertCircle, color: 'red' },
    { title: 'Low Stock', value: products.filter(p => p.status === 'low_stock').length, icon: AlertCircle, color: 'yellow' }
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-50 dark:bg-zinc-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-650 dark:text-gray-400 mt-1">Manage your bottoms inventory, listings, and wardrobe trials scheduling</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 dark:bg-purple-600 hover:bg-gray-800 dark:hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 rounded-xl border border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="flex items-center justify-between p-0">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' :
                stat.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' :
                stat.color === 'red' ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' :
                'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-850 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="sold">Sort by Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-850 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-850 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Product</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Sold</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Home Trials</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Rating</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 text-gray-800 dark:text-gray-200 transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50/30 dark:bg-zinc-900/40'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/40 rounded-lg flex items-center justify-center border border-purple-100 dark:border-purple-900/30">
                        <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                  <td className="p-4 font-semibold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${
                      product.stock === 0 ? 'text-red-650' :
                      product.stock < 50 ? 'text-yellow-650' :
                      'text-green-650'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{product.sold.toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(product.status)}</td>
                  
                  {/* Home Trial Availability Control Button */}
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedProductForSlots(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/20 text-xs font-semibold rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Slots
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{product.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded transition">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-850 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
            Previous
          </button>
          <button className="px-3 py-1.5 text-xs bg-gray-900 dark:bg-purple-600 text-white rounded font-medium">1</button>
          <button className="px-3 py-1.5 text-xs border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
            Next
          </button>
        </div>
      </div>

      {/* State-based Scheduling Slot Modal Dialog */}
      {selectedProductForSlots && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-zinc-800 animate-scaleUp">
            
            {/* Left Card - Calendar Picker */}
            <div className="p-6 md:p-8 flex-1 border-r border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trial Calendar</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select date to configure slots for {selectedProductForSlots.name}</p>
                </div>
              </div>

              {/* Month Selector header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="p-1.5 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold text-sm text-gray-800 dark:text-gray-250">
                  {monthName} {yearName}
                </span>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="p-1.5 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days header */}
              <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs text-gray-400 dark:text-zinc-500 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              {/* Calendar cell grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarCells.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} className="h-9" />;
                  
                  const isSelected = cell.getDate() === selectedDate.getDate() &&
                                     cell.getMonth() === selectedDate.getMonth() &&
                                     cell.getFullYear() === selectedDate.getFullYear();
                                     
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(cell)}
                      className={`h-9 w-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105" 
                          : "text-gray-800 dark:text-gray-250 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      {cell.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Card - Slots Settings */}
            <div className="p-6 md:p-8 w-full md:w-96 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-md font-bold text-gray-900 dark:text-white">Availability Slots</h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedProductForSlots(null)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 hover:text-gray-650"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Slots checkboxes list */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {currentSlots.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-450 py-4 text-center">No slots scheduled for this date.</p>
                  ) : (
                    currentSlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                          slot.isAvailable 
                            ? "border-purple-200 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-950/10" 
                            : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 opacity-60"
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slot.isAvailable}
                            onChange={() => handleToggleSlot(slot.id)}
                            className="w-4 h-4 text-purple-600 border-gray-300 dark:border-zinc-700 rounded focus:ring-purple-500 bg-transparent"
                          />
                          <span className={`font-medium ${slot.isAvailable ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-550 line-through"}`}>
                            {slot.time}
                          </span>
                        </label>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                          title="Delete slot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Custom Slot Input Form */}
              <form onSubmit={handleAddCustomSlot} className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-850">
                <label className="block text-xs font-semibold text-gray-550 mb-2">Create Custom Trial Slot</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. 6:00 - 8:00 PM"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-55 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}