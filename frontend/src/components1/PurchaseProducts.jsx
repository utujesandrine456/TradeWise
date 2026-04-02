import React, { useState } from 'react';
import { FaBox, FaRulerVertical, FaTint, FaEdit, FaTrash } from 'react-icons/fa';

const PurchaseProducts = () => {
  const [activeUnit, setActiveUnit] = useState('Pieces');

  const recentPurchases = [
    { item: 'Flour', category: 'Kilograms', quantity: '25 kg', unitPrice: '1.20/kg', total: '30.00', date: 'May 24, 2023' },
    { item: 'Cooking Oil', category: 'Litres', quantity: '10 L', unitPrice: '2.50/L', total: '25.00', date: 'May 22, 2023' },
    { item: 'Soap Bars', category: 'Pieces', quantity: '50 pcs', unitPrice: '0.75/pc', total: '37.50', date: 'May 20, 2023' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">

        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveUnit('Pieces')}
            className={`flex items-center justify-center py-2 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeUnit === 'Pieces'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> Pieces
          </button>
          <button
            onClick={() => setActiveUnit('Kilograms')}
            className={`flex items-center justify-center py-2 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeUnit === 'Kilograms'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <FaRulerVertical className="mr-2" /> Kilograms
          </button>
          <button
            onClick={() => setActiveUnit('Litres')}
            className={`flex items-center justify-center py-2 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeUnit === 'Litres'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <FaTint className="mr-2" /> Litres
          </button>
        </div>

        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item name</label>
              <input type="text" placeholder="What did you buy?" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
            <div></div> 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per package</label>
              <input type="text" placeholder="$ 0.00" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of pieces per package</label>
              <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of packages bought</label>
              <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (if any)</label>
              <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transport cost</label>
              <input type="text" placeholder="$ 0.00" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>

          <div className="mt-8 border-t pt-6 flex justify-between items-center">
             <div>
                <p className="text-lg font-bold text-gray-800">Total Cost: <span className="text-green-600">$0.00</span></p>
             </div>
             <div className="flex space-x-4">
                <button className="py-2 px-6 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200">Cancel</button>
                <button className="py-2 px-6 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-md">Save Purchase</button>
             </div>
          </div>
        </div>

        
        <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Recent Purchases</h2>
                <a href="#" className="text-green-600 font-semibold hover:underline">View All &gt;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentPurchases.map((purchase, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.item}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.unitPrice}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{purchase.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                                    <a href="#" className="text-blue-600 hover:text-blue-900"><FaEdit /></a>
                                    <a href="#" className="text-red-600 hover:text-red-900"><FaTrash /></a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

         
         <div className="mt-12">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Purchase Summary</h2>
             <div className="bg-white p-8 rounded-lg shadow-md">
                 
                 <p className="text-gray-500">Your purchase summary will be displayed here.</p>
             </div>
         </div>

      </div>
    </div>
  );
};

export default PurchaseProducts; 