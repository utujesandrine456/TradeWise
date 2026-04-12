import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdInventory, MdAccountBalance, MdShoppingCart, MdAttachMoney, MdVisibility, MdDescription, MdRefresh } from 'react-icons/md';
import PurchaseOrderForm from './forms/PurchaseOrderForm';
import { backendGqlApi } from '../utils/axiosInstance';
import { findallTransactionsQuery } from '../utils/gqlQuery';
import ViewModal from './modals/ViewModal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from '../utils/toast';
import { formatDistanceToNow } from 'date-fns';

const BuyingProducts = ({ setActiveTab }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount] = useState(25);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [isPurchaseOrderFormOpen, setIsPurchaseOrderFormOpen] = useState(false);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await backendGqlApi.post('', {
        query: findallTransactionsQuery,
        variables: { type: 'Purchase' }
      });

      if (response.data.errors) throw new Error(response.data.errors[0].message);

      const transactions = response.data.data.transactions?.data || [];
      const transformedPurchases = transactions.filter(t => t.type?.toLowerCase() === 'purchase').map(transaction => ({
        id: transaction.id,
        product: transaction.products?.map(p => p.name).join(', ') || 'Unspecified Cargo',
        products: transaction.products || [],
        supplier: transaction.secondParty || 'Undisclosed Entity',
        quantity: transaction.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
        totalPrice: transaction.financials?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
        date: transaction.createdAt,
        paymentStatus: transaction.financials?.length > 0 ? 'Settled' : 'Pending'
      }));

      setPurchases(transformedPurchases);
    } catch (error) {
      setError(error.message);
      toast.error('Procurement Protocol Failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (params.id && location.pathname.includes('/transaction/')) {
      const localTransaction = purchases.find(purchase => purchase.id === params.id);
      if (localTransaction) {
        setSelectedPurchase(localTransaction);
        setIsViewModalOpen(true);
      }
    }
  }, [params.id, location.pathname, purchases]);

  const handleModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedPurchase(null);
    if (location.pathname.includes('/transaction/')) navigate('/dashboard');
  };

  const handleViewTransaction = (purchase) => {
    setSelectedPurchase(purchase);
    setIsViewModalOpen(true);
    navigate(`/transaction/${purchase.id}`);
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visiblePurchases = filteredPurchases.slice(0, visibleCount);
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalVolume = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueSuppliers = new Set(purchases.map(p => p.supplier)).size;

  if (loading && purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist space-y-6">
        <div className="w-16 h-16 border-4 border-accent-400/20 border-t-accent-400 rounded-md animate-spin"></div>
        <p className="text-xl font-black text-brand-300 uppercase tracking-widest italic">Accessing Procurement Manifests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-white/5 rounded-md border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-500">
            <MdShoppingCart className="text-5xl text-accent-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white leading-none mb-3 uppercase tracking-tighter">Procurement</h1>
            <p className="text-brand-300 text-lg font-bold italic opacity-60">Inbound asset acquisition and supplier network management</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchPurchases}
            className="p-5 bg-white/5 hover:bg-white/10 text-brand-300 hover:text-white rounded-md border border-white/5 transition-all hover:scale-110 active:scale-95 shadow-lg group/btn"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            onClick={() => setIsPurchaseOrderFormOpen(true)}
            className="group/export relative px-10 py-5 bg-accent-400 text-brand-950 rounded-md font-black uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-accent-400/20 overflow-hidden text-lg tracking-tight"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/export:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <MdAdd className="text-2xl" />
              <span>Initiate Order Protocol</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard
          icon={MdDescription}
          label="Contracts Executed"
          value={purchases.length}
          trend="Active Manifests"
          color="accent-400"
        />
        <SummaryCard
          icon={MdInventory}
          label="Inbound Cargo"
          value={totalVolume}
          trend="Units Acquired"
          color="blue-400"
        />
        <SummaryCard
          icon={MdAccountBalance}
          label="Supplier Network"
          value={uniqueSuppliers}
          trend="Verified Entities"
          color="green-500"
        />
        <SummaryCard
          icon={MdAttachMoney}
          label="Capital Deployed"
          value={`${(totalSpent / 1000000).toFixed(2)}M Frw`}
          trend="Fiscal Output"
          color="red-500"
        />
      </div>

      {/* Tactical Console (Search) */}
      <div className="bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-400/5 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="relative group/search max-w-4xl z-10">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/search:text-accent-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Query procurement records by cargo or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-md focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 text-white placeholder-brand-300/40 transition-all text-lg font-black uppercase tracking-tight shadow-inner"
          />
        </div>
      </div>

      {/* Procurement Ledger Table */}
      <div className="bg-brand-900 border border-white/5 rounded-md shadow-2xl overflow-hidden group/table relative">
        <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <MdDescription className="text-3xl text-accent-400" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Procurement Manifests</h3>
          </div>
          <div className="px-6 py-2.5 bg-white/5 border border-white/5 shadow-inner rounded-md text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] relative z-10">
            Displaying {visiblePurchases.length} Records
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] w-1/3">Cargo Payload</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Vendor Entity</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Volume</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Capital Allocation</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Chronology Marker</th>
                <th className="px-10 py-6 text-center text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visiblePurchases.length > 0 ? (
                visiblePurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group/row relative" onClick={() => handleViewTransaction(purchase)}>
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent-400 group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-md border border-white/5 text-accent-400 group-hover/row:scale-110 transition-transform">
                          <MdInventory className="text-xl" />
                        </div>
                        <p className="text-base font-black text-white uppercase tracking-tight group-hover/row:text-accent-400 transition-colors leading-tight line-clamp-2">
                          {purchase.product}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-black text-brand-300 uppercase italic bg-white/5 border border-white/5 px-4 py-2 rounded-md shadow-inner group-hover/row:bg-white/10 group-hover/row:text-white transition-all">
                        {purchase.supplier}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-black text-white tracking-tighter uppercase">
                        {purchase.quantity} <span className="text-[10px] text-brand-300 tracking-[0.2em] uppercase italic ml-1">Units</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-black text-accent-400 tracking-tighter uppercase">
                        {purchase.totalPrice.toLocaleString()} <span className="text-[10px] text-brand-300 tracking-[0.2em] uppercase italic ml-1">Frw</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white uppercase tracking-tight">
                          {purchase.date ? new Date(purchase.date).toLocaleDateString() : 'Chronology Error'}
                        </span>
                        <span className="text-[10px] text-brand-300 uppercase italic mt-1 font-bold opacity-60">
                          {purchase.date ? formatDistanceToNow(new Date(purchase.date), { addSuffix: true }) : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <span className={`text-[10px] font-black uppercase italic px-4 py-2 rounded-md border bg-green-500/10 text-green-500 border-green-500/20 tracking-widest`}>
                          Verified
                        </span>
                        {/* Hidden action icon that slides in */}
                        <div className="absolute -right-12 opacity-0 group-hover/row:opacity-100 group-hover/row:-right-4 transition-all duration-300 bg-accent-400 p-2 rounded-md shadow-lg shadow-accent-400/20 translate-x-4 group-hover/row:translate-x-0">
                          <MdVisibility className="text-brand-950 text-lg" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-32">
                    <div className="flex flex-col items-center justify-center space-y-6 text-center">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-accent-400/20 rounded-md blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50" />
                        <div className="relative p-8 bg-brand-900 rounded-md border border-white/5 shadow-2xl">
                          <MdShoppingCart className="text-6xl text-brand-300/20 group-hover:text-accent-400 transition-colors duration-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No Vendor Contracts</h3>
                        <p className="text-brand-300 italic font-bold opacity-60 max-w-sm mx-auto leading-relaxed">
                          {searchTerm
                            ? 'The specific operational parameters yielded zero recorded matches.'
                            : 'The ledger remains pristine. Initiate protocols to generate initial records.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PurchaseOrderForm
        isOpen={isPurchaseOrderFormOpen}
        onClose={() => setIsPurchaseOrderFormOpen(false)}
        setActiveTab={setActiveTab}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        data={selectedPurchase}
        title="Contract Specifications"
        fields={[
          { key: 'product', label: 'Cargo Payload', render: (v) => v },
          { key: 'supplier', label: 'Vendor Entity', render: (v) => v },
          { key: 'quantity', label: 'Volume Metric', render: v => v?.toLocaleString() },
          { key: 'totalPrice', label: 'Capital Required', render: v => v?.toLocaleString() + ' Frw' },
          { key: 'date', label: 'Execution Timestamp', render: v => v ? new Date(v).toLocaleString() : '' },
          { key: 'paymentStatus', label: 'Settlement Condition', render: (v) => v }
        ]}
      />
    </div>
  );
};

