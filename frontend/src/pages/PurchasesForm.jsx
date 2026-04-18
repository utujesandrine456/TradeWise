import React, { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/queries';
import { toast } from 'react-toastify';
import images from '../utils/images';
import styles from './Home.module.css';
import { Trash2, RotateCcw } from 'lucide-react';


const PurchaseForm = () => {
  const [trades, setTrades] = useState([]);
  const [draft, setDraft] = useState({ buyingPrice: '', sellingPrice: '', quantity: '' });
  const clearAll = () => setTrades([]);
  const totalPL = trades.reduce((acc, trade) => acc + trade.profitLoss, 0);

  const draftPL = useMemo(() => {
    const buying = parseFloat(draft.buyingPrice) || 0;
    const qty = parseFloat(draft.quantity) || 0;
    return 0 - (buying * qty);
  }, [draft]);

  const [createTransaction] = useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const buyingPrice = parseFloat(e.target.buyingPrice.value);
    const quantity = parseInt(e.target.quantity.value, 10);
    const itemName = e.target.itemSold.value;
    const date = e.target.date.value;
    const itemType = e.target.itemType?.value || 'General';

    if (!itemName || isNaN(buyingPrice) || isNaN(quantity)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const cost = buyingPrice * quantity;
    const profitLoss = 0 - cost;

    try {
      await createTransaction({
        variables: {
          type: 'Purchase',
          products: [{ name: itemName.trim(), price: buyingPrice, quantity }],
          description: `Purchase of ${itemName} (${itemType})`,
          secondParty: 'Supplier',
          financialDetails: {
            amount: cost,
            description: `Purchase for ${itemName}`,
            type: 'Debit'
          },
        },
      });

      toast.success('Purchase recorded successfully!');
      setTrades([...trades, { date, item: itemName, type: itemType, quantity, profitLoss }]);
      setDraft({ buyingPrice: '', sellingPrice: '', quantity: '' });
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to record purchase');
    }
  };

  return (
    <div className="font-Urbanist min-h-screen bg-brand-50 flex flex-col animate-in fade-in duration-700">
      {/* Navbar */}
      <div className="bg-[#09111E] flex justify-between items-center px-10 py-4 shadow-2xl relative z-20">
        <div className="flex items-center space-x-4">
          <img src={images.logo} alt="logo" className="w-10 h-10 object-contain brightness-0 invert" />
          <h1 className="text-xl font-bold text-white tracking-tight">Stocka</h1>
        </div>
        <div className="flex items-center px-6 py-2.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
          <h3 className="font-bold text-white tracking-wide text-xs">Supply Ledger</h3>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
        <div className="flex-1 py-12 px-6 md:px-12 flex justify-center items-start lg:overflow-y-auto">
          <div className="bg-white rounded-md p-10 w-full max-w-2xl shadow-2xl border border-brand-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50 rounded-md -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000 opacity-50 blur-3xl" />
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-[#09111E] tracking-tight">Add Daily Purchases</h2>
                <p className="text-xs text-brand-400 font-semibold mt-1">Record your inventory intake details here</p>
              </div>
              <div className="text-right text-xl font-black text-rose-600 bg-rose-50 px-6 py-3 rounded-md border border-rose-100 shadow-inner">
                {isNaN(draftPL) ? '0.00' : Math.abs(draftPL).toLocaleString()} <span className="text-[10px] opacity-40 ml-1">Frw</span>
              </div>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10" onSubmit={handleSubmit}>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full border border-brand-100 text-[#09111E] rounded-md p-4 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all font-semibold text-sm bg-brand-50 shadow-inner"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Product Name</label>
                <input
                  type="text"
                  name="itemSold"
                  placeholder="e.g., Cement, Oil"
                  className="w-full border border-brand-100 text-[#09111E] rounded-md p-4 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all font-semibold text-sm bg-brand-50 shadow-inner placeholder:text-brand-200"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Unit Cost (Frw)</label>
                <input
                  type="number"
                  name="buyingPrice"
                  onChange={(e) => setDraft(d => ({ ...d, buyingPrice: e.target.value }))}
                  className="w-full border border-brand-100 text-[#09111E] rounded-md p-4 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all font-semibold text-sm bg-brand-50 shadow-inner"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  onChange={(e) => setDraft(d => ({ ...d, quantity: e.target.value }))}
                  className="w-full border border-brand-100 text-[#09111E] rounded-md p-4 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all font-semibold text-sm bg-brand-50 shadow-inner"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Type</label>
                <div className="relative group/sel">
                  <select
                    name="itemType"
                    className="w-full border border-brand-100 text-[#09111E] rounded-md p-4 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all bg-brand-50 shadow-inner font-semibold text-sm appearance-none cursor-pointer"
                  >
                    <option value="General">Select Type</option>
                    <option value="Construction">Construction</option>
                    <option value="Metal">Metal</option>
                    <option value="Cement">Cement</option>
                  </select>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-brand-300 mb-3 px-1">Additional Notes</label>
                <textarea
                  placeholder="Provide context for this purchase..."
                  className="w-full border border-brand-100 text-[#09111E] rounded-md p-5 focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all bg-brand-50 shadow-inner font-semibold text-sm placeholder:text-brand-200/50"
                  rows="3"
                ></textarea>
              </div>

              <div className="col-span-1 sm:col-span-2 pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#09111E] text-white py-6 px-10 rounded-md font-bold hover:bg-[#09111E] transition-all shadow-2xl text-sm relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <RotateCcw className="text-xl animate-spin-slow" /> Finalize Purchase
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>


        <div className="w-full lg:w-[450px] bg-white border-l border-brand-100 p-10 flex flex-col h-full shadow-[inset_20px_0_40px_-20px_rgba(9,17,30,0.05)] relative overflow-hidden">
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-[#09111E] flex items-center gap-4 tracking-tight">
                <RotateCcw className="text-[#09111E]" size={28} />
                Recent Purchases
              </h2>
              <p className="text-xs text-brand-300 font-semibold mt-1">Audit log of your daily acquisitions</p>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center text-rose-500 hover:text-white font-bold text-xs bg-rose-50 px-5 py-2.5 rounded-md border border-rose-100 transition-all hover:bg-rose-500 shadow-sm"
            >
              <Trash2 size={16} className="mr-2" /> Clear List
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
            <div className="bg-brand-50 rounded-md p-6 border border-brand-100 shadow-inner">
              <p className="text-xs text-brand-300 font-bold mb-3">Count</p>
              <p className="text-4xl font-bold text-[#09111E] tracking-tight">{trades.length}</p>
            </div>
            <div className="bg-rose-50 rounded-md p-6 border border-rose-100 shadow-inner">
              <p className="text-xs text-rose-400 font-bold mb-3">Total Expense</p>
              <p className="text-2xl font-bold text-rose-600 tracking-tight">
                {Math.abs(totalPL).toLocaleString()} <span className="text-[10px] opacity-40 ml-1">Frw</span>
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar relative z-10">
            {trades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-brand-200">
                <div className="p-8 bg-brand-50 rounded-md border border-brand-100 shadow-inner mb-6">
                  <RotateCcw size={48} className="opacity-20 animate-pulse" />
                </div>
                <p className="font-bold text-sm">No transaction yet</p>
                <p className="text-xs font-medium italic mt-2">Start recording purchases to see logs</p>
              </div>
            ) : (
              trades.slice().reverse().map((trade, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-6 rounded-md border border-brand-100 hover:border-[#09111E] hover:shadow-2xl transition-all duration-500 group/row shadow-sm hover:-translate-y-1"
                >
                  <div className="flex-1">
                    <p className="font-bold text-[#09111E] tracking-tight text-lg leading-none mb-3">
                      {trade.item}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-brand-300 font-semibold italic">
                      <span className="bg-brand-50 text-[#09111E] px-3 py-1 rounded-md border border-brand-100 shadow-inner">{trade.type}</span>
                      <span className="flex items-center gap-1">Qty: <span className="text-[#09111E] font-bold">{trade.quantity}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-600 text-xl tracking-tight">
                      -{Math.abs(trade.profitLoss).toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-200 mt-2 font-semibold">{trade.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
