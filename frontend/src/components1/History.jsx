import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdCalendarToday, MdReceipt, MdShoppingCart, MdAttachMoney, MdAccountBalance, MdTrendingUp } from 'react-icons/md';


const History = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  

  const transactions = [
    { 
      id: 1, 
      type: 'sale', 
      product: 'cement', 
      amount: 1800000, 
      date: '2024-01-15', 
      time: '14:30',
      status: 'completed',
      customer: 'John Doe'
    },
    { 
      id: 2, 
      type: 'purchase', 
      product: 'fer plan', 
      amount: 1200000, 
      date: '2024-01-14', 
      time: '09:15',
      status: 'completed',
      supplier: 'Tech Supplies Ltd'
    },
    { 
      id: 3, 
      type: 'sale', 
      product: 'olive oil', 
      amount: 1500000, 
      date: '2024-01-13', 
      time: '16:45',
      status: 'pending',
      customer: 'Olive Oil Company'
    },
    { 
      id: 4, 
      type: 'purchase', 
      product: 'biscuits', 
      amount: 2500000, 
      date: '2024-01-12', 
      time: '11:20',
      status: 'completed',
      supplier: 'ISA Biscuits'
    },
    { 
      id: 5, 
      type: 'sale', 
      product: 'gucci clothes', 
      amount: 1800000, 
      date: '2024-01-11', 
      time: '13:10',
      status: 'pending',
      customer: 'Mike Johnson'
    },
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'sale' ? <MdShoppingCart className="text-[#BE741E]" /> : <MdAttachMoney className="text-[#BE741E]" />;
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
          <p className="text-gray-600">View all your sales and purchase transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-gray-400" />
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-800">54 </p>
            </div>
            <div className="bg-[#BE741E] p-3 mt-4 rounded-lg">
              <MdReceipt className="text-white text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">342,000 Frw</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdShoppingCart className="text-[#fff] text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-800">234,000 Frw</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdAttachMoney className="text-[#fff] text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Net Profit</p>
              <p className="text-2xl font-bold text-gray-800">108,000 Frw</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdTrendingUp className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                selectedFilter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('sale')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                selectedFilter === 'sale' 
                  ? 'bg-[#BE741E] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setSelectedFilter('purchase')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                selectedFilter === 'purchase' 
                  ? 'bg-[#BE741E] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Purchases
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="text-sm font-medium capitalize text-gray-900">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.amount.toLocaleString()} Frw</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()} at {transaction.time}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.customer || transaction.supplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
