import React, { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/queries';
import { toast } from 'react-toastify';
import images from '../utils/images';
import styles from './Home.module.css';
import { Trash2, RotateCcw } from 'lucide-react';

const Pform = () => {
  const [trades, setTrades] = useState([]);
  const [draft, setDraft] = useState({ buyingPrice: '', sellingPrice: '', quantity: '' });
  const clearAll = () => setTrades([]);
  const totalPL = trades.reduce((acc, trade) => acc + trade.profitLoss, 0);

  const draftPL = useMemo(() => {
    const buying = parseFloat(draft.buyingPrice) || 0;
    const qty = parseFloat(draft.quantity) || 0;
    // For purchases, "profit" on the draft is just the negative cost
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
    const profitLoss = 0 - cost; // Expense

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
    <div className="font-afacad min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="bg-[#FC9E4F] flex justify-between items-center px-6 py-2 shadow-md">
        <div className="flex items-center space-x-2">
          <img src={images.logo} alt="logo" className="w-12 h-12 object-contain" />
          <h1 className={styles.home_navbar_title} style={{ color: 'white' }}>TradeWise</h1>
        </div>
        <div className="flex items-center p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
          <h3 className="font-bold text-white px-2">PURCHASES</h3>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
        {/* Left: Form */}
        <div className="flex-1 py-8 px-4 md:px-8 flex justify-center items-start">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black">Add Daily Purchases</h2>
                <p className="text-sm text-gray-500 font-medium">Enter your supply data for today</p>
              </div>
              <div className="text-right text-lg font-bold text-red-600">
                {isNaN(draftPL) ? '0.00' : draftPL.toLocaleString()} Frw
              </div>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-black mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all font-medium"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-black mb-1">Item Bought</label>
                <input
                  type="text"
                  name="itemSold"
                  placeholder="e.g., Cement, Oil"
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all font-medium"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-black mb-1">Unit Price (Frw)</label>
                <input
                  type="number"
                  name="buyingPrice"
                  onChange={(e) => setDraft(d => ({ ...d, buyingPrice: e.target.value }))}
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all font-medium"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-black mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  onChange={(e) => setDraft(d => ({ ...d, quantity: e.target.value }))}
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all font-medium"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-black mb-1">Item Type</label>
                <select
                  name="itemType"
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all bg-white font-medium"
                >
                  <option value="General">Select Type</option>
                  <option value="Construction">Construction</option>
                  <option value="Metal">Metal</option>
                  <option value="Cement">Cement</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-bold text-black mb-1">Notes (Optional)</label>
                <textarea
                  placeholder="Add any additional note..."
                  className="w-full border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all"
                  rows="3"
                ></textarea>
              </div>

              <div className="col-span-1 sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FC9E4F] to-amber-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-lg transition-all transform active:scale-[0.98]"
                >
                  + Record Purchase Record
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Records */}
        <div className="w-full lg:w-[450px] bg-white border-l border-gray-100 p-8 flex flex-col h-full shadow-inner lg:shadow-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-black flex items-center gap-2">
                <RotateCcw className="text-[#FC9E4F]" size={24} />
                Recent Purchases
              </h2>
              <p className="text-sm text-gray-500 font-medium">Your supply history for this session</p>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center text-red-500 hover:text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg"
            >
              <Trash2 size={16} className="mr-1" /> Clear
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Purchases</p>
              <p className="text-2xl font-bold text-[#FC9E4F]">{trades.length}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Cost</p>
              <p className="text-xl font-bold text-red-600">
                {Math.abs(totalPL).toLocaleString()} Frw
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {trades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <RotateCcw size={48} className="mb-4 opacity-20" />
                <p className="font-bold">No purchases recorded yet</p>
                <p className="text-sm">Add your first record to start tracking.</p>
              </div>
            ) : (
              trades.slice().reverse().map((trade, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {trade.item}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                      <span className="bg-white px-2 py-0.5 rounded-full border border-gray-100">{trade.type}</span>
                      <span>• Qty: {trade.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      -{Math.abs(trade.profitLoss).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{trade.date}</p>
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

export default Pform;
