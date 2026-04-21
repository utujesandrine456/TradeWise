import React from 'react';
import Loader from './Loader';
// import React, { useEffect, useState } from 'react';
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
        return <MdCheckCircle className="text-emerald-500" />;
      case 'warning':
        return <MdWarning className="text-amber-500" />;
      case 'info':
        return <MdInfo className="text-blue-500" />;
      case 'error':
        return <MdError className="text-red-500" />;
      default:
        return <MdInfo className="text-blue-500" />;
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
      return 'bg-amber-50 border-amber-100';
    }
    if (type?.includes('success') || type?.includes('complete')) {
      return 'bg-emerald-50 border-emerald-100';
    }
    if (type?.includes('error') || type?.includes('fail')) {
      return 'bg-red-50 border-red-100';
    }
    // Default for info and other types
    return 'bg-gray-50 border-gray-100';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white border border-gray-100 p-10 rounded-md shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-3 bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <MdNotifications className="text-3xl text-[#09111E]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#09111E] leading-none mb-3">Intelligence Feed</h1>
            <p className="text-[#09111E]/60 text-lg font-medium opacity-60">System-wide operational alerts and critical status updates</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="px-6 py-3 bg-gray-50 border border-gray-100 shadow-inner rounded-md">
            <span className="text-xs font-semibold text-[#09111E] opacity-60">{unreadCount} Unread Transmissions</span>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead || unreadCount === 0}
            className={`group/btn flex items-center gap-3 px-6 py-3 rounded-md font-semibold text-sm transition-all active:scale-95 ${markingAllAsRead || unreadCount === 0
              ? 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed opacity-40'
              : 'bg-[#09111E] text-white hover:scale-105 shadow-lg relative overflow-hidden'
              }`}
          >
            {!(markingAllAsRead || unreadCount === 0) && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />}
            <div className="relative z-10 flex items-center gap-3">
              {markingAllAsRead ? <div className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" /> : <MdMarkEmailRead className="text-xl" />}
              <span>{markingAllAsRead ? 'Processing...' : 'Archive All'}</span>
            </div>
          </button>
          <button
            onClick={handleDeleteReadNotifications}
            disabled={isDeletingRead || notifications.filter(n => n.read).length === 0}
            className={`flex items-center gap-3 px-6 py-3 rounded-md font-semibold text-sm transition-all active:scale-95 border ${isDeletingRead || notifications.filter(n => n.read).length === 0
              ? 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed opacity-40 border-gray-100'
              : 'bg-white text-[#09111E] hover:bg-gray-50 border-gray-100 shadow-sm'
              }`}
          >
            {isDeletingRead ? <div className="animate-spin h-4 w-4 border-2 border-[#09111E]/20 border-t-[#09111E] rounded-full" /> : <MdDelete className="text-xl" />}
            <span>{isDeletingRead ? 'Purging...' : 'Clear Read'}</span>
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon={<MdDescription />}
          label="Total Index"
          value={notifications.length}
          unit="Logs"
          detail="Cumulative Insight Feed"
          color="accent"
        />
        <StatCard
          icon={<MdNotificationsActive />}
          label="Pending Review"
          value={unreadCount}
          unit="Alerts"
          detail="Requires Immediate Action"
          color="accent"
        />
        <StatCard
          icon={<MdNotificationsOff />}
          label="Archived Records"
          value={notifications.length - unreadCount}
          unit="Items"
          detail="Historical Data Logged"
          color="green"
        />
        <StatCard
          icon={<MdPriorityHigh />}
          label="Priority Alerts"
          value={notifications.filter(n => n.impact === 'High').length}
          unit="High"
          detail="Immediate Attention Required"
          color="blue"
        />
      </div>

      {/* Filters Console */}
      <div className="bg-white border border-gray-100 p-10 rounded-md shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-[#09111E]/60 px-2 italic opacity-60">Filter By Alert Category</label>
            <div className="relative group/select">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-[#09111E] rounded-md px-6 py-4 font-semibold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-gray-200 shadow-inner"
              >
                <option value="all" className="bg-white text-[#09111E]">All Categories ({notifications.length})</option>
                <option value="SUCCESS" className="bg-white text-[#09111E]">Success ({notifications.filter(n => n.filterType?.toUpperCase() === 'SUCCESS').length})</option>
                <option value="WARNING" className="bg-white text-[#09111E]">Warning ({notifications.filter(n => n.filterType?.toUpperCase() === 'WARNING').length})</option>
                <option value="INFO" className="bg-white text-[#09111E]">Information ({notifications.filter(n => n.filterType?.toUpperCase() === 'INFO').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#09111E]/60">
                <MdInfo />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-[#09111E]/60 px-2 italic opacity-60">Filter By Priority Level</label>
            <div className="relative group/select">
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-[#09111E] rounded-md px-6 py-4 font-semibold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-gray-200 shadow-inner"
              >
                <option value="all" className="bg-white text-[#09111E]">All Priority Levels</option>
                <option value="Low" className="bg-white text-[#09111E]">Low Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'low').length})</option>
                <option value="Medium" className="bg-white text-[#09111E]">Medium Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'medium').length})</option>
                <option value="High" className="bg-white text-[#09111E]">Critical Severity ({notifications.filter(n => n.impact?.toLowerCase() === 'high').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#09111E]/60">
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
            className={`group bg-white border rounded-md transition-all duration-300 hover:shadow-sm relative overflow-hidden ${notification.read ? 'border-gray-100' : 'border-gray-200 shadow-white/5'
              }`}
          >
            {!notification.read && <div className="absolute left-0 top-0 w-1 h-full bg-[#09111E] rounded-md" />}
            <div className="p-10 flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="flex-shrink-0 mt-1 bg-gray-50 p-5 rounded-md border border-gray-100 shadow-inner text-3xl group-hover:scale-110 transition-transform duration-300">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-2xl font-bold text-[#09111E]">{notification.title}</h3>
                    <span className={`px-4 py-2 text-[10px] font-bold rounded-md border ${notification.impact?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                      notification.impact?.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {notification.impact} Severity
                    </span>
                    {!notification.read && (
                      <span className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold bg-gray-100 text-[#09111E] rounded-md border border-gray-200 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-[#09111E] rounded-full" />
                        New Alert
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#09111E]/60 bg-gray-50 px-5 py-3 rounded-md border border-gray-100 shadow-inner italic">
                    <MdCalendarToday className="text-lg" />
                    <span>{notification.time}</span>
                  </div>
                </div>
                <p className="text-[#09111E]/60 text-lg leading-relaxed mb-8 max-w-4xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500 font-medium opacity-60">{notification.message}</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedNotification(notification);
                      setIsViewModalOpen(true);
                      navigate(`/notifications/${notification.id}`);
                    }}
                    className="group/view flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-[#09111E]/60 hover:text-[#09111E] rounded-md text-xs font-semibold transition-all border border-gray-100 shadow-inner"
                  >
                    <span>View Full Transmission</span>
                  </button>
                  {!notification.read && (
                    <button
                      onClick={() => {
                        setNotificationToMarkRead(notification);
                        setIsConfirmReadOpen(true);
                      }}
                      className="group/ack flex items-center gap-3 px-6 py-3 bg-[#09111E] text-white hover:scale-105 rounded-md text-xs font-bold transition-all shadow-lg relative overflow-hidden active:scale-95"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/ack:translate-y-0 transition-transform duration-300" />
                      <MdMarkEmailRead className="text-lg relative z-10" />
                      <span className="relative z-10">Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 text-center font-Urbanist max-w-2xl mx-auto">
          <div className="relative mb-12 group">
            <div className="absolute inset-0 bg-gray-100 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative p-10 bg-white rounded-full border border-gray-200 shadow-sm">
              <MdNotificationsOff className="text-7xl text-[#09111E]/20 group-hover:text-[#09111E] transition-colors duration-500" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-[#09111E] mb-4">Network Silence</h3>
          <p className="text-[#09111E]/60 italic font-medium opacity-60 leading-relaxed text-sm text-center">
            All operational parameters fall within acceptable bounds. No active dispatches registered within the current sector.
          </p>
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
        <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-[#09111E]">Acknowledge Alert?</h2>
              <button onClick={() => { setIsConfirmReadOpen(false); setNotificationToMarkRead(null); setConfirmReadText(''); }} className="text-[#09111E]/60 hover:text-[#09111E] transition-colors p-3 hover:bg-gray-50 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-[#09111E]/60 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to mark this alert as <span className="text-[#09111E] not-italic">Acknowledged</span>. It will be archived and automatically removed soon.
              </p>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#09111E]/60 px-2 italic opacity-60">
                  Type <span className="text-[#09111E] not-italic">READ</span> to verify
                </p>
                <input type="text" value={confirmReadText} onChange={(e) => setConfirmReadText(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-[#09111E] rounded-md px-6 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-gray-200 shadow-inner placeholder:text-[#09111E]/20" placeholder="Type read..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-gray-100">
              <button onClick={() => { setIsConfirmReadOpen(false); setNotificationToMarkRead(null); setConfirmReadText(''); }} className="w-full sm:w-auto px-10 py-5 text-[#09111E]/60 font-bold hover:bg-gray-50 rounded-md transition-all border border-gray-100 text-[10px]">Abort</button>
              <button onClick={confirmMarkAsRead} disabled={confirmReadText.toLowerCase().trim() !== 'read'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-bold transition-all active:scale-95 text-[10px] ${confirmReadText.toLowerCase().trim() === 'read' ? 'bg-[#09111E] text-white shadow-lg' : 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Mark All as Read Modal */}
      {isConfirmAllOpen && (
        <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-[#09111E]">Archive All Alerts?</h2>
              <button onClick={() => { setIsConfirmAllOpen(false); setConfirmAllText(''); }} className="text-[#09111E]/60 hover:text-[#09111E] transition-colors p-3 hover:bg-gray-50 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-[#09111E]/60 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to mark <span className="text-[#09111E] not-italic font-bold">All Notifications</span> as read. This is a bulk action and cannot be undone directly.
              </p>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#09111E]/60 px-2 italic opacity-60">
                  Type <span className="text-[#09111E] not-italic">READ ALL</span> to confirm
                </p>
                <input type="text" value={confirmAllText} onChange={(e) => setConfirmAllText(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-[#09111E] rounded-md px-6 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-gray-200 shadow-inner placeholder:text-[#09111E]/20" placeholder="Type read all..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-gray-100">
              <button onClick={() => { setIsConfirmAllOpen(false); setConfirmAllText(''); }} className="w-full sm:w-auto px-10 py-5 text-[#09111E]/60 font-bold hover:bg-gray-50 rounded-md transition-all border border-gray-100 text-[10px]">Abort</button>
              <button onClick={confirmMarkAllAsRead} disabled={confirmAllText.toLowerCase().trim() !== 'read all'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-bold transition-all active:scale-95 text-[10px] ${confirmAllText.toLowerCase().trim() === 'read all' ? 'bg-[#09111E] text-white shadow-lg' : 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Read Notifications Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-[#09111E]">Permanently Delete?</h2>
              <button onClick={() => { setIsConfirmDeleteOpen(false); setConfirmDeleteText(''); }} className="text-[#09111E]/60 hover:text-[#09111E] transition-colors p-3 hover:bg-gray-50 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-[#09111E]/60 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to <span className="text-[#09111E] font-bold not-italic">Permanently Delete</span> all read alerts. This action is destructive and cannot be undone.
              </p>
              <div className="bg-gray-50 border border-red-100 rounded-md p-6">
                <p className="text-xs font-bold text-red-600 italic">
                  Warning: {notifications.filter(n => n.read).length} Archived items will be lost forever.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#09111E]/60 px-2 italic opacity-60">
                  Type <span className="text-[#09111E]/80 not-italic">DELETE READ</span> to confirm
                </p>
                <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-[#09111E] rounded-md px-6 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/30 shadow-inner placeholder:text-[#09111E]/20" placeholder="Type delete read..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-gray-100">
              <button onClick={() => { setIsConfirmDeleteOpen(false); setConfirmDeleteText(''); }} className="w-full sm:w-auto px-10 py-5 text-[#09111E]/60 font-bold hover:bg-gray-50 rounded-md transition-all border border-gray-100 text-[10px]">Abort</button>
              <button onClick={confirmDeleteReadNotifications} disabled={confirmDeleteText.toLowerCase().trim() !== 'delete read'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-bold transition-all active:scale-95 text-[10px] ${confirmDeleteText.toLowerCase().trim() === 'delete read' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, unit, detail, color }) => {
  return (
    <div className="bg-[#09111E] border border-white/5 rounded-md p-6 shadow-2xl hover:shadow-brand-500/10 transition-all cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000 blur-2xl opacity-60" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <p className="text-md font-semibold text-white/40 mb-6">{label}</p>
          <h4 className="text-4xl font-bold text-white leading-none mb-6">
            {value?.toLocaleString() || '0'} <span className="text-lg text-white/20 font-bold italic ml-1">{unit}</span>
          </h4>
          <p className="text-sm text-white/20 font-medium">{detail}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
