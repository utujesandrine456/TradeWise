import React, { useEffect, useState } from 'react';
import { MdClose, MdSave, MdAttachMoney, MdAdd, MdDelete } from 'react-icons/md';
import { backendGqlApi } from '../../utils/axiosInstance';
import { toast } from '../../utils/toast';

const allProductsNameQuery = `
  query {
    productNames: getStockImages {
      id
      name
    }
  }
`;

export const createSaleTransactionMutation = `
  mutation CreateTransaction(
    $type: ENTransactionType!
    $products: [GqlTransactionCreateProductInput!]!
    $description: String!
    $secondParty: String!
    $financialDetails: GqlFinancialCreateInput
  ) {
    createTransaction(
      type: $type
      products: $products
      description: $description
      secondParty: $secondParty
      financialDetails: $financialDetails
    ) {
      id
      type
      description
      secondParty
      stock {
        id
      }
      products {
        id
        name
        quantity
        price
      }
    }
  }
`;

const SaleForm = ({ isOpen, onClose, onSave, setActiveTab }) => {
  const [formData, setFormData] = useState({
    description: '',
    secondParty: '',
    financialType: 'Credit',
    amount: '',
    financialDescription: '',
    collateral: '',
    deadline: ''
  });

  const [allProductsName, setAllProductsName] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchProductsName = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await backendGqlApi.post('/graphql', {
        query: allProductsNameQuery
      });
      setAllProductsName(response.data.data.productNames);
    } catch (error) {
      toast.error('failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProductsName();
    }
  }, [isOpen]);

  const [products, setProducts] = useState([]);
  const [includeFinancialDetails, setIncludeFinancialDetails] = useState(false);

  const formatCurrency = (amount) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    setProducts(prev => prev.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const addProduct = () => {
    setProducts(prev => [...prev, { name: '', price: '', quantity: '' }]);
  };

  const removeProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      toast.error('please add at least one product');
      return;
    }

    const hasInvalidProduct = products.some(product =>
      !product.name || !product.price || !product.quantity
    );

    if (hasInvalidProduct) {
      toast.error('please fill in all required fields (product, price, quantity) for all products');
      return;
    }

    try {
      setIsSubmitting(true);
      const productsInput = products.map(product => ({
        name: product.name,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity)
      }));

      const totalAmount = products
        .filter(p => p.name && p.price && p.quantity)
        .reduce((sum, product) => sum + (parseFloat(product.price) * parseInt(product.quantity)), 0);

      let financialDetails = null;
      if (includeFinancialDetails) {
        financialDetails = {
          type: formData.financialType,
          amount: formData.amount ? parseFloat(formData.amount) : totalAmount,
          description: formData.financialDescription || `payment for ${formData.description}`,
          collateral: formData.collateral || null,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
        };
      }

      const response = await backendGqlApi.post('/graphql', {
        query: createSaleTransactionMutation,
        variables: {
          type: "Sale",
          description: formData.description,
          secondParty: formData.secondParty,
          products: productsInput,
          financialDetails
        }
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      toast.success('sale created successfully!');

      setFormData({
        description: '',
        secondParty: '',
        financialType: 'Credit',
        amount: '',
        financialDescription: '',
        collateral: '',
        deadline: ''
      });
      setProducts([]);
      setIncludeFinancialDetails(false);

      if (onSave) {
        onSave(response.data.data.createTransaction);
      }
      onClose();

    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('request timed out. please try again.');
      } else {
        toast.error(`error creating sale: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 shadow-sm">
              <MdAttachMoney className="text-chocolate-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">New Sale Transaction</h2>
              <p className="text-sm text-chocolate-400 font-medium mt-1">Track Outbound Commerce Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-chocolate-100 border-t-chocolate-600 rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-xl font-#FC9E4F text-chocolate-900 capitalize">Loading Products...</p>
                <p className="text-sm text-chocolate-500 mt-2">Fetching Available Inventory Items</p>
              </div>
            </div>
          ) : allProductsName.length === 0 ? (
            <div className="bg-chocolate-50 border border-chocolate-100 p-16 rounded-lg text-center shadow-sm">
              <div className="max-w-md mx-auto space-y-8">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-chocolate-100 shadow-sm">
                  <MdAttachMoney className="text-chocolate-300 text-5xl" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-#FC9E4F text-chocolate-900 capitalize">No Products Found</h4>
                  <p className="text-chocolate-500 leading-relaxed font-medium">Your inventory is empty. Please register products before creating sales.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (setActiveTab) setActiveTab('stock');
                  }}
                  className="px-10 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg"
                >
                  Go To Stock Management
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                <h3 className="text-xl font-#FC9E4F text-chocolate-900 flex items-center gap-4">
                  <span className="w-3 h-3 bg-chocolate-600 rounded-full shadow-sm" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Transaction Description *</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                      placeholder="e.g., Bulk Product Sale"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Customer Name *</label>
                    <input
                      type="text"
                      name="secondParty"
                      value={formData.secondParty}
                      onChange={handleChange}
                      required
                      className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                      placeholder="e.g., Enterprise Solutions Ltd"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-chocolate-50 p-10 rounded-lg border border-chocolate-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-lg border transition-all duration-500 ${includeFinancialDetails ? 'bg-white border-chocolate-200 shadow-sm' : 'bg-white/50 border-chocolate-100'}`}>
                      <MdSave className={`text-2xl transition-colors ${includeFinancialDetails ? 'text-chocolate-600' : 'text-chocolate-300'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-#FC9E4F text-chocolate-900">Financial Record</h3>
                      <p className="text-sm text-chocolate-500 font-medium mt-1">Automatically Generate Credit Or Debit Entries</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeFinancialDetails(!includeFinancialDetails)}
                    className={`relative w-20 h-10 rounded-full transition-all duration-500 focus:outline-none shadow-sm ${includeFinancialDetails ? 'bg-chocolate-600' : 'bg-chocolate-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-sm transition-transform duration-500 ${includeFinancialDetails ? 'translate-x-10' : 'translate-x-0'}`} />
                  </button>
                </div>

                {includeFinancialDetails && (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Financial Type</label>
                      <select
                        name="financialType"
                        value={formData.financialType}
                        onChange={handleChange}
                        className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 appearance-none cursor-pointer shadow-sm transition-all"
                      >
                        <option value="Credit" className="bg-white">Credit</option>
                        <option value="Debit" className="bg-white">Debit</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Total Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-#FC9E4F"
                        placeholder="Auto-calculates if empty"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Payment Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none shadow-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-64 h-64 bg-chocolate-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-#FC9E4F text-chocolate-900 flex items-center gap-4">
                    <span className="w-3 h-3 bg-chocolate-600 rounded-full shadow-sm" />
                    Products List
                  </h3>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center gap-3 px-8 py-4 bg-chocolate-50 text-chocolate-600 border border-chocolate-100 rounded-lg font-#FC9E4F hover:bg-chocolate-600 hover:text-white transition-all active:scale-95 shadow-sm group"
                  >
                    <MdAdd className="text-xl group-hover:rotate-90 transition-transform" />
                    Add Line Item
                  </button>
                </div>

                {products.length > 0 && (
                  <div className="bg-white border border-chocolate-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto overflow-y-visible">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-chocolate-50">
                            <th className="px-8 py-6 text-left text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-widest">Product</th>
                            <th className="px-8 py-6 text-center text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-widest w-44">Unit Price</th>
                            <th className="px-8 py-6 text-center text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-widest w-32">Qty</th>
                            <th className="px-8 py-6 text-right text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-widest">Subtotal</th>
                            <th className="px-8 py-6 text-center text-xs font-#FC9E4F text-chocolate-400 uppercase tracking-widest w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-chocolate-50 text-chocolate-900">
                          {products.map((product, index) => (
                            <tr key={index} className="hover:bg-chocolate-50/30 transition-all group/row">
                              <td className="px-8 py-6">
                                <select
                                  value={product.name}
                                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                  className="w-full px-6 py-4 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 text-sm focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium appearance-none cursor-pointer shadow-sm"
                                >
                                  <option value="" className="bg-white">Choose Item</option>
                                  {allProductsName.map((productOption) => (
                                    <option key={productOption.id} value={productOption.name} className="bg-white">
                                      {productOption.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-8 py-6">
                                <input
                                  type="number"
                                  value={product.price}
                                  onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                  placeholder="0"
                                  className="w-full px-6 py-4 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-#FC9E4F text-center"
                                />
                              </td>
                              <td className="px-8 py-6">
                                <input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                  placeholder="0"
                                  min="1"
                                  className="w-full px-6 py-4 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-#FC9E4F text-center"
                                />
                              </td>
                              <td className="px-8 py-6 text-right">
                                <span className="text-sm font-#FC9E4F text-chocolate-900 tabular-nums">
                                  {product.price && product.quantity ?
                                    formatCurrency(parseFloat(product.price) * parseInt(product.quantity)) :
                                    "0.00"
                                  } FRW
                                </span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeProduct(index)}
                                  className="p-4 text-chocolate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-75 hover:scale-110"
                                >
                                  <MdDelete className="text-2xl" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {products.length > 0 && products.some(p => p.name && p.price && p.quantity) && (
                          <tfoot className="bg-chocolate-50/50">
                            <tr>
                              <td colSpan="3" className="px-8 py-8 text-right text-chocolate-400 font-bold capitalize">Calculated Grand Total</td>
                              <td className="px-8 py-8 text-right font-#FC9E4F text-chocolate-900 text-2xl tabular-nums">
                                {formatCurrency(products
                                  .filter(p => p.name && p.price && p.quantity)
                                  .reduce((sum, product) => sum + (parseFloat(product.price) * parseInt(product.quantity)), 0))} FRW
                              </td>
                              <td className="px-8 py-8"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="flex items-center justify-end gap-6 pt-10 border-t border-chocolate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-5 text-chocolate-400 font-#FC9E4F hover:text-chocolate-600 bg-chocolate-50 rounded-lg border border-chocolate-100 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg disabled:opacity-50 disabled:grayscale"
            >
              {isSubmitting ? 'Processing...' : 'Create Sale Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
