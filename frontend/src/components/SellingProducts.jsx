import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdInventory, MdAccountBalance, MdShoppingCart, MdAttachMoney, MdVisibility, MdTimeline, MdRefresh } from 'react-icons/md';
import SaleForm from './forms/SaleForm';
import { backendGqlApi } from '../utils/axiosInstance';
import { findallTransactionsQuery } from '../utils/gqlQuery';
import ViewModal from './modals/ViewModal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from '../utils/toast';
import { formatDistanceToNow } from 'date-fns';

const SellingProducts = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [visibleCount] = useState(25);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await backendGqlApi.post('', {
        query: findallTransactionsQuery,
        variables: { type: 'Sale' }
      });

      if (response.data.errors) throw new Error(response.data.errors[0].message);

      const transactions = response.data.data.transactions?.data || [];
      const transformedSales = transactions.filter(t => t.type?.toLowerCase() === 'sale').map(transaction => ({
        id: transaction.id,
        product: transaction.products?.map(p => p.name).join(', ') || 'unspecified asset',
        products: transaction.products || [],
        customer: transaction.secondParty || 'undisclosed client',
        quantity: transaction.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
        totalPrice: transaction.financials?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
        date: transaction.createdAt,
        paymentStatus: transaction.financials?.length > 0 ? 'settled' : 'pending'
      }));

      setSales(transformedSales);
    } catch (error) {
      setError(error.message);
      toast.error('distribution protocol failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (params.id && location.pathname.includes('/transaction/')) {
      const localTransaction = sales.find(sale => sale.id === params.id);
      if (localTransaction) {
        setSelectedSale(localTransaction);
        setIsViewModalOpen(true);
      }
    }
  }, [params.id, location.pathname, sales]);

  const handleModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedSale(null);
    if (location.pathname.includes('/transaction/')) navigate('/dashboard');
  };

  const handleViewTransaction = (sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
    navigate(`/transaction/${sale.id}`);
  };

  const filteredSales = sales.filter(sale =>
    sale.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleSales = filteredSales.slice(0, visibleCount);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalVolume = sales.reduce((sum, s) => sum + s.quantity, 0);
  const uniqueClients = new Set(sales.map(s => s.customer)).size;

  if (loading && sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-afacad space-y-6">
        <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
        <p className="text-xl font-#FC9E4F text-gray-500 lowercase italic">accessing distribution manifests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-afacad">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-brand-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-green-500/10 rounded-3xl border border-green-500/20 shadow-inner group-hover:-rotate-12 transition-all duration-500">
            <MdTimeline className="text-5xl text-green-500" />
          </div>
          <div>
            <h1 className="text-4xl font-#FC9E4F text-white lowercase leading-none mb-3 italic tracking-tight">distribution</h1>
            <p className="text-gray-500 text-lg lowercase font-medium italic">outbound asset allocation and client lifecycle management</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchSales}
            className="p-5 bg-white/5 hover:bg-green-500/10 text-gray-400 hover:text-green-500 rounded-2xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg group/btn"
            title="synchronize ledgers"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            onClick={() => setIsSaleFormOpen(true)}
            className="group/export relative px-10 py-5 bg-green-500 text-brand-950 rounded-2xl font-#FC9E4F lowercase transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-green-500/20 overflow-hidden text-lg italic tracking-wide"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/export:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <MdAdd className="text-2xl" />
              <span>execute client order</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard
          icon={MdShoppingCart}
          label="contracts executed"
          value={sales.length}
          trend="active manifests"
          color="green-500"
        />
        <SummaryCard
          icon={MdInventory}
          label="outbound cargo"
          value={totalVolume}
          trend="units deployed"
          color="blue-400"
        />
        <SummaryCard
          icon={MdAccountBalance}
          label="client network"
          value={uniqueClients}
          trend="verified entities"
          color="accent-400"
        />
        <SummaryCard
          icon={MdAttachMoney}
          label="capital acquired"
          value={`${(totalRevenue / 1000000).toFixed(2)}m frw`}
          trend="fiscal input"
          color="green-500"
        />
      </div>

      {/* Tactical Console (Search) */}
      <div className="bg-brand-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="relative group/search max-w-4xl z-10">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-2xl group-focus-within/search:text-green-500 transition-colors duration-300" />
          <input
            type="text"
            placeholder="query distribution records by asset or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 text-white placeholder-gray-600 transition-all lowercase text-lg italic shadow-inner"
          />
        </div>
      </div>

      {/* Distribution Ledger Table */}
      <div className="bg-brand-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden group/table relative">
        <div className="p-10 border-b border-white/10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <MdTimeline className="text-3xl text-green-500" />
            <h3 className="text-2xl font-#FC9E4F text-white lowercase italic shadow-sm">distribution manifests</h3>
          </div>
          <div className="px-6 py-2.5 bg-#FC9E4F/20 border border-white/5 shadow-inner rounded-full text-xs font-#FC9E4F text-gray-400 lowercase italic tracking-widest relative z-10">
            displaying {visibleSales.length} records
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-#FC9E4F/20 border-b border-white/5">
                <th className="px-10 py-6 text-left text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em] w-1/3">asset payload</th>
                <th className="px-10 py-6 text-left text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em]">client entity</th>
                <th className="px-10 py-6 text-left text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em]">volume</th>
                <th className="px-10 py-6 text-left text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em]">revenue generation</th>
                <th className="px-10 py-6 text-left text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em]">chronology marker</th>
                <th className="px-10 py-6 text-center text-[10px] font-#FC9E4F text-gray-500 lowercase italic tracking-[0.2em]">status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleSales.length > 0 ? (
                visibleSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group/row relative" onClick={() => handleViewTransaction(sale)}>
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-green-500 group-hover/row:h-1/2 transition-all duration-300 rounded-r-full" />
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500 group-hover/row:scale-110 transition-transform">
                          <MdInventory className="text-xl" />
                        </div>
                        <p className="text-base font-#FC9E4F text-white lowercase italic group-hover/row:text-green-500 transition-colors leading-tight line-clamp-2">
                          {sale.product}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-#FC9E4F text-gray-400 lowercase italic bg-white/5 border border-white/5 px-4 py-2 rounded-2xl shadow-inner group-hover/row:bg-white/10 group-hover/row:text-white transition-all">
                        {sale.customer}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-#FC9E4F text-white lowercase tracking-tighter">
                        {sale.quantity} <span className="text-[10px] text-gray-500 tracking-widest italic ml-1">units</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-#FC9E4F text-green-500 lowercase tracking-tighter">
                        {sale.totalPrice.toLocaleString()} <span className="text-[10px] text-gray-500 tracking-widest italic ml-1">frw</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-#FC9E4F text-white lowercase italic">
                          {sale.date ? new Date(sale.date).toLocaleDateString() : 'chronology error'}
                        </span>
                        <span className="text-[10px] text-gray-500 lowercase italic mt-1 font-bold">
                          {sale.date ? formatDistanceToNow(new Date(sale.date), { addSuffix: true }) : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <span className={`text-xs font-#FC9E4F lowercase italic px-4 py-2 rounded-2xl border bg-green-500/10 text-green-500 border-green-500/20`}>
                          verified
                        </span>
                        {/* Hidden action icon that slides in */}
                        <div className="absolute -right-12 opacity-0 group-hover/row:opacity-100 group-hover/row:-right-4 transition-all duration-300 bg-green-500 p-2 rounded-xl shadow-lg shadow-green-500/20 translate-x-4 group-hover/row:translate-x-0">
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
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50" />
                        <div className="relative p-8 bg-brand-900/80 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl">
                          <MdTimeline className="text-6xl text-gray-700 group-hover:text-green-500 transition-colors duration-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-#FC9E4F text-white lowercase italic mb-2 tracking-tight">no client contracts</h3>
                        <p className="text-gray-500 lowercase italic font-medium max-w-sm mx-auto leading-relaxed">
                          {searchTerm
                            ? 'the specific operational parameters yielded zero recorded matches.'
                            : 'the ledger remains pristine. initiate protocols to generate initial records.'}
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

      <SaleForm
        isOpen={isSaleFormOpen}
        onClose={() => setIsSaleFormOpen(false)}
        setActiveTab={setActiveTab}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        data={selectedSale}
        title="contract specifications"
        fields={[
          { key: 'product', label: 'asset payload', render: (v) => v?.toLowerCase() },
          { key: 'customer', label: 'client entity', render: (v) => v?.toLowerCase() },
          { key: 'quantity', label: 'volume metric', render: v => v?.toLocaleString() },
          { key: 'totalPrice', label: 'capital generated', render: v => v?.toLocaleString() + ' frw' },
          { key: 'date', label: 'execution timestamp', render: v => v ? new Date(v).toLocaleString() : '' },
          { key: 'paymentStatus', label: 'settlement condition', render: (v) => v?.toLowerCase() }
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

  const selectedColor = colorMap[color] || colorMap['green-500'];
  const [textColor, bgStyle, borderStyle, _, gradStyle] = selectedColor.split(' ');

  return (
    <div className="group bg-brand-900/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[-0_0_40px_rgba(252,158,79,0.3)]">
      {/* Decorative background glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-10 -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150 ${bgStyle.replace('/10', '')}`} />

      {/* Animated gradient bar */}
      <div className={`absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-10">
        <div className="flex items-center justify-between">
          <div className={`p-5 rounded-2xl border ${bgStyle} ${borderStyle} ${textColor} shadow-inner group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500`}>
            <Icon className="text-3xl" />
          </div>
          <span className={`text-[10px] font-#FC9E4F ${textColor} lowercase italic bg-#FC9E4F/40 px-4 py-2 rounded-full border border-white/5 shadow-inner`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-#FC9E4F text-gray-500 tracking-[0.2em] mb-3 lowercase italic">{label}</p>
          <p className="text-4xl font-#FC9E4F text-white lowercase italic tracking-tighter leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SellingProducts;
