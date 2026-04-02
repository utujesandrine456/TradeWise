import React, { useState } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdShoppingCart, MdAttachMoney, MdPerson, MdAccountBalance, MdCheckCircle, MdSchedule, MdTrendingUp } from 'react-icons/md';
import SaleForm from './forms/SaleForm';
import '../index.css'

const SellingProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  
 
  const sales = [
    { 
      id: 1, 
      product: 'cement', 
      supplier: 'CIMERWA', 
      quantity: 10, 
      unitPrice: 9000, 
      totalPrice: 90000, 
      date: '2025-09-21', 
      status: 'completed',
      paymentMethod: 'Mobile Money'
    },
    { 
      id: 2, 
      product: 'fer plan', 
      supplier: 'Stelrw Ltd', 
      quantity: 5, 
      unitPrice: 12000, 
      totalPrice: 60000, 
      date: '2025-04-14', 
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    { 
      id: 3, 
      product: 'olive oil', 
      supplier: 'oil company', 
      quantity: 15, 
      unitPrice: 15000, 
      totalPrice: 225000, 
      date: '2025-07-30', 
      status: 'completed',
      paymentMethod: 'Cash'
    },
    { 
      id: 4, 
      product: 'biscuits', 
      supplier: 'ISA Biscuits', 
      quantity: 8, 
      unitPrice: 200, 
      totalPrice: 1600, 
      date: '2025-01-12', 
      status: 'pending',
      paymentMethod: 'Credit Card'
    },
    { 
      id: 5, 
      product: 'gucci clothes', 
      supplier: 'Gucci Ltd', 
      quantity: 12, 
      unitPrice: 8000, 
      totalPrice: 96000,  
      date: '2025-09-11', 
      status: 'completed',
      paymentMethod: 'Mobile Money'
    },
  ];

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6 hide-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
          <p className="text-gray-600">Manage your product sales and customer orders</p>
        </div>
        <button 
          onClick={() => setIsSaleFormOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2"
        >
          <MdAdd className="text-xl" />
          New Sale
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Total Sales</p>
              <p className="text-3xl font-bold">{sales.length}</p>
            </div>
            <div className="text-4xl opacity-80"><MdAccountBalance className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Completed</p>
              <p className="text-3xl font-bold">{completedSales}</p>
            </div>
            <div className="text-4xl opacity-80"><MdCheckCircle className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Pending</p>
              <p className="text-3xl font-bold">{pendingSales}</p>
            </div>
            <div className="text-4xl opacity-80"><MdSchedule className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Total Revenue</p>
              <p className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-4xl opacity-80"><MdTrendingUp className="text-6xl" /></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2">
            <MdFilterList className="text-xl" />
            More Filters
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Sales Orders</h3>
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Unit Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.unitPrice.toLocaleString()} Frw</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{sale.totalPrice.toLocaleString()} Frw</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <MdVisibility className="text-lg" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <MdEdit className="text-lg" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1">
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <MdShoppingCart className="text-green-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Create New Sale</p>
              <p className="text-sm text-gray-600">Record a new customer order</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdPerson className="text-blue-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Customer Management</p>
              <p className="text-sm text-gray-600">Manage customer information</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MdAttachMoney className="text-purple-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Sales Report</p>
              <p className="text-sm text-gray-600">View detailed sales analytics</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {sales.slice(0, 3).map((sale) => (
            <div key={sale.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <MdShoppingCart className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">New sale: {sale.product}</p>
                <p className="text-sm text-gray-600">Customer: {sale.customer} • {sale.totalPrice.toLocaleString()} Frw</p>
              </div>
              <span className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sale Form */}
      <SaleForm 
        isOpen={isSaleFormOpen}
        onClose={() => setIsSaleFormOpen(false)}
        onSave={(newSale) => {
          console.log('New sale created:', newSale);
          setIsSaleFormOpen(false);
        }}
      />
    </div>
  );
};

export default SellingProducts;
