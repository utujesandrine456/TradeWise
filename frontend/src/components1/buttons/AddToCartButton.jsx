import React, { useState } from 'react';
import { MdShoppingCart, MdAdd, MdRemove } from 'react-icons/md';

const AddToCartButton = ({ item, onAddToCart, className = "" }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= item.quantity) {
      onAddToCart({
        id: item.id || item._id,
        name: item.name,
        category: item.category,
        price: item.selling_price || item.sellingPrice || item.price,
        quantity: quantity,
        maxQuantity: item.quantity
      });
      setQuantity(1);
      setIsExpanded(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, item.quantity));
    setQuantity(validQuantity);
  };

  return (
    <div className={`relative ${className}`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-[#BE741E] text-white px-3 py-2 rounded-lg hover:bg-[#BE741E] transition duration-200 flex items-center gap-2 text-xs"
        >
          <MdShoppingCart className="text-xl" />
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="p-1 text-gray-600 hover:text-gray-800"
            disabled={quantity <= 1}
          >
            <MdRemove className="text-lg" />
          </button>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            min="1"
            max={item.quantity}
            className="w-12 text-center text-sm border-none focus:ring-0"
          />
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="p-1 text-gray-600 hover:text-gray-800"
            disabled={quantity >= item.quantity}
          >
            <MdAdd className="text-lg" />
          </button>
          
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
          >
            Add
          </button>
          
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 px-2"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
