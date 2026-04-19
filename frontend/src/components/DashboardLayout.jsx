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

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    if (isSearchingTransaction) {
      return (
        <div className="flex items-center justify-center h-40">
          <span className="text-brand-400 text-lg font-bold italic uppercase tracking-widest">Fetching Transaction Records...</span>
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
    <div className="flex h-screen bg-[#09111E] text-white/90 overflow-hidden font-Urbanist selection:bg-brand-400 selection:text-white">
      {/* mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#020407]/80 z-40 lg:hidden backdrop-blur-md transition-all"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        w-72 flex flex-col border-r border-white/5 transition-transform duration-500 ease-in-out bg-[#060B14] shadow-2xl
      `}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#04080D]/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-1.5">
              <img src={images.logo} alt="logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Stocka</h1>
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
                      }`}
                  >
                    <span className={`mr-4 text-xl ${activeTab === tab.id ? 'text-brand-600' : 'text-white/20 group-hover:text-white transition-colors'}`}>
                      {tab.icon}
                    </span>
                    <span className="text-[16px] font-medium">{tab.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#04080D]/30">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center py-4 px-8 text-red-400 bg-white/5 hover:bg-red-500/10 rounded-md transition-all duration-300 font-semibold text-[14px] border border-white/10 active:scale-95 disabled:opacity-50"
          >
            <MdLogout className="mr-4 text-xl" />
            <span>{isLoading ? 'Processing...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#09111E]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 p-10 bg-[#09111E]/40 backdrop-blur-xl border-b border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-center gap-6 relative z-10">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white hover:text-white p-3 bg-white/5 rounded-md border border-white/10 transition-all font-bold"
            >
              <MdMenu size={24} />
            </button>
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                Welcome Back, <span className="text-white/80">{user?.enterpriseName || 'Enterprise'}!</span>
              </h2>
              <p className="text-white/60 text-[16px] font-medium mt-3">
                Strategic Intelligence & Operational Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 bg-white/10 rounded-full border border-white/10 transition-all hover:shadow-2xl"
                onClick={() => navigate('/')}
                title="Landing Page"
              >
                <MdHome size={20} />
              </button>
              <button
                className={`p-2 rounded-full border transition-all hover:shadow-2xl ${activeTab === 'profile'
                  ? 'bg-white text-[#09111E] border-white shadow-2xl'
                  : 'text-white/80 hover:text-white hover:bg-white/10 bg-white/5 border-white/10'
                  }`}
                onClick={() => setActiveTab('profile')}
                title="User Profile"
              >
                <CgProfile size={20} />
              </button>
            </div>

            <div className="w-px h-10 bg-white/10 hidden sm:block" />

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-white hover:text-white hover:bg-white/5 bg-white/10 rounded-full border border-white/20 transition-all hover:shadow-2xl relative group/bell"
              >
                <MdNotifications size={20} className={isConnected ? '' : 'opacity-80'} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#09111E] text-[10px] font-black rounded-md h-5 px-2 flex items-center justify-center border-2 border-[#09111E] animate-bounce">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-6 w-96 bg-[#0B0F17] border border-white/10 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-4">
                        <MdNotifications className="text-white/60 text-xl" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Audit Logs</h3>
                      </div>
                      <span className="text-[9px] bg-white text-[#09111E] px-4 py-1.5 rounded-md font-black uppercase tracking-widest">{notifications.length} New</span>
                    </div>
                    <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-8 py-7 hover:bg-white/[0.03] cursor-pointer border-b border-white/5 last:border-b-0 transition-all group"
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex gap-6">
                              <div className="mt-2.5 flex-shrink-0">
                                <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-[#0B0F17] shadow-sm ${notification.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : notification.priority === 'medium' ? 'bg-white/40' : 'bg-white/10'}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-white group-hover:text-white transition-colors leading-tight truncate uppercase tracking-widest">{notification.title}</p>
                                <p className="text-xs text-white/40 mt-2 font-bold line-clamp-2 leading-relaxed italic">{notification.message}</p>
                                <div className="flex items-center gap-2 mt-4 opacity-100">
                                  <MdHistory className="text-xs text-white/20" />
                                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{notification.timeAgo}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-8 py-20 text-center flex flex-col items-center gap-4">
                          <div className="bg-white/5 p-6 rounded-md border border-white/10">
                            <MdNotifications className="text-4xl text-white/10" />
                          </div>
                          <p className="text-white/20 font-black uppercase tracking-widest text-[10px] italic">No Pending Notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-8 bg-black/20 border-t border-white/5">
                      <button
                        onClick={() => {
                          setActiveTab('notification');
                          setShowNotifications(false);
                        }}
                        className="w-full py-5 text-[10px] text-[#09111E] bg-white hover:bg-white/90 rounded-md transition-all font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95"
                      >
                        Launch Audit Center
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-[#09111E] p-6 sm:p-10 lg:p-12 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
          <div className="max-w-[1700px] mx-auto pb-12 relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
