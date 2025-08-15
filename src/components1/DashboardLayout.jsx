import React, { useState } from 'react';
import { MdDashboard, MdStorage, MdHistory, MdShoppingBag, MdAttachMoney, MdNotifications, MdCreditCard, MdShowChart, MdLogout } from "react-icons/md";
import { GiTrade } from "react-icons/gi";
import { BsBook } from "react-icons/bs";
import { FaDollarSign, FaShoppingCart } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import logo from '../assets/logo.png';
import Dashboard from './Dashboard';
import Stock from './Stock';
import History from './History';
import BuyingProducts from './BuyingProducts';
import SellingProducts from './SellingProducts';
import Notification from './Notification';
import CreditsDebit from './CreditsDebit';
import ShoppingCart from './ShoppingCart';
import '../index.css'

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard className="mr-4 text-xl text-white" /> },
    { id: 'stock', name: 'Stock', icon: <MdStorage className="mr-4 text-xl text-white" /> },
    { id: 'history', name: 'History', icon: <MdHistory className="mr-4 text-xl text-white" /> },
    { id: 'buying', name: 'Buying Products', icon: <MdShoppingBag className="mr-4 text-xl text-white" /> },
    { id: 'selling', name: 'Selling Products', icon: <MdAttachMoney className="mr-4 text-xl text-white" /> },
    { id: 'notification', name: 'Notification', icon: <MdNotifications className="mr-4 text-xl text-white" /> },
    { id: 'credits', name: 'Credits/Debit', icon: <MdCreditCard className="mr-4 text-xl text-white" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'stock':
        return <Stock onAddToCart={(item) => {
          setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
              return prev.map(cartItem => 
                cartItem.id === item.id 
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              );
            } else {
              return [...prev, item];
            }
          });
        }} />;
      case 'history':
        return <History />;
      case 'buying':
        return <BuyingProducts />;
      case 'selling':
        return <SellingProducts />;
      case 'notification':
        return <Notification />;
      case 'credits':
        return <CreditsDebit />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 hide-scrollbar">
      {/* Sidebar */}
      <div className="w-64 shadow-2xl flex flex-col border-r border-gray-200 hide-scrollbar" style={{ backgroundColor: '#be741e' }}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center">
          <img src={logo} alt="TradeWise logo" className='w-[50px] h-[40px] rounded-full mr-1' />
          <h1 className="text-2xl font-bold tracking-wide text-white">TradeWise</h1>
        </div>
      
        {/* Navigation */}
        <nav className="flex-grow p-6 space-y-2 hide-scrollbar">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} className="mt-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center py-3 px-4 text-white rounded-lg transition duration-200 font-medium cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-black text-white shadow-lg transform scale-105' 
                      : 'hover:bg-black hover:shadow-md'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-200">
          <button className="w-full flex items-center py-3 px-4 text-black hover:bg-white rounded-lg transition duration-200 font-medium cursor-pointer bg-white hover:shadow-md">
            <MdLogout className="mr-4 text-xl"/>
            Logout
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white text-gray-800 hide-scrollbar">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm text-gray-800">
          <div className="text-3xl font-semibold">Welcome Back, User!</div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <FaCartPlus className="text-[30px]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(itemId, newQuantity) => {
          setCartItems(prev => 
            prev.map(item => 
              item.id === itemId 
                ? { ...item, quantity: newQuantity }
                : item
            ).filter(item => item.quantity > 0)
          );
        }}
        onRemoveItem={(itemId) => {
          setCartItems(prev => prev.filter(item => item.id !== itemId));
        }}
        onCheckout={(items, total) => {
          console.log('Checkout completed:', { items, total });
          setCartItems([]);
          // Here you would typically process the checkout
        }}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
              
              return prev.map(cartItem => 
                cartItem.id === item.id 
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              );
            } else {
              
              return [...prev, item];
            }
          });
        }}
      />
    </div>
  );
};

export default DashboardLayout; 