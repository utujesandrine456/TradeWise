import React, { useState, useEffect, useMemo } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdInventory, MdCheckCircle, MdSchedule, MdLayers } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import AddItemForm from './forms/AddItemForm';
import ViewModal from './modals/ViewModal';
import EditModal from './modals/EditModal';
import { getStockImagesQuery, createStockImageMutation, updateStockImageMutation, deleteStockImageMutation, findStockImagesByQuery } from '../utils/gqlQuery';
import { backendGqlApi } from '../utils/axiosInstance';
import { debounce } from '../utils/debounce';
import { toast } from '../utils/toast';

const Stock = () => {
  const navigate = useNavigate();
  const { stockId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  const getStockImages = async () => {
    try {
      setLoading(true);
      const response = await backendGqlApi.post('', {
        query: getStockImagesQuery
      });

      const stockData = response.data.data.getStockImages;

      const transformedData = stockData.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        low_stock_quantity: item.low_stock_quantity || 5,
        status: item.quantity <= 0 ? 'Out Of Stock' : item.quantity < (item.low_stock_quantity || 5) ? 'Low Stock' : 'In Stock',
        unit: item.unit,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));

      setStockItems(transformedData);

      setStats({
        totalProducts: transformedData.length,
        inStock: transformedData.filter(item => item.status === 'In Stock').length,
        lowStock: transformedData.filter(item => item.status === 'Low Stock').length,
        outOfStock: transformedData.filter(item => item.status === 'Out Of Stock').length
      });

    } catch (err) {
      setError('failed to synchronize inventory data');
      toast.error('inventory sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStockImages();
  }, []);

  const fetchStockItem = async (id) => {
    try {
      const response = await backendGqlApi.post('', {
        query: findStockImagesByQuery,
        variables: { id }
      });

      if (response.data.data.getStockImage) {
        const item = response.data.data.getStockImage;
        const transformedItem = {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          low_stock_quantity: item.low_stock_quantity || 5,
          status: item.quantity <= 0 ? 'Out Of Stock' : item.quantity < (item.low_stock_quantity || 5) ? 'Low Stock' : 'In Stock',
          unit: item.unit,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
        setSelectedItem(transformedItem);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      toast.error('resource not found');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (stockId && stockItems.length > 0) {
      const stockItem = stockItems.find(item => item.id === stockId);
      if (stockItem) {
        setSelectedItem(stockItem);
        setIsViewModalOpen(true);
      } else {
        fetchStockItem(stockId);
      }
    }
  }, [stockId, stockItems]);

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const filteredItems = useMemo(() =>
    stockItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [stockItems, searchTerm]
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    setLoading(true);
    try {
      const response = await backendGqlApi.post('', {
        query: updateStockImageMutation,
        variables: {
          stockImageId: updatedItem.id,
          name: updatedItem.name,
          unit: updatedItem.unit,
          low_stock_quantity: parseInt(updatedItem.low_stock_quantity)
        }
      });

      if (response.data.data.updateStockImage) {
        const updated = response.data.data.updateStockImage;
        setStockItems(prevItems =>
          prevItems.map(item =>
            item.id === updated.id ? {
              ...item,
              name: updated.name,
              unit: updated.unit,
              low_stock_quantity: updated.low_stock_quantity,
              quantity: updated.quantity,
              status: updated.quantity <= 0 ? 'Out Of Stock' : updated.quantity < (updated.low_stock_quantity || 5) ? 'Low Stock' : 'In Stock',
              updatedAt: updated.updatedAt
            } : item
          )
        );
        toast.success('inventory record updated');
        setIsEditModalOpen(false);
      }
    } catch (error) {
      toast.error('failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    setDeleteConfirmText('');
  };

  const confirmDelete = async () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      setLoading(true);
      try {
        const response = await backendGqlApi.post('', {
          query: deleteStockImageMutation,
          variables: { stockImageId: itemToDelete.id }
        });

        if (response.data?.errors) {
          throw new Error(response.data.errors[0]?.message || 'error');
        }

        if (response.data?.data?.stockImage || response.data?.data?.deleteStockImage) {
          setStockItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
          toast.success('record purged successfully');
          setIsDeleteModalOpen(false);
          setIsViewModalOpen(false);
          setItemToDelete(null);
          setSelectedItem(null);
        }
      } catch (error) {
        toast.error('purge operation failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddItem = async (newItem) => {
    setLoading(true);
    try {
      const response = await backendGqlApi.post('', {
        query: createStockImageMutation,
        variables: {
          name: newItem.name,
          unit: newItem.unit,
          low_stock_quantity: parseInt(newItem.low_stock_quantity) || 5
        }
      });

      if (response.data.data.createStockImage) {
        const created = response.data.data.createStockImage;
        const newItemObj = {
          id: created.id,
          name: created.name,
          unit: created.unit,
          quantity: created.quantity,
          low_stock_quantity: created.low_stock_quantity,
          status: created.quantity <= 0 ? 'Out Of Stock' : created.quantity < (created.low_stock_quantity || 5) ? 'Low Stock' : 'In Stock',
          createdAt: created.createdAt,
          updatedAt: created.updatedAt
        };
        setStockItems(prevItems => [...prevItems, newItemObj]);
        toast.success('new inventory item registered');
        setIsAddItemFormOpen(false);
        return true;
      }
    } catch (err) {
      toast.error('registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (loading && stockItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist">
        <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-900 rounded-md animate-spin mb-6"></div>
        <p className="text-xl font-bold text-[#09111E] tracking-wide italic">Synchronizing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 bg-[#09111E] border border-white/5 p-12 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-white/5 rounded-md border border-white/5 shadow-xl group-hover:rotate-12 transition-all duration-500">
            <MdLayers className="text-5xl text-accent-400" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white leading-none mb-3 tracking-tight">Inventory Management</h2>
            <p className="text-brand-300 text-xs font-semibold mt-1 opacity-60">Manage your product levels and restock thresholds</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddItemFormOpen(true)}
          className="group relative px-12 py-5 bg-accent-400 text-brand-950 rounded-md font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden text-xs"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <MdAdd className="text-2xl" />
            <span>Add New Product</span>
          </div>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: MdInventory, detail: 'Unique registered items', color: 'accent-400' },
          { label: 'In Stock', value: stats.inStock, icon: MdCheckCircle, detail: 'Available for sale', color: 'green-500' },
          { label: 'Low Stock', value: stats.lowStock, icon: MdSchedule, detail: 'Below restock point', color: 'amber-400' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: MdDelete, detail: 'Restock required', color: 'red-500' }
        ].map((stat, i) => (
          <InventoryStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Inventory Table */}
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl overflow-hidden group/table relative">
        <div className="p-12 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-3 bg-white/5 rounded-md text-accent-400 border border-white/5 shadow-lg">
              <MdFilterList className="text-2xl" />
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">Product Catalog</h3>
          </div>
          <div className="w-full xl:w-[500px] relative z-10 group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/search:text-accent-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter catalog by product name..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-md text-white font-semibold tracking-tight text-lg placeholder:text-brand-300/40 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-10 py-6 text-left text-xs font-bold text-brand-300 tracking-wider">Product Name</th>
                <th className="px-10 py-6 text-left text-xs font-bold text-brand-300 tracking-wider">Unit</th>
                <th className="px-10 py-6 text-left text-xs font-bold text-brand-300 tracking-wider">Stock Level</th>
                <th className="px-10 py-6 text-left text-xs font-bold text-brand-300 tracking-wider">Status</th>
                <th className="px-10 py-6 text-right text-xs font-bold text-brand-300 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-all group/row relative">
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-accent-400 group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <p className="text-xl font-bold text-white group-hover/row:text-accent-400 transition-colors tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-brand-300 font-bold uppercase mt-2 tracking-widest italic opacity-40">System Id: {item.id?.slice(-8)}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-5 py-2 bg-white/5 rounded-md border border-white/5 text-xs text-brand-300 font-bold">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4 text-white">
                        <span className="text-3xl font-bold tracking-tight">{item.quantity}</span>
                        <span className="text-[9px] font-bold leading-tight opacity-40 uppercase tracking-wider italic">Items<br />Remaining</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-6 py-2.5 text-[10px] font-bold rounded-md border uppercase tracking-widest shadow-sm ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        item.status === 'Low Stock' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-5">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                            navigate(`/stock/${item.id}`);
                          }}
                          className="p-4 bg-white/5 text-brand-300 hover:text-accent-400 hover:bg-white/10 rounded-md border border-white/5 transition-all hover:shadow-2xl active:scale-95"
                          title="View Details"
                        >
                          <MdVisibility className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-4 bg-white/5 text-brand-300 hover:text-green-500 hover:bg-white/10 rounded-md border border-white/5 transition-all hover:shadow-2xl active:scale-95"
                          title="Modify Record"
                        >
                          <MdEdit className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-4 bg-white/5 text-brand-300 hover:text-red-500 hover:bg-white/10 rounded-md border border-white/5 transition-all hover:shadow-2xl active:scale-95"
                          title="Purge Record"
                        >
                          <MdDelete className="text-2xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="p-10 bg-white/5 rounded-md border border-white/5 shadow-inner inline-block mb-6">
                      <MdInventory className="text-6xl text-brand-300 opacity-20" />
                    </div>
                    <p className="text-xl font-bold text-white tracking-wide opacity-40">No items found in your catalog</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals placeholders */}
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
          navigate('/dashboard');
        }}
        data={selectedItem}
        title="Asset Inspection"
        onEdit={handleEdit}
        onDelete={handleDelete}
        fields={[
          { key: 'name', label: 'Product Name' },
          { key: 'unit', label: 'Unit of Measure' },
          { key: 'quantity', label: 'In Stock' },
          { key: 'low_stock_quantity', label: 'Low Stock Alert' },
          { key: 'status', label: 'Current Status' },
          { key: 'createdAt', label: 'Registry Date', render: (v) => v ? formatDistanceToNow(new Date(v), { addSuffix: true }) : 'N/A' },
          { key: 'updatedAt', label: 'Synchronized', render: (v) => v ? formatDistanceToNow(new Date(v), { addSuffix: true }) : 'N/A' }
        ]}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        title="Calibrate Record"
        onSave={handleUpdateItem}
        fields={[
          { key: 'name', label: 'Product Identity', required: true, placeholder: 'Enter Record Name' },
          {
            key: 'unit', label: 'Measurement Metric', required: true, type: 'select', options: [
              { value: 'Piece', label: 'Piece' },
              { value: 'Kilogram', label: 'Kilogram' },
              { value: 'Litre', label: 'Litre' },
              { value: 'Sac', label: 'Sac' },
              { value: 'Box', label: 'Box' },
              { value: 'Bottle', label: 'Bottle' }
            ]
          },
          { key: 'quantity', label: 'Current Quantity', type: 'number', disabled: true },
          { key: 'low_stock_quantity', label: 'Alert Threshold', type: 'number', min: 0 }
        ]}
      />

    </div>
  );
};

// Tactical Inventory Summary Component
const InventoryStatCard = ({ label, value, icon: Icon, detail, color }) => {
  const colorMap = {
    'accent-400': 'text-accent-400 bg-accent-400/10 border-accent-400/20 from-accent-400',
    'green-500': 'text-green-500 bg-green-500/10 border-green-500/20 from-green-500',
    'amber-400': 'text-amber-400 bg-amber-400/10 border-amber-400/20 from-amber-400',
    'red-500': 'text-red-500 bg-red-500/10 border-red-500/20 from-red-500',
  };

  const selectedColor = colorMap[color] || colorMap['accent-400'];
  const [textColor, bgStyle, borderStyle, gradStyle] = selectedColor.split(' ');

  return (
    <div className="group bg-[#09111E] p-10 rounded-md border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/10">
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50`} />
      <div className="relative z-10 flex flex-col h-full justify-between gap-10">
        <div className="flex items-center justify-between">
          <div className={`p-5 rounded-md border ${bgStyle} ${borderStyle} ${textColor} shadow-inner group-hover:scale-110 duration-500`}>
            <Icon className="text-3xl" />
          </div>
          <span className={`text-[10px] font-bold ${textColor} bg-white/5 px-4 py-2 rounded-md border border-white/5 shadow-inner tracking-wider`}>
            Stock Status
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-brand-300 mb-3 opacity-60">{label}</p>
          <h4 className="text-4xl font-bold text-white tracking-tight leading-none mb-3">
            {value} <span className="text-lg opacity-40 font-bold ml-2">Units</span>
          </h4>
          <p className="text-xs text-brand-300 font-semibold opacity-60">{detail}</p>
        </div>
      </div>
    </div>
  );
};

export default Stock;
