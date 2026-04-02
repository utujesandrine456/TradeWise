import React, { useState } from "react";
import backendApi from "../utils/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import { MdAdd, MdDelete } from "react-icons/md";
import logo from '../assets/logo.png';
import styles from './Home.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Stocks = ({ traderId }) => {
  const { trader } = useAuth();
  const mainColor = "#BE741E";
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
        toast.error("Missing trader id. Please login again.");
        return;
      }
      const cleanProducts = products.map(({ name, category, quantity, unit }) => {
        if (!name || !category) throw new Error("Name and Category are required");
        return { name, category, quantity: quantity ?? 0, unit };
      });
  
      await backendApi.post("/stock/create-multiple", { traderId: currentTraderId, products: cleanProducts });
      toast.success("Products added successfully!");
      
      setTimeout(() => { navigate("/dashboard"); }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add products");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="bg-[#BE741E] flex justify-between items-center px-6 py-3 shadow-md">
        <div className="flex items-center space-x-1">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className={styles.home_navbar_title}>TradeWise</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-[#BE741E] hover:bg-[#a66316] text-white px-4 py-2 rounded-lg shadow"
          >
            Dashboard
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow"
          >
            Settings
          </button>
        </div>
      </div>



      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-3xl text-center font-bold mt-10 mb-4" style={{ color: mainColor }}>
          Add Multiple Products
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Enter the products you want to add to your stock. You can add multiple rows and submit all at once.
        </p>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#BE741E] text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, i) => (
                <tr
                  key={i}
                  className="bg-white hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={prod.name}
                      placeholder="Name"
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={prod.category}
                      placeholder="Category"
                      onChange={(e) => handleChange(i, "category", e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={prod.quantity}
                      min={0}
                      onChange={(e) => handleChange(i, "quantity", Number(e.target.value))}
                      className="w-25 border p-2 rounded"
                    />
                  </td>
                  
                  <td className="px-4 py-2">
                    <select
                      value={prod.unit}
                      onChange={(e) => handleChange(i, "unit", e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="Piece">Piece</option>
                      <option value="Kilogram">Kilogram</option>
                      <option value="Litre">Litre</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removeProductRow(i)}
                      className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1"
                    >
                      <MdDelete /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={addProductRow}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <MdAdd /> Add Row
          </button>
          <button
            onClick={submitProducts}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Submit All
          </button>
        </div>
      </main>
    </div>
  );
};

export default Stocks;
