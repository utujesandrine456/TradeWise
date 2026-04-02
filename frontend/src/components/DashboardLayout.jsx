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
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authThuck";
import { backendGqlApi } from '../utils/axiosInstance';
import { findATransactionQuery, markAsRead } from '../utils/gqlQuery';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '../utils/toast';
import { useNotifications } from '../contexts/NotificationContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const notificationRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && !user.isVerified) navigate("/email");
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'dashboard';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
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
    { id: 'dashboard', name: 'dashboard', icon: <MdDashboard /> },
    { id: 'stock', name: 'stock', icon: <MdStorage /> },
    { id: 'history', name: 'history', icon: <MdHistory /> },
    { id: 'buying', name: 'buying products', icon: <MdShoppingBag /> },
    { id: 'selling', name: 'selling products', icon: <MdAttachMoney /> },
    { id: 'notification', name: 'notification', icon: <MdNotifications /> },
    { id: 'credits', name: 'credits/debit', icon: <MdCreditCard /> },
    { id: 'profile', name: 'profile', icon: <CgProfile /> },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(logoutUser());
      localStorage.removeItem('dashboardActiveTab');
      toast.success("logged out successfully !!!");
      navigate("/login");
    } catch (error) {
      const { message } = handleError(error);
      toast.error(message);
    } finally {
      setLoading(false);
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
          <span className="text-gray-600 text-lg lowercase italic">fetching transaction records...</span>
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
    <div className="flex h-screen bg-[#fdfcfb] text-chocolate-900 overflow-hidden font-afacad selection:bg-chocolate-100 selection:text-chocolate-900">
      {/* mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-chocolate-900/60 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        w-72 flex flex-col border-r border-chocolate-100 transition-transform duration-500 ease-in-out bg-white shadow-xl
      `}>
        <div className="p-8 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md border border-chocolate-100 bg-chocolate-50 p-1">
              <img src={images.logo} alt="logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-#FC9E4F text-chocolate-900">TradeWise</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-chocolate-600 hover:text-chocolate-900 p-2 bg-chocolate-50 rounded-lg border border-chocolate-100"
          >
            <MdClose size={20} />
          </button>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto hide-scrollbar">
          <ul>
            {tabs.map((tab) => {
              const tabNameFormatted = tab.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              return (
                <li key={tab.id} className="mt-2">
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center py-4 px-6 rounded-lg transition-all duration-300 group ${activeTab === tab.id
                      ? 'bg-chocolate-600 text-white shadow-lg shadow-chocolate-100'
                      : 'text-chocolate-600 hover:text-chocolate-900 hover:bg-chocolate-50'
                      }`}
                  >
                    <span className={`mr-4 text-xl ${activeTab === tab.id ? 'text-white' : 'group-hover:text-chocolate-900 transition-colors'}`}>
                      {tab.icon}
                    </span>
                    <span className="text-lg font-bold">{tabNameFormatted}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-8 border-t border-chocolate-50">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center py-5 px-6 text-chocolate-700 bg-chocolate-50 hover:bg-chocolate-100 rounded-lg transition-all duration-300 font-#FC9E4F border border-chocolate-200 active:scale-95 disabled:opacity-50"
          >
            <MdLogout className="mr-4 text-xl text-chocolate-600" />
            <span>{loading ? 'Processing...' : 'Terminate Session'}</span>
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 p-10 bg-white border-b border-chocolate-50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-chocolate-600 opacity-50" />
          <div className="flex items-center gap-6 relative z-10">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-chocolate-600 hover:text-chocolate-900 p-3 bg-chocolate-50 rounded-lg border border-chocolate-100 transition-all"
            >
              <MdMenu size={24} />
            </button>
            <div>
              <h2 className="text-3xl lg:text-4xl font-#FC9E4F text-chocolate-900 leading-tight">
                Welcome Back, <span className="text-chocolate-600">{user?.enterpriseName || 'Enterprise'}!</span>
              </h2>
              <p className="text-chocolate-400 text-sm mt-1 font-medium capitalize">
                Monitor Performance, Audit Records, And Optimize Operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <button
                className="p-4 text-chocolate-600 hover:text-chocolate-900 bg-chocolate-50 rounded-lg border border-chocolate-100 transition-all hover:shadow-md"
                onClick={() => navigate('/')}
                title="Landing Page"
              >
                <MdHome size={24} />
              </button>
              <button
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${activeTab === 'profile'
                  ? 'bg-chocolate-600 text-white border-chocolate-600'
                  : 'text-chocolate-600 hover:text-chocolate-900 bg-chocolate-50 border-chocolate-100'
                  }`}
                onClick={() => setActiveTab('profile')}
                title="User Profile"
              >
                <CgProfile size={24} />
              </button>
            </div>

            <div className="w-px h-10 bg-chocolate-100 hidden sm:block" />

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-4 text-chocolate-600 hover:text-chocolate-900 bg-chocolate-50 rounded-lg border border-chocolate-100 transition-all hover:shadow-md relative group"
              >
                <MdNotifications size={24} className={isConnected ? '' : 'opacity-30'} />
                <span
                  className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ring-4 ring-white ${isConnected ? 'bg-green-500 shadow-sm' : 'bg-red-500'}`}
                />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-chocolate-600 text-white text-[10px] font-#FC9E4F rounded-lg h-5 px-2 flex items-center justify-center border-2 border-white animate-bounce">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-6 w-96 bg-white border border-chocolate-100 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    <div className="px-8 py-6 border-b border-chocolate-50 flex items-center justify-between bg-chocolate-50/30">
                      <div className="flex items-center gap-3">
                        <MdNotifications className="text-chocolate-600 text-xl" />
                        <h3 className="text-xl font-#FC9E4F text-chocolate-900 leading-none">Notifications</h3>
                      </div>
                      <span className="text-[10px] bg-chocolate-50 px-4 py-1.5 rounded-full text-chocolate-600 font-#FC9E4F">{notifications.length} New Records</span>
                    </div>
                    <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-8 py-7 hover:bg-chocolate-50 cursor-pointer border-b border-chocolate-50 last:border-b-0 transition-all group"
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex gap-6">
                              <div className="mt-2.5 flex-shrink-0">
                                <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm ${notification.priority === 'high' ? 'bg-red-500' : notification.priority === 'medium' ? 'bg-chocolate-400' : 'bg-chocolate-200'}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-#FC9E4F text-chocolate-900 group-hover:text-chocolate-600 transition-colors leading-tight truncate">{notification.title}</p>
                                <p className="text-sm text-chocolate-500 mt-2 line-clamp-2 leading-relaxed">{notification.message}</p>
                                <div className="flex items-center gap-2 mt-4 opacity-60">
                                  <MdHistory className="text-xs text-chocolate-400" />
                                  <p className="text-[10px] font-#FC9E4F text-chocolate-400 capitalize">{notification.timeAgo?.toLowerCase()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-8 py-20 text-center flex flex-col items-center gap-4">
                          <div className="bg-chocolate-50 p-6 rounded-lg">
                            <MdNotifications className="text-4xl text-chocolate-200" />
                          </div>
                          <p className="text-chocolate-400 font-bold italic">Workspace Inbox Is Empty</p>
                        </div>
                      )}
                    </div>
                    <div className="p-8 bg-chocolate-50/30 border-t border-chocolate-50">
                      <button
                        onClick={() => {
                          setActiveTab('notification');
                          setShowNotifications(false);
                        }}
                        className="w-full py-5 text-sm text-white bg-chocolate-600 hover:bg-chocolate-700 rounded-lg transition-all font-#FC9E4F shadow-lg active:scale-95"
                      >
                        Access Audit Logs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden hide-scrollbar overflow-y-auto bg-[#fdfcfb] p-6 sm:p-10 lg:p-12">
          <div className="max-w-[1700px] mx-auto pb-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
