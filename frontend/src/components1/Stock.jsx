import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdInventory, MdCheckCircle, MdSchedule, MdAccountBalance, MdShoppingCart } from 'react-icons/md';
import AddItemForm from './forms/AddItemForm';
import ViewModal from './modals/ViewModal';
import EditModal from './modals/EditModal';
import AddToCartButton from './buttons/AddToCartButton';
import Cart from './Cart';
import { useCart } from '../contexts/CartContext';
import { mockStockItems, mockApiResponse } from '../__mock__';



const Stock = () => {
  const { addToCart, getCartItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await mockApiResponse(mockStockItems);
        if (response.success) {
          setStockItems(response.data);
          

          setStats({
            totalProducts: response.data.length,
            inStock: response.data.filter(item => item.status === 'In Stock').length,
            lowStock: response.data.filter(item => item.status === 'Low Stock').length,
            outOfStock: response.data.filter(item => item.status === 'Out of Stock').length
          });
        }
      } catch (err) {
        setError('Failed to load stock data');
        console.error('Stock data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = (updatedItem) => {
    setStockItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.quantity} ${item.name}(s) added to cart!`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setStockItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };


  const handleAddItem = async (newItem) => {
    try {
      const quantity = parseInt(newItem.initialQuantity);
      const minStockLevel = parseInt(newItem.minStockLevel) || 0;
      
      const newItemObj = {
        id: Math.max(0, ...stockItems.map(item => item.id)) + 1, 
        name: newItem.name,
        category: newItem.category,
        description: newItem.description,
        purchase_price: parseFloat(newItem.purchasePrice),
        selling_price: parseFloat(newItem.sellingPrice),
        quantity: quantity,
        supplier: newItem.supplier,
        min_stock_level: minStockLevel,
        status: quantity <= 0 ? 'Out of Stock' : quantity <= minStockLevel ? 'Low Stock' : 'In Stock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };


      const response = await mockApiResponse(newItemObj);
      if (response.success) {
        setStockItems(prevItems => [...prevItems, response.data]);
        
 
        setStats(prevStats => ({
          ...prevStats,
          totalProducts: prevStats.totalProducts + 1,
          ...(response.data.status === 'In Stock' && { inStock: prevStats.inStock + 1 }),
          ...(response.data.status === 'Low Stock' && { lowStock: prevStats.lowStock + 1 }),
          ...(response.data.status === 'Out of Stock' && { outOfStock: prevStats.outOfStock + 1 })
        }));
        
        alert('Item added successfully!');
        setIsAddItemFormOpen(false);
        return true;
      }
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item');
      return false;
    }
  };


  return (
    <div className="space-y-6 ">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">Manage your product stock and inventory levels</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-[#BE741E] text-white px-4 py-3 rounded-lg hover:bg-[#BE741E] transition duration-200 flex items-center gap-2 relative"
          >
            <MdShoppingCart className="text-xl" />
            Cart
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#BE741E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsAddItemFormOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2"
          >
            <MdAdd className="text-xl" />
            Add New Item
          </button>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2">
            <MdFilterList className="text-xl" />
            Filters
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Items</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl opacity-80"><MdInventory className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">In Stock</p>
              <p className="text-3xl font-bold">{stats.inStock}</p>
            </div>
            <div className="text-4xl opacity-80"><MdCheckCircle className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Low Stock</p>
              <p className="text-3xl font-bold">{stats.lowStock}</p>
            </div>
            <div className="text-4xl opacity-80"><MdSchedule className="text-6xl" /></div>
          </div>
        </div>
        <div className="bg-[#BE741E] text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Out of Stock</p>
              <p className="text-3xl font-bold">{stats.outOfStock}</p>
            </div>
            <div className="text-4xl opacity-80"><MdDelete className="text-6xl" /></div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Current Stock</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Purchase Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Selling Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.purchase_price?.toLocaleString()} Frw</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.selling_price?.toLocaleString()} Frw</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setIsViewModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition duration-200"
                        title="View Details"
                      >
                        <MdVisibility className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition duration-200"
                        title="Edit Item"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id || item._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition duration-200"
                        title="Delete Item"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                      <AddToCartButton 
                        item={item}
                        onAddToCart={handleAddToCart}
                        className="ml-2"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <AddItemForm 
        isOpen={isAddItemFormOpen}
        onClose={() => setIsAddItemFormOpen(false)}
        onSave={handleAddItem}
      />

      
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        title="Product Details"
        onEdit={handleEdit}
        onDelete={handleDelete}
        fields={[
          { key: 'name', label: 'Product Name' },
          { key: 'category', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'purchase_price', label: 'Purchase Price', render: (value) => `${value?.toLocaleString()} Frw` },
          { key: 'selling_price', label: 'Selling Price', render: (value) => `${value?.toLocaleString()} Frw` },
          { key: 'supplier', label: 'Supplier' },
          { key: 'min_stock_level', label: 'Minimum Stock Level' },
          { key: 'status', label: 'Status' },
          { key: 'created_at', label: 'Created At', render: (value) => new Date(value).toLocaleDateString() }
        ]}
      />

      
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        title="Edit Product"
        onSave={handleUpdateItem}
        fields={[
          { key: 'name', label: 'Product Name', required: true, placeholder: 'Enter product name' },
          { key: 'category', label: 'Category', required: true, type: 'select', options: [
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Clothing', label: 'Clothing' },
            { value: 'Food', label: 'Food' },
            { value: 'Construction', label: 'Construction' },
            { value: 'Automotive', label: 'Automotive' },
            { value: 'Other', label: 'Other' }
          ]},
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter product description' },
          { key: 'purchase_price', label: 'Purchase Price (Frw)', required: true, type: 'number', min: 0, placeholder: '0' },
          { key: 'selling_price', label: 'Selling Price (Frw)', required: true, type: 'number', min: 0, placeholder: '0' },
          { key: 'quantity', label: 'Quantity', required: true, type: 'number', min: 0, placeholder: '0' },
          { key: 'supplier', label: 'Supplier', required: true, placeholder: 'Enter supplier name' },
          { key: 'min_stock_level', label: 'Minimum Stock Level', type: 'number', min: 0, placeholder: '0' }
        ]}
      />

      {/* Cart Modal */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Stock;