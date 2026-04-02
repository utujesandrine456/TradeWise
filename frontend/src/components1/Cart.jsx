import React, { useState } from 'react';
import { MdShoppingCart, MdClose, MdRemove, MdAdd, MdDelete, MdShoppingBasket } from 'react-icons/md';
import { useCart } from '../contexts/CartContext';

const Cart = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
    
    setTimeout(() => {
      setIsCheckoutOpen(false);
      clearCart();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MdShoppingCart className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
                <p className="text-sm text-gray-600">{getCartItemCount()} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <MdShoppingBasket className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-sm font-medium text-blue-600">
                      {item.price?.toLocaleString()} Frw
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <MdRemove className="text-lg" />
                    </button>
                    
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.maxQuantity || 1000)}
                      className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <MdAdd className="text-lg" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(item.price * item.quantity)?.toLocaleString()} Frw
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove item"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {getCartTotal().toLocaleString()} Frw
                </span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

        
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600">Thank you for your purchase.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
