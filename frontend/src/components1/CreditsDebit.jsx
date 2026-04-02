import React, { useState } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdAttachMoney, MdAccountBalance, MdTrendingUp, MdTrendingDown, MdCreditCard, MdAccountBalanceWallet, MdReceipt } from 'react-icons/md';
import TransactionForm from './forms/TransactionForm';



const CreditsDebit = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  
 
  const transactions = [
    {
      id: 1,
      type: 'credit',
      category: 'Sales Revenue',
      description: 'Payment received for cement',
      amount: 20000,
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      reference: 'INV-001'
    },
    {
      id: 2,
      type: 'debit',
      category: 'Purchase Expense',
      description: 'Payment to Tech Solutions Ltd',
      amount: 180000,
      date: '2024-01-14',
      time: '09:15',
      status: 'completed',
      reference: 'PO-001'
    },
    {
      id: 3,
      type: 'credit',
      category: 'Sales Revenue',
      description: 'Payment received for fer plan',
      amount: 280000,
      date: '2024-01-13',
      time: '16:45',
      status: 'pending',
      reference: 'INV-002'
    },
    {
      id: 4,
      type: 'debit',
      category: 'Operating Expense',
      description: 'Office rent payment',
      amount: 5000,
      date: '2024-01-12',
      time: '11:20',
      status: 'completed',
      reference: 'EXP-001'
    },
    {
      id: 5,
      type: 'credit',
      category: 'Sales Revenue',
      description: 'Payment received for biscuits',
      amount: 34000,
      date: '2024-01-11',
      time: '13:10',
      status: 'completed',
      reference: 'INV-003'
    },
    {
      id: 6,
      type: 'debit',
      category: 'Purchase Expense',
      description: 'Payment to Gucci Ltd',
      amount: 13000,
      date: '2024-01-10',
      time: '10:30',
      status: 'completed',
      reference: 'PO-002'
    }
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === selectedFilter);

  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalCredits - totalDebits;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'credit' ? <MdTrendingUp className="text-green-600" /> : <MdTrendingDown className="text-red-600" />;
  };

  return (
    <div className="space-y-6 overflow-auto ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Management</h2>
          <p className="text-gray-600">Track your credits, debits, and financial transactions</p>
        </div>
        <button 
          onClick={() => setIsTransactionFormOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2"
        >
          <MdAdd className="text-xl" />
          New Transaction
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Total Credits</p>
              <p className="text-3xl font-bold">{(totalCredits / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-4xl opacity-80"><MdAccountBalance className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Total Debits</p>
              <p className="text-3xl font-bold">{(totalDebits / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-4xl opacity-80"><MdTrendingDown className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Net Balance</p>
              <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-white' : 'text-red-200'}`}>
                {(netBalance / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-4xl opacity-80"><MdTrendingUp className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Transactions</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
            <div className="text-4xl opacity-80"><MdReceipt className="text-6xl" /></div>
          </div>
        </div>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Bank Account</h3>
            <MdAccountBalance className="text-black text-2xl" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">{(netBalance * 0.7 / 1000000).toFixed(1)}M Frw</p>
            <p className="text-sm text-gray-600">Available Balance</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Mobile Money</h3>
            <MdAccountBalanceWallet className="text-black text-2xl" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">{(netBalance * 0.2 / 1000000).toFixed(1)}M Frw</p>
            <p className="text-sm text-gray-600">Available Balance</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">+8.3%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Cash</h3>
            <MdCreditCard className="text-black text-2xl" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">{(netBalance * 0.1 / 1000000).toFixed(1)}M Frw</p>
            <p className="text-sm text-gray-600">Available Balance</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600">-2.1%</span>
              <span className="text-gray-500">from last month</span>
            </div>
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
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2">
            <MdFilterList className="text-xl" />
            More Filters
          </button>
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className={`text-sm font-medium capitalize ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} Frw
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()} at {transaction.time}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{transaction.reference}</td>
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
              <MdTrendingUp className="text-green-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Record Credit</p>
              <p className="text-sm text-gray-600">Add incoming payment</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="bg-red-100 p-2 rounded-lg">
              <MdTrendingDown className="text-red-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Record Debit</p>
              <p className="text-sm text-gray-600">Add outgoing payment</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MdAttachMoney className="text-purple-600 text-xl" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Financial Report</p>
              <p className="text-sm text-gray-600">Generate detailed report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Transaction Form */}
      <TransactionForm 
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSave={(newTransaction) => {
          console.log('New transaction created:', newTransaction);
          // Here you would typically save to your backend
          setIsTransactionFormOpen(false);
        }}
      />
    </div>
  );
};

export default CreditsDebit;
