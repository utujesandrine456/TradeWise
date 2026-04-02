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
        status: item.quantity <= 0 ? 'out of stock' : item.quantity < (item.low_stock_quantity || 5) ? 'low stock' : 'in stock',
        unit: item.unit,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));

      setStockItems(transformedData);

      setStats({
        totalProducts: transformedData.length,
        inStock: transformedData.filter(item => item.status === 'in stock').length,
        lowStock: transformedData.filter(item => item.status === 'low stock').length,
        outOfStock: transformedData.filter(item => item.status === 'out of stock').length
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
          status: item.quantity <= 0 ? 'out of stock' : item.quantity < (item.low_stock_quantity || 5) ? 'low stock' : 'in stock',
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
              status: updated.quantity <= 0 ? 'out of stock' : updated.quantity < (updated.low_stock_quantity || 5) ? 'low stock' : 'in stock',
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
          status: created.quantity <= 0 ? 'out of stock' : created.quantity < (created.low_stock_quantity || 5) ? 'low stock' : 'in stock',
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
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-afacad">
        <div className="w-16 h-16 border-4 border-chocolate-100 border-t-chocolate-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-chocolate-600">Synchronizing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-afacad">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white p-10 rounded-lg border border-chocolate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-chocolate-50/20 opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-chocolate-50 rounded-lg border border-chocolate-100 shadow-sm group-hover:rotate-12 transition-all duration-500">
            <MdLayers className="text-5xl text-chocolate-600" />
          </div>
          <div>
            <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-none mb-3">Inventory Nexus</h2>
            <p className="text-chocolate-500 text-lg font-medium">Orchestrate Product Stock And Threshold Management</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddItemFormOpen(true)}
          className="group relative px-12 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden text-lg"
        >
          <div className="flex items-center gap-3 relative z-10">
            <MdAdd className="text-2xl" />
            <span>Register Item</span>
          </div>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Catalog Volume', value: stats.totalProducts, icon: MdInventory, detail: 'Registered Items', trend: 'neutral' },
          { label: 'Operational Stock', value: stats.inStock, icon: MdCheckCircle, detail: 'Optimal Levels', trend: 'up' },
          { label: 'Critical Status', value: stats.lowStock, icon: MdSchedule, detail: 'Below Threshold', trend: 'down' },
          { label: 'Liquidated Assets', value: stats.outOfStock, icon: MdDelete, detail: 'Zero Availability', trend: 'down' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-chocolate-100 rounded-lg p-10 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-chocolate-50 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-lg border shadow-sm ${stat.trend === 'up' ? 'bg-green-50 text-green-700 border-green-100' : stat.trend === 'down' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-chocolate-50 text-chocolate-600 border-chocolate-100'}`}>
                  <stat.icon className="text-3xl" />
                </div>
                <div className="text-[10px] font-#FC9E4F text-chocolate-400 bg-chocolate-50/50 px-4 py-1.5 rounded-full border border-chocolate-50 shadow-sm uppercase tracking-widest">
                  Live Inventory
                </div>
              </div>
              <div>
                <p className="text-sm font-#FC9E4F text-chocolate-400 uppercase tracking-wider mb-2 px-1">{stat.label}</p>
                <h4 className="text-4xl font-#FC9E4F text-chocolate-900 tracking-tight leading-none mb-3">
                  {stat.value} <span className="text-lg opacity-40 font-medium tracking-widest">UNITS</span>
                </h4>
                <p className="text-xs text-chocolate-500 font-bold opacity-60 px-1">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-xl overflow-hidden group/table">
        <div className="p-10 border-b border-chocolate-50 flex flex-col xl:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-chocolate-50/10 opacity-50 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <MdFilterList className="text-3xl text-chocolate-600" />
            <h3 className="text-2xl font-#FC9E4F text-chocolate-900 leading-none">Active Catalog</h3>
          </div>
          <div className="w-full xl:w-[500px] relative z-10 group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-chocolate-300 text-2xl group-focus-within/search:text-chocolate-600 transition-colors" />
            <input
              type="text"
              placeholder="Filter Catalog By Product Name..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all text-lg italic shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-chocolate-50/50">
                <th className="px-10 py-6 text-left text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em]">Product Identity</th>
                <th className="px-10 py-6 text-left text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em]">Measurement</th>
                <th className="px-10 py-6 text-left text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em]">Available Qty</th>
                <th className="px-10 py-6 text-left text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em]">Operational Status</th>
                <th className="px-10 py-6 text-right text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em]">Record Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate-50">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-chocolate-50/30 transition-all group/row">
                    <td className="px-10 py-8">
                      <p className="text-xl font-#FC9E4F text-chocolate-900 group-hover/row:text-chocolate-600 transition-colors">{item.name}</p>
                      <p className="text-[10px] text-chocolate-300 font-#FC9E4F uppercase mt-1">System ID: {item.id?.slice(-8)}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-1.5 bg-chocolate-50 rounded-full border border-chocolate-100 text-xs text-chocolate-600 font-#FC9E4F">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-chocolate-900">
                        <span className="text-2xl font-#FC9E4F">{item.quantity}</span>
                        <span className="text-[10px] font-#FC9E4F uppercase leading-none opacity-40">Items<br />Remaining</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-5 py-2 text-[10px] font-#FC9E4F rounded-lg border uppercase tracking-widest ${item.status === 'in stock' ? 'bg-green-50 text-green-700 border-green-100' :
                        item.status === 'low stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-4 opacity-40 group-hover/row:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                            navigate(`/stock/${item.id}`);
                          }}
                          className="p-3.5 bg-white text-chocolate-400 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg border border-chocolate-100 transition-all hover:shadow-md active:scale-95"
                        >
                          <MdVisibility className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-3.5 bg-white text-chocolate-400 hover:text-green-600 hover:bg-green-50 rounded-lg border border-chocolate-100 transition-all hover:shadow-md active:scale-95"
                        >
                          <MdEdit className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-3.5 bg-white text-chocolate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-chocolate-100 transition-all hover:shadow-md active:scale-95"
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
                    <MdInventory className="text-6xl text-chocolate-100 mx-auto mb-6" />
                    <p className="text-xl font-#FC9E4F text-chocolate-300">No Matching Records In Catalog</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals placeholders - The actual form components will need to be refactored too */}
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
        title="Record Inspection"
        onEdit={handleEdit}
        onDelete={handleDelete}
        fields={[
          { key: 'name', label: 'Identification' },
          { key: 'unit', label: 'Measurement Unit' },
          { key: 'quantity', label: 'Available Quantity' },
          { key: 'low_stock_quantity', label: 'Alert Threshold' },
          { key: 'status', label: 'Operational Status' },
          { key: 'createdAt', label: 'Epoch Creation', render: (v) => v ? formatDistanceToNow(new Date(v), { addSuffix: true }) : 'N/A' },
          { key: 'updatedAt', label: 'Last Refresh', render: (v) => v ? formatDistanceToNow(new Date(v), { addSuffix: true }) : 'N/A' }
        ]}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        title="Modify Record"
        onSave={handleUpdateItem}
        fields={[
          { key: 'name', label: 'Product Identity', required: true, placeholder: 'Enter Record Name' },
          {
            key: 'unit', label: 'Measurement Unit', required: true, type: 'select', options: [
              { value: 'Piece', label: 'Piece' },
              { value: 'Kilogram', label: 'Kilogram' },
              { value: 'Litre', label: 'Litre' }
            ]
          },
          { key: 'quantity', label: 'Current Quantity', type: 'number', disabled: true },
          { key: 'low_stock_quantity', label: 'Alert Threshold', type: 'number', min: 0 }
        ]}
      />

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-in fade-in duration-500">
          <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden relative p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <h2 className="text-3xl font-#FC9E4F text-chocolate-900 mb-6 relative z-10">Purge Authorization</h2>
            <p className="text-chocolate-500 text-lg font-medium mb-10 relative z-10 leading-relaxed capitalize">
              You are about to permanently delete <span className="text-chocolate-900 font-#FC9E4F">{itemToDelete?.name}</span>. This action is irreversible and will remove all associated history.
            </p>
            <div className="space-y-4 mb-12 relative z-10">
              <label className="text-xs font-#FC9E4F text-chocolate-300 uppercase px-2">Confirm Authorization Code</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg focus:ring-4 focus:ring-chocolate-50 text-chocolate-900 placeholder-chocolate-100 outline-none transition-all text-lg"
                placeholder="Type 'delete' to confirm"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-8 relative z-10">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                  setDeleteConfirmText('');
                }}
                className="text-chocolate-400 hover:text-chocolate-600 font-#FC9E4F transition-colors"
              >
                Abort Operation
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                className={`px-12 py-4 rounded-lg font-#FC9E4F transition-all shadow-lg ${deleteConfirmText.toLowerCase() === 'delete'
                  ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  : 'bg-chocolate-50 text-chocolate-200 cursor-not-allowed border border-chocolate-100'
                  }`}
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
