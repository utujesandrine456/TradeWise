import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MdDashboard, MdStorage, MdHistory, MdShoppingBag, MdAttachMoney, MdNotifications, MdCreditCard, MdLogout, MdHome, MdMenu, MdClose } from "react-icons/md";
import images from '../utils/images';
import Dashboard from './Dashboard';
import Stock from './Stock';
import History from './History';
import BuyingProducts from './BuyingProducts';
import SellingProducts from './SellingProducts';
import Notification from './Notification';
import CreditsDebit from './CreditsDebit';
import Profile from './Profile';
import '../index.css';
import { CgProfile } from "react-icons/cg";
import { handleError } from '../utils/handleError';
import { useAuth } from '../hooks/useAuth';
import { backendGqlApi } from '../utils/axiosInstance';
import { findATransactionQuery, markAsRead } from '../utils/gqlQuery';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '../utils/toast';
import { useNotifications } from '../contexts/NotificationContext';
import { ArrowLeft } from 'lucide-react';



const DashboardLayout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const notificationRef = useRef(null);

  const { trader: user, logout } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'dashboard';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingTransaction, setIsSearchingTransaction] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { notifications: wsNotifications, isConnected, markAsRead: markAsReadInContext } = useNotifications();

  useEffect(() => {
    if (params.id && location.pathname.includes('/transaction/')) {
      const searchTransaction = async () => {
        try {
          setIsSearchingTransaction(true);
          const response = await backendGqlApi.post('/graphql', {
            query: findATransactionQuery,
            variables: { transactionId: params.id }
          });

          if (response.data.data?.transaction) {
            const transaction = response.data.data.transaction;
            if (transaction.type === 'Sale') {
              setActiveTab('selling');
            } else if (transaction.type === 'Purchase') {
              setActiveTab('buying');
            } else {
              setActiveTab('buying');
            }
          } else {
            toast.error(`transaction ${params.id} not found`);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('error searching for transaction:', error);
          toast.error(`error finding transaction: ${error.message}`);
          setActiveTab('buying');
        } finally {
          setIsSearchingTransaction(false);
        }
      };
      searchTransaction();
    }
  }, [params.id, location.pathname, navigate]);

  const notifications = wsNotifications
    .filter(notif => !notif.read)
    .slice(0, 5)
    .map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      priority: notif.impact?.toLowerCase() || 'low',
      created_at: notif.createdAt,
      timeAgo: notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'just now'
    }));

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard /> },
    { id: 'stock', name: 'Stock', icon: <MdStorage /> },
    { id: 'history', name: 'History', icon: <MdHistory /> },
    { id: 'buying', name: 'Buying Products', icon: <MdShoppingBag /> },
    { id: 'selling', name: 'Selling Products', icon: <MdAttachMoney /> },
    { id: 'notification', name: 'Notification', icon: <MdNotifications /> },
    { id: 'credits', name: 'Credits/Debit', icon: <MdCreditCard /> },
    { id: 'profile', name: 'Profile', icon: <CgProfile /> },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await logout();
      localStorage.removeItem('dashboardActiveTab');
      toast.success("logged out successfully !!!");
      navigate("/login");
    } catch (error) {
      const { message } = handleError(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await backendGqlApi.post('/graphql', {
        query: markAsRead,
        variables: { id: notificationId }
      });

      if (response.data.errors) {
        console.error('error marking notification as read:', response.data.errors);
        toast.error('failed to mark notification as read');
        return;
      }

      markAsReadInContext(notificationId);
      toast.success('notification acknowledged');
    } catch (error) {
      console.error('error marking notification as read:', error);
      toast.error('failed to mark notification as read');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const renderContent = () => {
    if (isSearchingTransaction) {
      return (
        <div className="flex items-center justify-center h-40">
          <span className="text-[#09111E]/40 text-lg font-bold italic">Fetching Transaction Records...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'stock': return <Stock />;
      case 'history': return <History />;
      case 'buying': return <BuyingProducts setActiveTab={setActiveTab} />;
      case 'selling': return <SellingProducts setActiveTab={setActiveTab} />;
      case 'notification': return <Notification />;
      case 'credits': return <CreditsDebit />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-[#09111E] overflow-hidden font-Urbanist selection:bg-brand-400 selection:text-white">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#020407]/80 z-40 lg:hidden backdrop-blur-md transition-all"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        ${isSidebarCollapsed ? 'w-24' : 'w-72'} 
        flex flex-col border-r border-white/5 transition-all duration-500 ease-in-out bg-[#060B14] shadow-2xl
      `}>
        <div className={`p-6 border-b border-white/5 flex items-center bg-[#04080D]/50 transition-all ${isSidebarCollapsed ? 'justify-center p-4' : 'justify-between'}`}>
          <div className="flex items-center gap-4">
            <div className={`rounded-full overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-1.5 transition-all hover:rotate-6 ${isSidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}>
              <img src={images.logo} alt="Stocka Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            {!isSidebarCollapsed && <h1 className="text-2xl font-nosifer font-bold text-white animate-in fade-in duration-500">Stocka</h1>}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white/60 hover:text-white p-2 bg-white/5 rounded-md border border-white/10 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto hide-scrollbar">
          <ul>
            {tabs.map((tab) => {
              return (
                <li key={tab.id} className="mt-2">
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center py-4 px-6 rounded-md transition-all duration-300 group ${activeTab === tab.id
                      ? 'bg-white/80 shadow-xl scale-[1.02] text-brand-600'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                      } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                    title={isSidebarCollapsed ? tab.name : ''}
                  >
                    <span className={`text-xl ${isSidebarCollapsed ? 'mr-0' : 'mr-4'} ${activeTab === tab.id ? 'text-brand-600' : 'text-white/20 group-hover:text-white transition-colors'}`}>
                      {tab.icon}
                    </span>
                    {!isSidebarCollapsed && <span className="text-[14px] font-medium animate-in fade-in duration-500">{tab.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-8 border-t border-white/5 bg-[#04080D]/60 text-white transition-all ${isSidebarCollapsed ? 'p-4' : 'p-8'}`}>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`w-full flex items-center text-red-400 bg-white/5 hover:bg-red-500/10 rounded-md transition-all duration-300 font-semibold text-[14px] border border-white/10 active:scale-95 disabled:opacity-50 ${isSidebarCollapsed ? 'justify-center px-0 py-4' : 'py-4 px-8'}`}
            title={isSidebarCollapsed ? 'Logout' : ''}
          >
            <MdLogout className={`${isSidebarCollapsed ? 'mr-0' : 'mr-4'} text-xl`} />
            {!isSidebarCollapsed && <span className="animate-in fade-in duration-500">{isLoading ? 'Processing...' : 'Logout'}</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 p-3 bg-white border-b border-gray-100 shadow-sm relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#09111E]/10 to-transparent" />
          <div className="flex items-center gap-6 relative z-10 text-[#09111E]">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen(true);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              className="text-[#09111E] hover:text-[#09111E] p-3 bg-white rounded-full border border-[#09111E]/10 transition-all font-bold active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="animate-in slide-in-from-left-4 duration-500">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#09111E] leading-none">
                Welcome Back, <span className="text-[#09111E]/60">{user?.enterpriseName || 'Enterprise'}!</span>
              </h2>
              <p className="text-[#09111E]/40 text-[16px] font-medium mt-1">
                Strategic Intelligence & Operational Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-[#09111E]/60 hover:text-[#09111E] hover:bg-gray-50 bg-gray-50 rounded-full border border-gray-100 transition-all"
                onClick={() => navigate('/')}
                title="Landing Page"
              >
                <MdHome size={20} />
              </button>
              <button
                className={`p-2 rounded-full border transition-all ${activeTab === 'profile'
                  ? 'bg-[#09111E] text-white border-[#09111E] shadow-lg'
                  : 'text-[#09111E]/60 hover:text-[#09111E] hover:bg-gray-50 bg-gray-50 border-gray-100'
                  }`}
                onClick={() => setActiveTab('profile')}
                title="User Profile"
              >
                <CgProfile size={20} />
              </button>
            </div>

            <div className="w-px h-10 bg-gray-100 hidden sm:block" />

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#09111E]/60 hover:text-[#09111E] hover:bg-gray-50 bg-gray-50 rounded-full border border-gray-100 transition-all relative group/bell"
              >
                <MdNotifications size={20} className={isConnected ? '' : 'opacity-80'} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-md h-5 px-2 flex items-center justify-center border-2 border-white animate-bounce">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-6 w-96 bg-white border border-gray-100 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <MdNotifications className="text-[#09111E]/60 text-xl" />
                        <h3 className="text-lg font-bold text-[#09111E]">Audit Logs</h3>
                      </div>
                      <span className="text-[9px] bg-[#09111E] text-white px-4 py-1.5 rounded-md font-bold">{notifications.length} New</span>
                    </div>
                    <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-8 py-7 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all group"
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex gap-6">
                              <div className="mt-2.5 flex-shrink-0">
                                <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm ${notification.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : notification.priority === 'medium' ? 'bg-[#09111E]/40' : 'bg-[#09111E]/10'}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#09111E] group-hover:text-brand-600 transition-colors leading-tight truncate">{notification.title}</p>
                                <p className="text-xs text-[#09111E]/40 mt-2 font-bold line-clamp-2 leading-relaxed italic">{notification.message}</p>
                                <div className="flex items-center gap-2 mt-4 opacity-100">
                                  <MdHistory className="text-xs text-[#09111E]/20" />
                                  <p className="text-[9px] font-bold text-[#09111E]/20">{notification.timeAgo}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-8 py-20 text-center flex flex-col items-center gap-4">
                          <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                            <MdNotifications className="text-4xl text-[#09111E]/10" />
                          </div>
                          <p className="text-[#09111E]/20 font-bold text-[10px] italic">No Pending Notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-8 bg-gray-50/50 border-t border-gray-50">
                      <button
                        onClick={() => {
                          setActiveTab('notification');
                          setShowNotifications(false);
                        }}
                        className="w-full py-5 text-[10px] text-white bg-[#09111E] hover:bg-[#0a1520] rounded-md transition-all font-bold shadow-lg active:scale-95"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-white p-6 sm:p-10 lg:p-12 relative text-[#09111E]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
          <div className="max-w-[1700px] mx-auto pb-12 relative z-10 text-[#09111E]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
