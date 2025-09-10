import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MdDashboard, MdStorage, MdHistory, MdShoppingBag, MdAttachMoney, MdNotifications, MdCreditCard, MdShowChart, MdLogout } from "react-icons/md";
import { GiTrade } from "react-icons/gi";
import { BsBook } from "react-icons/bs";
import logo from '../assets/logo.png';
import Dashboard from './Dashboard';
import Stock from './Stock';
import History from './History';
import BuyingProducts from './BuyingProducts';
import SellingProducts from './SellingProducts';
import Notification from './Notification';
import CreditsDebit from './CreditsDebit';
import '../index.css'

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard className="mr-4 text-xl text-white" /> },
    { id: 'stock', name: 'Stock', icon: <MdStorage className="mr-4 text-xl text-white" /> },
    { id: 'history', name: 'History', icon: <MdHistory className="mr-4 text-xl text-white" /> },
    { id: 'buying', name: 'Buying Products', icon: <MdShoppingBag className="mr-4 text-xl text-white" /> },
    { id: 'selling', name: 'Selling Products', icon: <MdAttachMoney className="mr-4 text-xl text-white" /> },
    { id: 'notification', name: 'Notification', icon: <MdNotifications className="mr-4 text-xl text-white" /> },
    { id: 'credits', name: 'Credits/Debit', icon: <MdCreditCard className="mr-4 text-xl text-white" /> },
  ];

  const handleLogout = () => {
    authLogout();
    navigate('/Login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'stock':
        return <Stock />;
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
          <button 
            onClick={handleLogout}
            className="w-full flex items-center py-3 px-4 text-black hover:bg-white rounded-lg transition duration-200 font-medium cursor-pointer bg-white hover:shadow-md"
          >
            <MdLogout className="mr-4 text-xl"/>
            Logout
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white text-gray-800 hide-scrollbar">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm text-gray-800">
          <div className="text-3xl font-semibold">
            Welcome Back, {user?.company_name || 'User'}!
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>


    </div>
  );
};

export default DashboardLayout; 