import { useState, useEffect, useMemo } from 'react';
import Loader from './Loader';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdInventory, MdCheckCircle, MdSchedule, MdLayers } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import AddItemForm from './forms/AddItemForm';
import ViewModal from './modals/ViewModal';
import EditModal from './modals/EditModal';
import { getStockImagesQuery, createStockImageMutation, updateStockImageMutation, deleteStockImageMutation, findStockImagesByQuery } from '../utils/gqlQuery';
import { backendGqlApi } from '../utils/axiosInstance';
import { debounce } from '../utils/debounce';
import { toast } from '../utils/toast';
import { Plus } from 'lucide-react';

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
    return null;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10 text-[#09111E]">
          <div className="p-3 bg-gray-50 rounded-full text-[#09111E] border border-gray-100 shadow-sm">
            <MdInventory className="text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-[#09111E]">Stock Records</h3>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#09111E] leading-none mb-3">Inventory Registry</h1>
          <p className="text-[#09111E]/80 text-lg font-medium opacity-60">Real-time asset tracking and stock level management</p>
        </div>
        <button
          onClick={() => setIsAddItemFormOpen(true)}
          className="group relative px-6 py-4 bg-[#09111E] text-white rounded-md font-semibold transition-all shadow-lg overflow-hidden text-sm"
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
      <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden group/table relative">
        <div className="p-12 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="w-full xl:w-[500px] relative z-10 group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#09111E]/60 text-2xl group-focus-within/search:text-[#09111E] transition-colors" />
            <input
              type="text"
              placeholder="Filter catalog by product name..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-14 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-md text-[#09111E] font-medium text-md placeholder:text-[#09111E]/60 focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-gray-100 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80 w-1/3">Asset Identifier</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Classification</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Volume</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Status</th>
                <th className="px-10 py-6 text-right text-sm font-bold text-[#09111E]/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-all group/row relative border-b border-gray-50 last:border-0 text-[#09111E]">
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#09111E] group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <p className="text-base font-bold text-[#09111E] group-hover/row:text-[#09111E] transition-colors leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-[10px] text-[#09111E]/60 font-bold mt-2 italic opacity-40">System Id: {item.id?.slice(-8)}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-5 py-2 bg-gray-50 rounded-md border border-gray-100 text-xs text-[#09111E]/80 font-bold italic">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4 text-[#09111E]">
                        <span className="text-3xl font-bold">{item.quantity}</span>
                        <span className="text-[9px] font-bold leading-tight opacity-40 italic">Items<br />Remaining</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-6 py-2.5 text-[10px] font-bold rounded-md border shadow-sm ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-red-50 text-red-600 border-red-100'
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
                          className="p-4 bg-gray-50 text-[#09111E]/60 hover:text-[#09111E] hover:bg-gray-100 rounded-md border border-gray-100 transition-all hover:shadow-md active:scale-95"
                          title="View Details"
                        >
                          <MdVisibility className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-4 bg-gray-50 text-[#09111E]/60 hover:text-[#09111E] hover:bg-emerald-50 rounded-md border border-gray-100 transition-all hover:shadow-md active:scale-95"
                          title="Modify Record"
                        >
                          <MdEdit className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-4 bg-gray-50 text-[#09111E]/60 hover:text-[#09111E] hover:bg-red-50 rounded-md border border-gray-100 transition-all hover:shadow-md active:scale-95"
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
                  <td colSpan="5" className="px-10 py-40">
                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
                      <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-gray-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative p-8 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                          <MdInventory className="text-7xl text-[#09111E]/50 group-hover:text-[#09111E] transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-[#09111E] mb-4">No Asset Records</h3>
                      <p className="text-[#09111E]/80 italic font-medium opacity-80 leading-relaxed mb-12 text-center text-sm">
                        {searchTerm
                          ? 'The specific operational parameters yielded zero recorded matches within the inventory registry.'
                          : 'The inventory repository is currently empty. Define a new asset to map your physical supply chain.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsAddItemFormOpen(true)}
                          className="px-8 py-4 bg-[#09111E] text-white font-bold text-[16px] rounded-md hover:bg-[#0a1520] transition-all active:scale-95 shadow-xl flex items-center gap-2"
                        >
                          Create Product
                          <Plus size={16} />
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

    </div >
  );
};

// Tactical Inventory Summary Component
const InventoryStatCard = ({ label, value, unit, detail, color }) => {
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

export default Stock;
