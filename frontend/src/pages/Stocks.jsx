import React, { useState } from "react";
import backendApi from "../utils/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import { MdAdd, MdDelete } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Stocks = ({ traderId }) => {
  const { trader } = useAuth();
  const mainColor = "#09111E";
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    { name: "", category: "", unit: "Piece", quantity: 0 },
  ]);

  const handleChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      { name: "", category: "", unit: "Piece", quantity: 0 },
    ]);
  };

  const removeProductRow = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };


  const submitProducts = async () => {
    try {
      const currentTraderId = traderId || trader?.id;
      if (!currentTraderId) {
        toast.error("Missing Trader Id. Please Login Again.");
        return;
      }
      const cleanProducts = products.map(({ name, category, quantity, unit }) => {
        if (!name || !category) throw new Error("Name And Category Are Required");
        return { name, category, quantity: quantity ?? 0, unit };
      });

      await backendApi.post("/stock/create-multiple", { traderId: currentTraderId, products: cleanProducts });
      toast.success("Products Added Successfully!");

      setTimeout(() => { navigate("/dashboard"); }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed To Add Products");
    }
  };



  return (
    <div className="min-h-screen bg-brand-50 font-Urbanist animate-in fade-in duration-700">
      <ToastContainer />

      <div className="bg-[#09111E] flex justify-between items-center px-10 py-5 shadow-2xl relative z-20">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-md brightness-0 invert" />
          <h1 className="text-white font-bold text-2xl tracking-tight">Stocka</h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md font-bold text-xs border border-white/20 transition-all shadow-inner"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md font-bold text-xs border border-white/20 transition-all shadow-inner"
          >
            Settings
          </button>
        </div>
      </div>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-[#09111E] tracking-tight">
            Bulk Inventory Entry
          </h2>
          <p className="text-sm font-semibold text-brand-400 max-w-2xl mx-auto leading-relaxed opacity-70">
            Quickly add multiple items to your inventory. Fill in the product details below and save them all at once.
          </p>
        </div>

        {/* Product Table */}
        <div className="overflow-hidden rounded-md border border-brand-100 shadow-2xl bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-[#09111E] text-white">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold tracking-wide opacity-60">Product Name</th>
                <th className="px-8 py-5 text-left text-xs font-bold tracking-wide opacity-60">Category</th>
                <th className="px-8 py-5 text-left text-xs font-bold tracking-wide opacity-60">Quantity</th>
                <th className="px-8 py-5 text-left text-xs font-bold tracking-wide opacity-60">Unit</th>
                <th className="px-8 py-5 text-center text-xs font-bold tracking-wide opacity-60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, i) => (
                <tr
                  key={i}
                  className="bg-white hover:bg-brand-50 transition-colors border-b border-brand-50 last:border-0 group"
                >
                  <td className="px-8 py-6">
                    <input
                      type="text"
                      value={prod.name}
                      placeholder="Product Name"
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                      className="w-full border border-brand-100 p-3 rounded-md bg-brand-50/50 font-bold text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all placeholder:opacity-30"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <input
                      type="text"
                      value={prod.category}
                      placeholder="Category"
                      onChange={(e) => handleChange(i, "category", e.target.value)}
                      className="w-full border border-brand-100 p-3 rounded-md bg-brand-50/50 font-bold text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all placeholder:opacity-30"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <input
                      type="number"
                      value={prod.quantity}
                      min={0}
                      onChange={(e) => handleChange(i, "quantity", Number(e.target.value))}
                      className="w-full border border-brand-100 p-3 rounded-md bg-brand-50/50 font-bold text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all"
                    />
                  </td>

                  <td className="px-8 py-6">
                    <select
                      value={prod.unit}
                      onChange={(e) => handleChange(i, "unit", e.target.value)}
                      className="w-full border border-brand-100 p-3 rounded-md bg-brand-50/50 font-semibold text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-[#09111E] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Piece">Piece Units</option>
                      <option value="Kilogram">Kilogram Mass</option>
                      <option value="Litre">Litre Volume</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => removeProductRow(i)}
                      className="text-white hover:bg-rose-600 flex items-center justify-center gap-2 font-bold text-xs transition-all bg-rose-500 px-4 py-2 rounded-md shadow-md"
                    >
                      <MdDelete size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 pt-12">
          <button
            onClick={addProductRow}
            className="bg-white border-2 border-[#09111E] text-[#09111E] px-10 py-5 rounded-md font-bold text-sm flex items-center gap-4 hover:bg-brand-50 transition-all shadow-xl active:scale-95"
          >
            <MdAdd size={20} /> Add New Row
          </button>
          <button
            onClick={submitProducts}
            className="bg-[#09111E] text-white px-10 py-5 rounded-md font-bold text-sm flex items-center gap-4 hover:bg-[#09111E] transition-all shadow-2xl active:scale-95 relative overflow-hidden group/sub"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/sub:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10">Save All Products</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Stocks;