// Tactical Summary Component
const SummaryCard = ({ icon: Icon, label, value, trend, color }) => {
  const colorMap = {
    'accent-400': 'text-accent-400 bg-accent-400/10 border-accent-400/20 shadow-accent-400/20 from-accent-400',
    'green-500': 'text-green-500 bg-green-500/10 border-green-500/20 shadow-green-500/20 from-green-500',
    'red-500': 'text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/20 from-red-500',
    'blue-400': 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/20 from-blue-400',
  };

  const selectedColor = colorMap[color] || colorMap['accent-400'];
  const [textColor, bgStyle, borderStyle, _, gradStyle] = selectedColor.split(' ');

  return (
    <div className="group bg-brand-900 p-10 rounded-md border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[-0_0_40_rgba(252,158,79,0.3)]">
      {/* Decorative background glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-md blur-[60px] opacity-10 -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150 ${bgStyle.replace('/10', '')}`} />

      {/* Animated gradient bar */}
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-10">
        <div className="flex items-center justify-between">
          <div className={`p-5 rounded-md border ${bgStyle} ${borderStyle} ${textColor} shadow-inner group-hover:scale-110 duration-500`}>
            <Icon className="text-3xl" />
          </div>
          <span className={`text-[10px] font-black ${textColor} uppercase italic bg-white/5 px-4 py-2 rounded-md border border-white/5 shadow-inner tracking-widest`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-black text-brand-300 tracking-[0.2em] mb-3 uppercase italic opacity-60">{label}</p>
          <p className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default BuyingProducts;
