import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdShoppingCart, MdAttachMoney, MdInventory, MdCheckCircle, MdSchedule, MdAccountBalance, MdTrendingUp } from 'react-icons/md';
import PurchaseOrderForm from './forms/PurchaseOrderForm';
import { backendGqlApi } from '../utils/axiosInstance';
import { findallTransactionsQuery } from '../utils/gqlQuery';
import ViewModal from './modals/ViewModal';

const PurchaseProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPurchaseOrderFormOpen, setIsPurchaseOrderFormOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch purchase transactions from the backend
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await backendGqlApi.post('', {
          query: findallTransactionsQuery,
          variables: {
            type: 'Purchase'
          }
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        const transactions = response.data.data.transactions || [];

        // Transform the transaction data to match the expected format
        const transformedPurchases = transactions.map(transaction => ({
          id: transaction.id,
          product: transaction.products.map(p => p.name).join(', ') || 'Unspecified Cargo',
          products: transaction.products || [],
          supplier: transaction.secondParty || 'Undisclosed Entity',
          quantity: transaction.products.reduce((sum, p) => sum + p.quantity, 0),
          totalPrice: transaction.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
          date: transaction.createdAt,
          paymentMethod: transaction.financials && transaction.financials.length > 0 ? 'Settled' : 'Pending'
        }));

        setPurchases(transformedPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const visiblePurchases = filteredPurchases.slice(0, visibleCount);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (bottom && visibleCount < filteredPurchases.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, [visibleCount, filteredPurchases.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalVolume = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueSuppliers = new Set(purchases.map(p => p.supplier)).size;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist space-y-6">
        <div className="w-16 h-16 border-4 border-accent-400/20 border-t-accent-400 rounded-md animate-spin"></div>
        <p className="text-xl font-black text-brand-300 italic">Accessing Procurement Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-blue-600/5 rounded-md border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-500">
            <MdShoppingCart className="text-5xl text-accent-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white leading-none mb-3">Purchase Management</h1>
            <p className="text-brand-300 text-lg font-bold italic opacity-60">Manage your product purchases and supplier relationships</p>
          </div>
        </div>
        <button
          onClick={() => setIsPurchaseOrderFormOpen(true)}
          className="group/btn relative px-10 py-5 bg-accent-400 text-brand-950 rounded-md font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-accent-400/20 overflow-hidden text-lg z-10"
        >
          <div className="absolute inset-0 bg-blue-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <MdAdd className="text-2xl" />
            <span>New Purchase</span>
          </div>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatsCard icon={MdInventory} label="Total Purchases" value={purchases.length} color="accent-400" />
        <StatsCard icon={MdInventory} label="Total Products" value={totalVolume} color="blue-400" />
        <StatsCard icon={MdAccountBalance} label="Suppliers" value={uniqueSuppliers} color="green-500" />
        <StatsCard icon={MdAttachMoney} label="Total Spent" value={`${(totalSpent / 1000000).toFixed(1)}M Frw`} color="red-500" />
      </div>

      {/* Search Console */}
      <div className="bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
        <div className="relative group/search max-w-4xl z-10">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/search:text-accent-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search products or suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-blue-600/5 border border-white/5 rounded-md focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 text-white placeholder-brand-300/40 transition-all text-lg font-black shadow-inner"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl overflow-hidden group/table relative">
        <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
          <h3 className="text-2xl font-black text-white relative z-10">Purchase Orders</h3>
          <div className="px-6 py-2.5 bg-blue-600/5 border border-white/5 shadow-inner rounded-md text-[10px] font-black text-brand-300 tracking-normal relative z-10">
            Displaying {visiblePurchases.length} Records
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600/5">
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Product</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Supplier</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Quantity</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Total Price</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Date</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 tracking-normal">Status</th>
                <th className="px-10 py-6 text-center text-[10px] font-black text-brand-300 tracking-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visiblePurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-blue-600/[0.03] transition-colors cursor-pointer group/row relative" onClick={() => {
                  setSelectedPurchase(purchase);
                  setIsViewModalOpen(true);
                }}>
                  <td className="px-10 py-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent-400 group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                    <p className="text-base font-black text-white group-hover/row:text-accent-400 transition-colors leading-tight">{purchase.product}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs font-black text-brand-300 italic bg-blue-600/5 border border-white/5 px-4 py-2 rounded-md shadow-inner group-hover/row:bg-blue-600/10 group-hover/row:text-white transition-all">
                      {purchase.supplier}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xl font-black text-white">{purchase.quantity} <span className="text-[10px] text-brand-300 tracking-normal italic ml-1">Units</span></span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xl font-black text-accent-400">{purchase.totalPrice.toLocaleString()} <span className="text-[10px] text-brand-300 tracking-normal italic ml-1">Frw</span></span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-black text-white">{new Date(purchase.date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[10px] font-black  italic px-4 py-2 rounded-md border ${purchase.paymentMethod === 'Settled' ? 'bg-green-500/10 text-white border-green-500/20' : 'bg-blue-500/10 text-blue-100 border-red-500/20'} `}>
                      {purchase.paymentMethod}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button className="text-brand-300 hover:text-accent-400 p-2 bg-blue-600/5 rounded-md border border-white/5 transition-all hover:scale-110">
                      <MdVisibility className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PurchaseOrderForm
        isOpen={isPurchaseOrderFormOpen}
        onClose={() => setIsPurchaseOrderFormOpen(false)}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedPurchase}
        title="Purchase Details"
        fields={[
          { key: 'product', label: 'Cargo Payload' },
          { key: 'supplier', label: 'Vendor Entity' },
          { key: 'quantity', label: 'Volume Metric' },
          { key: 'totalPrice', label: 'Capital Required', render: v => v?.toLocaleString() + ' Frw' },
          { key: 'date', label: 'Execution Timestamp', render: v => v ? new Date(v).toLocaleDateString() : '' },
          { key: 'paymentMethod', label: 'Settlement Condition' },
        ]}
      />
    </div>
  );
};

// Internal StatsCard for localized use
const StatsCard = (props) => {
  const { icon: Icon, label, value, color } = props;
  const colorMap = {
    'accent-400': 'text-accent-400 bg-accent-400/10 border-accent-400/20 from-accent-400',
    'green-500': 'text-white bg-green-500/10 border-green-500/20 from-green-500',
    'red-500': 'text-blue-100 bg-blue-500/10 border-red-500/20 from-red-500',
    'blue-400': 'text-blue-400 bg-blue-400/10 border-blue-400/20 from-blue-400',
  };
  const selected = colorMap[color] || colorMap['accent-400'];
  const [textColor, bgStyle, borderStyle, gradStyle] = selected.split(' ');

  return (
    <div className="group bg-[#09111E] p-10 rounded-md border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/10">
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50`} />
      <div className="relative z-10 flex flex-col gap-10">
        <div className={`p-5 w-fit rounded-md border ${bgStyle} ${borderStyle} ${textColor} shadow-inner`}>
          <Icon className="text-3xl" />
        </div>
        <div>
          <p className="text-[10px] font-black text-brand-300 tracking-normal mb-3 italic opacity-60">{label}</p>
          <p className="text-4xl font-black text-white leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseProducts; 
