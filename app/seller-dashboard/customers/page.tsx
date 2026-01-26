// components/dashboard/Customers.tsx
'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products: string[];
  billingDate: string;
  amount: number;
  status: 'active' | 'inactive';
  location?: string;
}

const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Name',
      products: ['Nike sportswear'],
      billingDate: '',
      amount: 11000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Name',
      products: ['Sherlocks Black'],
      billingDate: 'MAR 21, 2024',
      amount: 21000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Name',
      products: ['Dorothy Red'],
      billingDate: 'MAR 21, 2024',
      amount: 21000,
      status: 'active'
    },
    {
      id: '4',
      name: 'Name',
      products: [''],
      billingDate: 'MAR 22, 2024',
      amount: 21000,
      status: 'active'
    },
    {
      id: '5',
      name: 'Name',
      products: [''],
      billingDate: 'MAR 22, 2024',
      amount: 21000,
      status: 'active'
    },
    {
      id: '6',
      name: 'Name',
      products: [''],
      billingDate: 'MAR 23, 2024',
      amount: 21000,
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.products.some(product => 
      product.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCustomerAction = (customerId: string, action: string) => {
    console.log(`${action} customer:`, customerId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Customers</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">1826</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Members</p>
            <p className="text-3xl font-bold text-gray-900">1210</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Active Now</p>
            <p className="text-3xl font-bold text-gray-900">228</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-80"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.products.filter(p => p).join(', ') || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.billingDate || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${customer.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => handleCustomerAction(customer.id, 'view')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;