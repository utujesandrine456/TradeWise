import React, { useState, useMemo } from 'react';
import logo from '../assets/logo.png';
import styles from './Home.module.css';
import Dior from '../assets/Dior.jpg';
import { Trash2, RotateCcw } from 'lucide-react';

const Form = () => {
  const [trades, setTrades] = useState([]);
  const [draft, setDraft] = useState({ buyingPrice: '', sellingPrice: '', quantity: '' });
  const clearAll = () => setTrades([]);
  const totalPL = trades.reduce((acc, trade) => acc + trade.profitLoss, 0);

  const draftPL = useMemo(() => {
    const buying = parseFloat(draft.buyingPrice) || 0;
    const selling = parseFloat(draft.sellingPrice) || 0;
    const qty = parseFloat(draft.quantity) || 0;
    return (selling - buying) * qty;
  }, [draft]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const buyingPrice = parseFloat(e.target.buyingPrice.value);
    const sellingPrice = parseFloat(e.target.sellingPrice.value);
    const quantity = parseFloat(e.target.quantity.value);

    const profitLoss = (sellingPrice - buyingPrice) * quantity;

    const newTrade = {
      date: e.target.date.value,
      item: e.target.itemSold.value,
      type: e.target.itemType.value,
      quantity,
      profitLoss,
    };

    setTrades([...trades, newTrade]);
    setDraft({ buyingPrice: '', sellingPrice: '', quantity: '' });
    e.target.reset();
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-[#BE741E] flex justify-between items-center px-6">
        <div className="flex items-center space-x-1">
          <img src={logo} alt="logo" className={styles.home_navbar_logo} />
          <h1 className={styles.home_navbar_title}>TradeWise</h1>
        </div>
        <div className="flex items-center p-3 rounded-3xl bg-white bg-opacity-60">
          <h3 className="font-bold text-normal text-white">S</h3>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row min-h-[auto] bg-gray-50"> 
        {/* Left: Form */}
        <div className="flex-1 py-8 px-4 md:px-8 bg-gray-50 flex items-start">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-[20px] font-semibold text-gray-800">Add Daily Sales</h2>
                <p className="text-sm text-gray-500">Enter your trading data for today</p>
              </div>
              <div className={`text-right text-sm font-semibold ${draftPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>{isNaN(draftPL) ? '—' : `${draftPL.toFixed(2)} Frw`}</div>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* Date */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                />
              </div>

              {/* Item Sold */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Item Sold</label>
                <input
                  type="text"
                  name="itemSold"
                  placeholder="e.g., Cement, Oil"
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                />
              </div>

              {/* Buying Price */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Buying Price (Frw)</label>
                <input
                  type="number"
                  name="buyingPrice"
                  onChange={(e)=> setDraft(d => ({...d, buyingPrice: e.target.value}))}
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                />
              </div>

              {/* Selling Price */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Selling Price (Frw)</label>
                <input
                  type="number"
                  name="sellingPrice"
                  onChange={(e)=> setDraft(d => ({...d, sellingPrice: e.target.value}))}
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  onChange={(e)=> setDraft(d => ({...d, quantity: e.target.value}))}
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                />
              </div>

              {/* Item Type */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Item Type</label>
                <select
                  name="itemType"
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="construction">Construction</option>
                  <option value="metal">Metal</option>
                  <option value="cement">Cement</option>
                </select>
              </div>

              {/* Notes - spans full width */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  placeholder="Add any additional note..."
                  className="mt-1 block w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent"
                ></textarea>
              </div>

              {/* Submit Button - spans full width */}
              <div className="col-span-1 sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-500 to-amber-600 text-white py-2.5 px-4 rounded-xl hover:from-amber-500 hover:to-brand-600 transition duration-300 shadow-lg"
                >
                  + Add Trade Record
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Records */}
        <div className="w-full lg:w-[500px] rounded-xl my-6 lg:my-11 mx-4 lg:mx-[30px] p-6 lg:p-10 shadow-lg border-l bg-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RotateCcw className="text-green-500" size={20} />
                Recent Trades
              </h2>
              <p className="text-sm text-gray-500">Your trading history</p>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center text-red-500 hover:text-red-600 text-sm"
            >
              <Trash2 size={16} className="mr-1" /> Clear All
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-sm text-gray-500">Total Trades</p>
              <p className="text-xl font-bold">{trades.length}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-sm text-gray-500">Total P&L</p>
              <p className="text-xl font-bold text-green-600">
                {totalPL.toFixed(2)} Frw
              </p>
            </div>
          </div>

          {/* Trades List */}
          {trades.length === 0 ? (
            <div className="text-center text-gray-400">
              <svg
                className="mx-auto mb-2"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m3 15 6-6 4 4 8-8" />
              </svg>
              <p>No trades recorded yet</p>
              <p className="text-xs">Add your first trade to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {trades.map((trade, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {trade.item} ({trade.type})
                    </p>
                    <p className="text-sm text-gray-500">
                      {trade.date} - Qty: {trade.quantity}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      trade.profitLoss >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {trade.profitLoss.toFixed(2)} Frw
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
