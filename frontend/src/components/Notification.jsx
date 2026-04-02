import React, { useEffect, useState } from 'react';
import {
  MdNotifications,
  MdNotificationsActive,
  MdNotificationsOff,
  MdDelete, MdInfo, MdWarning,
  MdMarkEmailRead,
  MdCheckCircle,
  MdCalendarToday,
  MdError
} from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { backendGqlApi } from '../utils/axiosInstance';
import { getAllNotifications, markAsRead, markAllAsRead, getANotification, deleteReadNotifications } from '../utils/gqlQuery'
import ViewNotificationModal from './modals/ViewNotificationModal';
import { useNotifications } from '../contexts/NotificationContext';
import { toast } from '../utils/toast';


const Notification = () => {
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isConfirmReadOpen, setIsConfirmReadOpen] = useState(false);
  const [notificationToMarkRead, setNotificationToMarkRead] = useState(null);
  const [confirmReadText, setConfirmReadText] = useState('');
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);
  const [confirmAllText, setConfirmAllText] = useState('');
  const [isDeletingRead, setIsDeletingRead] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  const filteredNotifications = notifications
    .filter(n => {
      // Filter by filterType (not type)
      const typeMatch = selectedFilter === 'all' || n.filterType?.toUpperCase() === selectedFilter;
      // Filter by impact
      const impactMatch = selectedImpact === 'all' || n.impact === selectedImpact;
      return typeMatch && impactMatch;
    });

  const unreadCount = notifications.filter(n => !n.read).length;


  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <MdCheckCircle className="text-green-400" />;
      case 'warning':
        return <MdWarning className="text-amber-400" />;
      case 'info':
        return <MdInfo className="text-blue-400" />;
      case 'error':
        return <MdError className="text-red-400" />;
      default:
        return <MdInfo className="text-blue-400" />;
    }
  };

  const { refreshTrigger, notifications: wsNotifications } = useNotifications();

  // Fetch initial notifications from GraphQL
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await backendGqlApi.post('/graphql', {
          query: getAllNotifications,
        });

        if (response.data.errors) {
          toast.error('Error fetching notifications: ' + response.data.errors[0].message);
          return;
        }

        const notificationsData = response.data.data.getNotifications;

        // Transform backend data to match component format
        const transformedNotifications = notificationsData.map(notif => ({
          id: notif.id,
          type: notif.type || 'info', // Keep original type for display
          filterType: notif.filterType || 'INFO', // Use filterType for filtering
          title: notif.title,
          message: notif.message,
          time: notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now',
          read: Boolean(notif.read),
          impact: notif.impact || 'Low',
          createdAt: notif.createdAt,
          icon: getNotificationIcon(notif.filterType || notif.type)
        }));

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []); // Only fetch once on mount

  // Update notifications when WebSocket notifications change
  useEffect(() => {
    if (wsNotifications.length > 0) {
      setNotifications(prev => {
        // Transform WebSocket notifications
        const wsTransformed = wsNotifications.map(notif => ({
          id: notif.id,
          type: notif.type || 'info',
          filterType: notif.filterType || 'INFO',
          title: notif.title,
          message: notif.message,
          time: notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now',
          read: Boolean(notif.read),
          impact: notif.impact || 'Low',
          createdAt: notif.createdAt,
          icon: getNotificationIcon(notif.filterType || notif.type)
        }));

        // Merge with existing, putting new ones first
        const allNotifications = [...wsTransformed, ...prev];

        // Deduplicate by id
        const uniqueNotifications = Array.from(
          new Map(allNotifications.map(n => [n.id, n])).values()
        );

        return uniqueNotifications;
      });
    }
  }, [wsNotifications]); // Update when WebSocket notifications change

  // Handle URL parameter for direct notification viewing
  useEffect(() => {
    if (notificationId && notifications.length > 0) {
      const notification = notifications.find(notif => notif.id === notificationId);
      if (notification) {
        setSelectedNotification(notification);
        setIsViewModalOpen(true);
      } else {
        // If notification not found in current list, fetch it from backend
        fetchNotification(notificationId);
      }
    }
  }, [notificationId, notifications]);

  // Fetch specific notification from backend
  const fetchNotification = async (id) => {
    try {
      const response = await backendGqlApi.post('/graphql', {
        query: getANotification,
        variables: { id }
      });

      if (response.data.data.getANotification) {
        const notif = response.data.data.getANotification;
        const transformedNotification = {
          id: notif.id,
          type: notif.type || 'info',
          filterType: notif.filterType || 'INFO',
          title: notif.title,
          message: notif.message,
          time: notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now',
          read: Boolean(notif.read),
          impact: notif.impact || 'Low',
          createdAt: notif.createdAt,
          icon: getNotificationIcon(notif.filterType || notif.type)
        };
        setSelectedNotification(transformedNotification);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      toast.error('Notification not found');
      navigate('/dashboard');
    }
  };

  // Open confirmation modal for marking a single notification as read
  const handleMarkAsRead = (notification) => {
    if (notification && !notification.read) {
      setNotificationToMarkRead(notification);
      setConfirmReadText('');
      setIsConfirmReadOpen(true);
    }
  };

  // Confirm mark-as-read after user types the phrase
  const confirmMarkAsRead = async () => {
    if (!notificationToMarkRead || confirmReadText.toLowerCase().trim() !== 'read') return;

    try {
      const response = await backendGqlApi.post('/graphql', {
        query: markAsRead,
        variables: { id: notificationToMarkRead.id }
      });

      if (response.data.errors) {
        toast.error('Error marking notification as read: ' + response.data.errors[0].message);
        return;
      }

      // Update the notification in local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationToMarkRead.id
            ? { ...notification, read: true }
            : notification
        )
      );

      toast.success('Notification marked as read and removed from unread list');
      setIsConfirmReadOpen(false);
      setNotificationToMarkRead(null);
      setConfirmReadText('');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Open confirmation modal for marking all as read
  const handleMarkAllAsRead = () => {
    if (markingAllAsRead || unreadCount === 0) return;
    setConfirmAllText('');
    setIsConfirmAllOpen(true);
  };

  // Confirm mark-all-as-read after user types the phrase
  const confirmMarkAllAsRead = async () => {
    if (confirmAllText.toLowerCase().trim() !== 'read all') return;

    try {
      setMarkingAllAsRead(true);
      const response = await backendGqlApi.post('/graphql', {
        query: markAllAsRead
      });

      if (response.data.errors) {
        toast.error('Error marking all notifications as read: ' + response.data.errors[0].message);
        return;
      }

      if (response.data.data.markAllAsRead) {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        toast.success('All notifications marked as read');
        setIsConfirmAllOpen(false);
        setConfirmAllText('');
      } else {
        toast.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // Open confirmation modal for deleting read notifications
  const handleDeleteReadNotifications = () => {
    const readCount = notifications.filter(n => n.read).length;
    if (isDeletingRead || readCount === 0) return;
    setConfirmDeleteText('');
    setIsConfirmDeleteOpen(true);
  };

  // Confirm delete read notifications after user types the phrase
  const confirmDeleteReadNotifications = async () => {
    if (confirmDeleteText.toLowerCase().trim() !== 'delete read') return;

    try {
      setIsDeletingRead(true);
      const response = await backendGqlApi.post('/graphql', {
        query: deleteReadNotifications
      });

      if (response.data.errors) {
        toast.error('Error deleting read notifications: ' + response.data.errors[0].message);
        return;
      }

      if (response.data.data.deleteReadNotifications) {
        setNotifications(prev => prev.filter(notification => !notification.read));
        toast.success('All read notifications have been deleted');
        setIsConfirmDeleteOpen(false);
        setConfirmDeleteText('');
      } else {
        toast.error('Failed to delete read notifications');
      }
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast.error('Failed to delete read notifications');
    } finally {
      setIsDeletingRead(false);
    }
  };

  const getTypeColor = (type) => {
    // Handle actual backend notification types
    if (type?.includes('alert') || type?.includes('warning')) {
      return 'bg-amber-400/5 border-amber-400/10';
    }
    if (type?.includes('success') || type?.includes('complete')) {
      return 'bg-green-400/5 border-green-400/10';
    }
    if (type?.includes('error') || type?.includes('fail')) {
      return 'bg-red-400/5 border-red-400/10';
    }
    // Default for info and other types
    return 'bg-blue-400/5 border-blue-400/10';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-afacad space-y-6">
        <div className="w-16 h-16 border-4 border-chocolate-100 border-t-chocolate-600 rounded-full animate-spin"></div>
        <p className="text-xl font-bold text-black">Accessing Notification Protocol...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-afacad">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-lg border border-chocolate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-chocolate-50/30 opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-chocolate-50 rounded-lg border border-chocolate-200 shadow-sm transition-all duration-500">
            <MdNotifications className="text-5xl text-black" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-black leading-none mb-3 tracking-tight">Notifications</h2>
            <p className="text-black font-medium text-lg italic">Stay Updated With System Alerts and Operational Events</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="px-6 py-2.5 bg-chocolate-50 border border-chocolate-100 shadow-sm rounded-full">
            <span className="text-xs font-bold text-black tracking-widest">{unreadCount} Unread Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAllAsRead || unreadCount === 0}
              className={`group/btn flex items-center gap-2 px-6 py-4 rounded-lg font-bold transition-all ${markingAllAsRead || unreadCount === 0
                ? 'bg-chocolate-50 text-chocolate-300 cursor-not-allowed border border-chocolate-100'
                : 'bg-chocolate-600 text-white hover:bg-chocolate-700 active:scale-95 shadow-md'
                }`}
            >
              {markingAllAsRead ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <MdMarkEmailRead className="text-xl" />
                  <span>Mark All Read</span>
                </>
              )}
            </button>
            <button
              onClick={handleDeleteReadNotifications}
              disabled={isDeletingRead || notifications.filter(n => n.read).length === 0}
              className={`flex items-center gap-2 px-6 py-4 rounded-lg font-bold transition-all ${isDeletingRead || notifications.filter(n => n.read).length === 0
                ? 'bg-chocolate-50 text-chocolate-300 cursor-not-allowed border border-chocolate-100'
                : 'bg-white text-black border border-chocolate-600 hover:bg-chocolate-50 shadow-sm'
                }`}
            >
              {isDeletingRead ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <MdDelete className="text-xl" />
                  <span>Clear Read</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MdNotifications />}
          label="Total Alerts"
          value={notifications.length}
          color="chocolate-600"
        />
        <StatCard
          icon={<MdNotificationsActive />}
          label="Unread Items"
          value={unreadCount}
          color="chocolate-600"
        />
        <StatCard
          icon={<MdNotificationsOff />}
          label="Archived/Read"
          value={notifications.length - unreadCount}
          color="chocolate-600"
        />
        <StatCard
          icon={<MdCalendarToday />}
          label="Active Today"
          value={notifications.filter(n => n.time.includes('minutes') || n.time.includes('hour')).length}
          color="chocolate-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-lg border border-chocolate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-chocolate-50 rounded-full blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none opacity-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Type Filter */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] px-2">
              Filter By Alert Category
            </label>
            <div className="relative group/select">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full bg-white border border-chocolate-100 text-black rounded-lg px-6 py-4 font-bold appearance-none cursor-pointer hover:border-chocolate-300 transition-all focus:outline-none focus:ring-4 focus:ring-chocolate-50 shadow-sm"
              >
                <option value="all" className="bg-white text-black font-afacad">All Categories ({notifications.length})</option>
                <option value="SUCCESS" className="bg-white text-black font-afacad">Success ({notifications.filter(n => n.filterType?.toUpperCase() === 'SUCCESS').length})</option>
                <option value="WARNING" className="bg-white text-black font-afacad">Warning ({notifications.filter(n => n.filterType?.toUpperCase() === 'WARNING').length})</option>
                <option value="INFO" className="bg-white text-black font-afacad">Information ({notifications.filter(n => n.filterType?.toUpperCase() === 'INFO').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-black transition-colors">
                <MdInfo />
              </div>
            </div>
          </div>

          {/* Impact Filter */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] px-2">
              Filter By Priority Level
            </label>
            <div className="relative group/select">
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value)}
                className="w-full bg-white border border-chocolate-100 text-black rounded-lg px-6 py-4 font-bold appearance-none cursor-pointer hover:border-chocolate-300 transition-all focus:outline-none focus:ring-4 focus:ring-chocolate-50 shadow-sm"
              >
                <option value="all" className="bg-white text-black font-afacad">All Priority Levels</option>
                <option value="Low" className="bg-white text-black font-afacad">Low Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'low').length})</option>
                <option value="Medium" className="bg-white text-black font-afacad">Medium Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'medium').length})</option>
                <option value="High" className="bg-white text-black font-afacad">Critical Severity ({notifications.filter(n => n.impact?.toLowerCase() === 'high').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-black transition-colors">
                <MdWarning />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`group p-8 rounded-lg border transition-all duration-300 hover:shadow-lg relative overflow-hidden ${notification.read ? 'bg-white' : 'bg-chocolate-50/50 border-chocolate-200 shadow-sm'
              }`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="flex-shrink-0 mt-1 bg-white p-5 rounded-lg border border-chocolate-100 shadow-sm transition-colors group-hover:bg-chocolate-50">
                <div className="text-3xl text-black">
                  {notification.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-black tracking-tight">{notification.title}</h3>
                    <span className={`px-4 py-1 text-[10px] font-bold rounded-full border shadow-sm ${notification.impact?.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                      notification.impact?.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                      {notification.impact} Severity
                    </span>
                    {!notification.read && (
                      <span className="flex items-center gap-2 px-4 py-1 text-[10px] font-bold bg-chocolate-600 text-white rounded-full animate-pulse shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        New Alert
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500 bg-chocolate-50 px-4 py-2 rounded-full border border-chocolate-100 shadow-sm">
                    <MdCalendarToday className="text-lg" />
                    <span>{notification.time}</span>
                  </div>
                </div>
                <p className="text-black text-lg leading-relaxed mb-8 max-w-4xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{notification.message}</p>

                <div className="flex items-center justify-between pt-6 border-t border-chocolate-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedNotification(notification);
                        setIsViewModalOpen(true);
                        navigate(`/notifications/${notification.id}`);
                      }}
                      className="group/btn flex items-center gap-2 px-6 py-3 bg-white hover:bg-chocolate-50 text-black rounded-lg text-xs font-bold transition-all border border-chocolate-200 shadow-sm"
                    >
                      <span>View Full Details Protocol</span>
                    </button>
                    {!notification.read && (
                      <button
                        onClick={() => {
                          setNotificationToMarkRead(notification);
                          setIsConfirmReadOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-chocolate-600 text-white hover:bg-chocolate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
                        title="Acknowledge Alert"
                      >
                        <MdMarkEmailRead className="text-lg" />
                        <span>Acknowledge Parameters</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-chocolate-100 shadow-md">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-chocolate-50 rounded-full blur-2xl top-2" />
            <MdNotificationsOff className="text-chocolate-200 text-7xl relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-black italic mb-2 tracking-tight">Network Silence</h3>
          <p className="text-black italic text-lg max-w-md mx-auto">All operational parameters fall within acceptable bounds. No alerts registered.</p>
        </div>
      )}

      {/* View Notification Modal */}
      <ViewNotificationModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNotification(null);
          navigate('/dashboard');
        }}
        notification={selectedNotification}
        onMarkAsRead={() => selectedNotification && handleMarkAsRead(selectedNotification)}
      />

      {/* Confirm Mark as Read Modal */}
      {isConfirmReadOpen && (
        <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-afacad">
            <div className="flex items-center justify-between p-8 border-b border-chocolate-50">
              <h2 className="text-3xl font-bold text-black tracking-tight">Acknowledge Alert?</h2>
              <button
                onClick={() => {
                  setIsConfirmReadOpen(false);
                  setNotificationToMarkRead(null);
                  setConfirmReadText('');
                }}
                className="text-gray-400 hover:text-black transition-colors p-3 hover:bg-chocolate-50 rounded-lg"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-black text-lg leading-relaxed">
                You are about to mark this alert as <span className="text-black font-bold underline">Acknowledged</span>.
                It will be archived and automatically removed soon.
              </p>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] px-2">
                  Type <span className="text-black font-sans">READ</span> to verify
                </p>
                <input
                  type="text"
                  value={confirmReadText}
                  onChange={(e) => setConfirmReadText(e.target.value)}
                  className="w-full bg-chocolate-50 border border-chocolate-100 text-black rounded-lg px-6 py-4 font-bold focus:outline-none focus:ring-4 focus:ring-chocolate-50 shadow-sm placeholder:text-chocolate-200"
                  placeholder="Type read..."
                  autoFocus
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 border-t border-chocolate-50">
              <button
                onClick={() => {
                  setIsConfirmReadOpen(false);
                  setNotificationToMarkRead(null);
                  setConfirmReadText('');
                }}
                className="w-full sm:w-auto px-8 py-4 text-black font-bold hover:bg-chocolate-50 rounded-lg transition-all border border-chocolate-100"
              >
                Abort
              </button>
              <button
                onClick={confirmMarkAsRead}
                disabled={confirmReadText.toLowerCase().trim() !== 'read'}
                className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition-all text-lg ${confirmReadText.toLowerCase().trim() === 'read'
                  ? 'bg-chocolate-600 text-white shadow-lg shadow-chocolate-200 hover:bg-chocolate-700 active:scale-95'
                  : 'bg-chocolate-50 text-chocolate-200 cursor-not-allowed border border-chocolate-100'
                  }`}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Mark All as Read Modal */}
      {isConfirmAllOpen && (
        <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-afacad">
            <div className="flex items-center justify-between p-8 border-b border-chocolate-50">
              <h2 className="text-3xl font-bold text-black tracking-tight">Archive All Alerts?</h2>
              <button
                onClick={() => {
                  setIsConfirmAllOpen(false);
                  setConfirmAllText('');
                }}
                className="text-gray-400 hover:text-black transition-colors p-3 hover:bg-chocolate-50 rounded-lg"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-black text-lg leading-relaxed">
                You are about to mark <span className="text-black font-bold uppercase">All Notifications</span> as Read.
                This is a bulk action and cannot be undone directly.
              </p>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] px-2">
                  Type <span className="text-black font-sans">READ ALL</span> to confirm
                </p>
                <input
                  type="text"
                  value={confirmAllText}
                  onChange={(e) => setConfirmAllText(e.target.value)}
                  className="w-full bg-chocolate-50 border border-chocolate-100 text-black rounded-lg px-6 py-4 font-bold focus:outline-none focus:ring-4 focus:ring-chocolate-50 shadow-sm placeholder:text-chocolate-200"
                  placeholder="Type read all..."
                  autoFocus
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 border-t border-chocolate-50">
              <button
                onClick={() => {
                  setIsConfirmAllOpen(false);
                  setConfirmAllText('');
                }}
                className="w-full sm:w-auto px-8 py-4 text-black font-bold hover:bg-chocolate-50 rounded-lg transition-all border border-chocolate-100"
              >
                Abort
              </button>
              <button
                onClick={confirmMarkAllAsRead}
                disabled={confirmAllText.toLowerCase().trim() !== 'read all'}
                className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition-all text-lg ${confirmAllText.toLowerCase().trim() === 'read all'
                  ? 'bg-chocolate-600 text-white shadow-lg shadow-chocolate-200 hover:bg-chocolate-700 active:scale-95'
                  : 'bg-chocolate-50 text-chocolate-200 cursor-not-allowed border border-chocolate-100'
                  }`}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Read Notifications Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-afacad">
            <div className="flex items-center justify-between p-8 border-b border-chocolate-50">
              <h2 className="text-3xl font-bold text-black tracking-tight">Permanently Delete?</h2>
              <button
                onClick={() => {
                  setIsConfirmDeleteOpen(false);
                  setConfirmDeleteText('');
                }}
                className="text-gray-400 hover:text-black transition-colors p-3 hover:bg-chocolate-50 rounded-lg"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-black text-lg leading-relaxed">
                You are about to <span className="text-red-600 font-bold underline">Permanently Delete</span> all read alerts.
                This action is destructive and cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                <p className="text-xs font-bold text-red-700 italic">
                  Warning: {notifications.filter(n => n.read).length} Archived items will be lost forever.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] px-2">
                  Type <span className="text-black font-sans">DELETE READ</span> to confirm
                </p>
                <input
                  type="text"
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  className="w-full bg-chocolate-50 border border-chocolate-100 text-black rounded-lg px-6 py-4 font-bold focus:outline-none focus:ring-4 focus:ring-chocolate-50 shadow-sm placeholder:text-chocolate-200"
                  placeholder="Type delete read..."
                  autoFocus
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 border-t border-chocolate-50">
              <button
                onClick={() => {
                  setIsConfirmDeleteOpen(false);
                  setConfirmDeleteText('');
                }}
                className="w-full sm:w-auto px-8 py-4 text-black font-bold hover:bg-chocolate-50 rounded-lg transition-all border border-chocolate-100"
              >
                Abort
              </button>
              <button
                onClick={confirmDeleteReadNotifications}
                disabled={confirmDeleteText.toLowerCase().trim() !== 'delete read'}
                className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition-all text-lg ${confirmDeleteText.toLowerCase().trim() === 'delete read'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95'
                  : 'bg-chocolate-50 text-chocolate-200 cursor-not-allowed border border-chocolate-100'
                  }`}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, color }) => (
  <div className="group bg-white p-8 rounded-lg border border-chocolate-100 transition-all duration-500 hover:border-chocolate-300 shadow-md relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-chocolate-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-chocolate-100 transition-colors duration-500" />
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 leading-none uppercase">{label}</p>
        <p className="text-3xl font-bold text-black tracking-tighter">{value}</p>
      </div>
      <div className={`bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 text-2xl text-black shadow-sm transition-transform group-hover:scale-110 duration-500`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Notification;
