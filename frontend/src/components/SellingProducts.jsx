import React, { useState, useEffect } from 'react';
import Loader from './Loader';
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
        product: transaction.products?.map(p => p.name).join(', ') || 'Unspecified Asset',
        products: transaction.products || [],
        customer: transaction.secondParty || 'Undisclosed Client',
        quantity: transaction.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
        totalPrice: transaction.financials?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
        date: transaction.createdAt,
        paymentStatus: transaction.financials?.length > 0 ? 'Settled' : 'Pending'
      }));

      setSales(transformedSales);
    } catch (error) {
      setError(error.message);
      toast.error('Distribution Protocol Failure');
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
    return <Loader />;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10 text-[#09111E]">
          <div className="p-3 bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <MdTimeline className="text-3xl text-[#09111E]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#09111E] leading-none mb-3">Distribution</h1>
            <p className="text-[#09111E]/80 text-lg font-medium opacity-60">Outbound fulfillment and customer revenue channels</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchSales}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-[#09111E]/80 hover:text-[#09111E] rounded-full border border-gray-100 transition-all hover:scale-110 active:scale-95 shadow-sm group/btn"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            onClick={() => setIsSaleFormOpen(true)}
            className="group/export relative px-8 py-4 bg-[#09111E] text-white rounded-md font-semibold transition-all hover:scale-105 active:scale-95 shadow-md overflow-hidden text-sm hover:bg-[#0a1520]"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/export:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <MdAdd className="text-2xl" />
              <span>Execute Client Order</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard
          icon={MdDescription}
          label="Orders Fulfilled"
          value={sales.length}
          unit="Sales"
          detail="Active Shipments"
          color="blue-600"
        />
        <SummaryCard
          icon={MdInventory}
          label="Inventory Outflow"
          value={totalVolume || 0}
          unit="Units"
          detail="Units Dispatched"
          color="blue-500"
        />
        <SummaryCard
          icon={MdGroup}
          label="Client Network"
          value={uniqueClients}
          unit="Entities"
          detail="Verified Entities"
          color="green-600"
        />
        <SummaryCard
          icon={MdAttachMoney}
          label="Revenue Generated"
          value={(totalRevenue / 1000000).toFixed(2)}
          unit="M Frw"
          detail="Fiscal Gain"
          color="red-500"
        />
      </div>

      {/* Tactical Console (Search) */}
      <div className="bg-white border border-gray-100 p-10 rounded-md shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="relative group/search max-w-4xl z-10">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#09111E]/60 text-2xl group-focus-within/search:text-[#09111E] transition-colors duration-300" />
          <input
            type="text"
            placeholder="Query distribution records by asset or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-gray-100 text-[#09111E] placeholder-[#09111E]/30 transition-all text-sm font-medium shadow-inner"
          />
        </div>
      </div>

      {/* Distribution Ledger Table */}
      <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden group/table relative">
        <div className="p-12 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10 text-[#09111E]">
            <div className="p-3 bg-gray-50 rounded-full text-[#09111E] border border-gray-100 shadow-sm">
              <MdTimeline className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#09111E]">Distribution Manifests</h3>
          </div>
          <div className="px-6 py-2.5 bg-gray-50 border border-gray-100 shadow-inner rounded-md text-xs font-semibold text-[#09111E] relative z-10">
            Displaying {visibleSales.length} Records
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80 w-1/3">Cargo Payload</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Vendor Entity</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Volume</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Capital Allocation</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Chronology Marker</th>
                <th className="px-10 py-6 text-center text-sm font-bold text-[#09111E]/80">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleSales.length > 0 ? (
                visibleSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors cursor-pointer group/row relative border-b border-gray-50 last:border-0" onClick={() => handleViewTransaction(sale)}>
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#09111E] group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-md border border-gray-100 text-[#09111E] group-hover/row:bg-[#09111E] group-hover/row:text-white transition-all">
                          <MdInventory className="text-xl" />
                        </div>
                        <p className="text-base font-bold text-[#09111E] group-hover/row:text-[#09111E] transition-colors leading-tight line-clamp-2">
                          {sale.product}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-bold text-[#09111E]/80 italic bg-gray-50 border border-gray-100 px-4 py-2 rounded-md shadow-sm group-hover/row:bg-gray-100 group-hover/row:text-[#09111E] transition-all">
                        {sale.customer}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-bold text-[#09111E] group-hover/row:text-[#09111E]">
                        {sale.quantity} <span className="text-[10px] text-[#09111E]/60 ml-1">Units</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-bold text-[#09111E]">
                        {sale.totalPrice.toLocaleString()} <span className="text-[10px] text-[#09111E]/60 ml-1">Frw</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#09111E]">
                          {sale.date ? new Date(sale.date).toLocaleDateString() : 'Chronology Error'}
                        </span>
                        <span className="text-[10px] text-[#09111E]/60 italic mt-1 font-bold opacity-80">
                          {sale.date ? formatDistanceToNow(new Date(sale.date), { addSuffix: true }) : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <span className={`text-[10px] font-bold italic px-4 py-2 rounded-md border bg-gray-50 text-[#09111E] border-gray-100`}>
                          Verified
                        </span>
                        {/* Hidden action icon that slides in */}
                        <div className="absolute -right-12 opacity-0 group-hover/row:opacity-100 group-hover/row:-right-4 transition-all duration-300 bg-[#09111E] p-2 rounded-md shadow-lg translate-x-4 group-hover/row:translate-x-0">
                          <MdVisibility className="text-white text-lg" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-10 py-40">
                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                      <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-gray-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative p-8 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                          <MdTimeline className="text-7xl text-[#09111E]/50 group-hover:text-[#09111E] transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-[#09111E] mb-4">No Revenue Events</h3>
                      <p className="text-[#09111E]/80 italic font-medium opacity-80 leading-relaxed text-sm">
                        {searchTerm
                          ? 'The specific operational parameters yielded zero recorded matches within the sales ledger.'
                          : 'The outbound manifest repository is currently empty. Conclude a sale to map your revenue flow.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsSaleFormOpen(true)}
                          className="mt-12 px-8 py-4 bg-[#09111E] text-white font-bold text-[16px] rounded-md hover:bg-[#0a1520] transition-all active:scale-95 shadow-md"
                        >
                          Execute First Sale
                        </button>
                      )}
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
        title="Contract Specifications"
        fields={[
          { key: 'product', label: 'Asset Payload', render: (v) => v },
          { key: 'customer', label: 'Client Entity', render: (v) => v },
          { key: 'quantity', label: 'Volume Metric', render: v => v?.toLocaleString() },
          { key: 'totalPrice', label: 'Capital Generated', render: v => v?.toLocaleString() + ' Frw' },
          { key: 'date', label: 'Execution Timestamp', render: v => v ? new Date(v).toLocaleString() : '' },
          { key: 'paymentStatus', label: 'Settlement Condition', render: (v) => v }
        ]}
      />
    </div>
  );
};

// Tactical Summary Component
const SummaryCard = ({ label, value, unit, detail, color }) => {
  return (
    <div className="bg-[#09111E] border border-white/5 rounded-md p-6 shadow-2xl hover:shadow-brand-500/10 transition-all cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000 blur-2xl opacity-60" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <p className="text-md font-semibold text-white/40 mb-6">{label}</p>
          <h4 className="text-4xl font-bold text-white leading-none mb-6">
            {value?.toLocaleString() || '0'} <span className="text-lg text-white/20 font-bold italic ml-1">{unit}</span>
          </h4>
          <p className="text-sm text-white/20 font-medium">{detail}</p>
        </div>
      </div>
    </div>
  );
};

export default SellingProducts;
