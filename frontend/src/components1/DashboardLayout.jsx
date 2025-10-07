import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdDashboard, MdStorage, MdHistory, MdShoppingBag, MdAttachMoney, MdNotifications, MdCreditCard, MdShowChart, MdLogout } from "react-icons/md";
import logo from '../assets/logo.png';
import Dashboard from './Dashboard';
import Stock from './Stock';
import History from './History';
import BuyingProducts from './BuyingProducts';
import SellingProducts from './SellingProducts';
import Notification from './Notification';
import CreditsDebit from './CreditsDebit';
import Profile from './Profile';
import '../index.css';
import { mockNotifications, mockApiResponse } from '../__mock__';
import { CgProfile } from "react-icons/cg";



const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard className="mr-4 text-xl text-white" /> },
    { id: 'stock', name: 'Stock', icon: <MdStorage className="mr-4 text-xl text-white" /> },
    { id: 'history', name: 'History', icon: <MdHistory className="mr-4 text-xl text-white" /> },
    { id: 'buying', name: 'Buying Products', icon: <MdShoppingBag className="mr-4 text-xl text-white" /> },
    { id: 'selling', name: 'Selling Products', icon: <MdAttachMoney className="mr-4 text-xl text-white" /> },
    { id: 'notification', name: 'Notification', icon: <MdNotifications className="mr-4 text-xl text-white" /> },
    { id: 'credits', name: 'Credits/Debit', icon: <MdCreditCard className="mr-4 text-xl text-white" /> },
    { id: 'profile', name: 'Profile', icon: <CgProfile className="mr-4 text-xl text-white" /> },
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
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await mockApiResponse(mockNotifications);
        if (response.success) {
          setNotifications(response.data);
        }
      } catch (err) {
        console.error('Notifications error:', err);
      }
    };

    fetchNotifications();
  }, []);


  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 hide-scrollbar">
      <div className="w-64 shadow-2xl flex flex-col border-r border-gray-200 hide-scrollbar" style={{ backgroundColor: '#be741e' }}>
        <div className="p-6 border-b border-gray-200 flex items-center">
          <img src={logo} alt="TradeWise logo" className='w-[50px] h-[40px] rounded-full mr-1' />
          <h1 className="text-2xl font-bold tracking-wide text-white">TradeWise</h1>
        </div>
      
        {/* Navigation */}
        <nav className="flex-grow p-4 md:p-6 space-y-2 hide-scrollbar">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} className="mt-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center py-3 px-3 md:px-4 text-white rounded-lg transition duration-200 font-medium cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-black text-white shadow-lg transform scale-105' 
                      : 'hover:bg-black hover:shadow-md'
                  }`}
                >
                  {tab.icon}
                  <span className="truncate">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>


        <div className="p-4 md:p-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center py-3 px-4 text-black hover:bg-white rounded-lg transition duration-200 font-medium cursor-pointer bg-white hover:shadow-md"
          >
            <MdLogout className="mr-4 text-xl"/>
            Logout
          </button>
        </div>
      </div>


      <div className="flex-1 flex flex-col overflow-hidden bg-white text-gray-800 hide-scrollbar">

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white border-b border-gray-200 shadow-sm text-gray-800">
          <div className="text-2xl md:text-3xl font-semibold">
            Welcome Back, {user?.company_name || 'User'}!
            <p className="text-sm font-normal mt-1">Here’s your dashboard overview, be able to track you daily and monthly expense.</p>
          </div>
          <div className="relative flex flex-row items-center justify-center text-center">
            <button className='text-gray-600 mx-2 hover:text-black' onClick={() => setActiveTab('profile')}>
              <CgProfile size={24}/>
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <MdNotifications className="h-6 w-6" />
                {notifications.length > 0 && ( <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"> {notifications.length} </span> )}
              </button>
              

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => markNotificationAsRead(notification.id)} >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full ${ notification.priority === 'high' ? 'bg-red-400' :  notification.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400' }`}></div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-gray-50 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 