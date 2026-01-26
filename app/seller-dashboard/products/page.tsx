'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Package, TrendingUp, AlertCircle } from 'lucide-react';

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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const products: Product[] = [
    {
      id: 'PRD001',
      name: 'NYRIKA Women Printed Tunic',
      category: 'Women\'s Clothing',
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
      name: 'Women Typographic T-Shirt',
      category: 'T-Shirts',
      price: 599,
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
      name: 'Men Checked Slim Shirt',
      category: 'Men\'s Clothing',
      price: 899,
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
      name: 'Premium Cotton Kurta Set',
      category: 'Traditional Wear',
      price: 2499,
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
      name: 'Casual Denim Jacket',
      category: 'Jackets',
      price: 1899,
      stock: 23,
      sold: 234,
      status: 'low_stock',
      rating: 4.1,
      image: '/product5.jpg',
      createdAt: '2024-02-10',
      lastUpdated: '2024-03-05'
    }
  ];

  const filteredProducts: Product[] = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string): React.ReactElement => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low Stock</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const stats: Stat[] = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'blue' },
    { title: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'green' },
    { title: 'Out of Stock', value: products.filter(p => p.status === 'out_of_stock').length, icon: AlertCircle, color: 'red' },
    { title: 'Low Stock', value: products.filter(p => p.status === 'low_stock').length, icon: AlertCircle, color: 'yellow' }
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and listings</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 rounded-xl border border-gray-200">
            <CardContent className="flex items-center justify-between p-0">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'red' ? 'bg-red-100 text-red-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Product</th>
                <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                <th className="text-left p-4 font-semibold text-gray-900">Price</th>
                <th className="text-left p-4 font-semibold text-gray-900">Stock</th>
                <th className="text-left p-4 font-semibold text-gray-900">Sold</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Rating</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-semibold text-gray-900">₹{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 50 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{product.sold.toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(product.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-600">{product.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
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
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}