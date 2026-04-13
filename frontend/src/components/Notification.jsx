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
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist space-y-6">
        <div className="w-16 h-16 border-4 border-accent-400/20 border-t-accent-400 rounded-md animate-spin"></div>
        <p className="text-xl font-black text-brand-300 uppercase tracking-widest italic">Syncing Alert Manifests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-white/5 rounded-md border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-500">
            <MdNotifications className="text-5xl text-accent-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white leading-none mb-3 uppercase tracking-tighter">Alert Manifests</h1>
            <p className="text-brand-300 text-lg font-bold italic opacity-60">Real-Time System Alerts And Operational Event Dispatches</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="px-6 py-3 bg-white/5 border border-white/5 shadow-inner rounded-md">
            <span className="text-[10px] font-black text-accent-400 tracking-[0.2em] uppercase italic">{unreadCount} Unread Transmissions</span>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead || unreadCount === 0}
            className={`group/btn flex items-center gap-3 px-8 py-5 rounded-md font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${markingAllAsRead || unreadCount === 0
              ? 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'
              : 'bg-accent-400 text-brand-950 hover:scale-105 shadow-xl shadow-accent-400/20 relative overflow-hidden'
              }`}
          >
            {!(markingAllAsRead || unreadCount === 0) && <div className="absolute inset-0 bg-white/15 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />}
            <div className="relative z-10 flex items-center gap-3">
              {markingAllAsRead ? <div className="animate-spin h-4 w-4 border-2 border-brand-950/40 border-t-brand-950 rounded-full" /> : <MdMarkEmailRead className="text-xl" />}
              <span>{markingAllAsRead ? 'Processing...' : 'Archive All'}</span>
            </div>
          </button>
          <button
            onClick={handleDeleteReadNotifications}
            disabled={isDeletingRead || notifications.filter(n => n.read).length === 0}
            className={`flex items-center gap-3 px-8 py-5 rounded-md font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 border ${isDeletingRead || notifications.filter(n => n.read).length === 0
              ? 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40 border-white/5'
              : 'bg-white/5 text-white hover:bg-white/10 border-white/10 shadow-xl'
              }`}
          >
            {isDeletingRead ? <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" /> : <MdDelete className="text-xl" />}
            <span>{isDeletingRead ? 'Purging...' : 'Clear Read'}</span>
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<MdNotifications />} label="Total Transmissions" value={notifications.length} />
        <StatCard icon={<MdNotificationsActive />} label="Pending Review" value={unreadCount} color="accent" />
        <StatCard icon={<MdNotificationsOff />} label="Archived Records" value={notifications.length - unreadCount} color="green" />
        <StatCard icon={<MdCalendarToday />} label="Active Today" value={notifications.filter(n => n.time.includes('minutes') || n.time.includes('hour')).length} color="blue" />
      </div>

      {/* Filters Console */}
      <div className="bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-400/5 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] px-2 italic opacity-60">Filter By Alert Category</label>
            <div className="relative group/select">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 text-white rounded-md px-6 py-5 font-black text-lg appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 shadow-inner"
              >
                <option value="all" className="bg-[#09111E] text-white">All Categories ({notifications.length})</option>
                <option value="SUCCESS" className="bg-[#09111E] text-white">Success ({notifications.filter(n => n.filterType?.toUpperCase() === 'SUCCESS').length})</option>
                <option value="WARNING" className="bg-[#09111E] text-white">Warning ({notifications.filter(n => n.filterType?.toUpperCase() === 'WARNING').length})</option>
                <option value="INFO" className="bg-[#09111E] text-white">Information ({notifications.filter(n => n.filterType?.toUpperCase() === 'INFO').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-300">
                <MdInfo />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] px-2 italic opacity-60">Filter By Priority Level</label>
            <div className="relative group/select">
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value)}
                className="w-full bg-white/5 border border-white/5 text-white rounded-md px-6 py-5 font-black text-lg appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 shadow-inner"
              >
                <option value="all" className="bg-[#09111E] text-white">All Priority Levels</option>
                <option value="Low" className="bg-[#09111E] text-white">Low Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'low').length})</option>
                <option value="Medium" className="bg-[#09111E] text-white">Medium Priority ({notifications.filter(n => n.impact?.toLowerCase() === 'medium').length})</option>
                <option value="High" className="bg-[#09111E] text-white">Critical Severity ({notifications.filter(n => n.impact?.toLowerCase() === 'high').length})</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-300">
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
            className={`group bg-[#09111E] border rounded-md transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${notification.read ? 'border-white/5' : 'border-accent-400/20 shadow-accent-400/5'
              }`}
          >
            {!notification.read && <div className="absolute left-0 top-0 w-1 h-full bg-accent-400 rounded-md" />}
            <div className="p-10 flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="flex-shrink-0 mt-1 bg-white/5 p-5 rounded-md border border-white/5 shadow-inner text-3xl group-hover:scale-110 transition-transform duration-300">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">{notification.title}</h3>
                    <span className={`px-4 py-2 text-[10px] font-black rounded-md border uppercase tracking-widest italic ${notification.impact?.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      notification.impact?.toLowerCase() === 'medium' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                        'bg-blue-400/10 text-blue-400 border-blue-400/20'
                      }`}>
                      {notification.impact} Severity
                    </span>
                    {!notification.read && (
                      <span className="flex items-center gap-2 px-4 py-2 text-[10px] font-black bg-accent-400/10 text-accent-400 rounded-md border border-accent-400/20 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                        New Alert
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-brand-300 bg-white/5 px-5 py-3 rounded-md border border-white/5 shadow-inner uppercase tracking-widest italic">
                    <MdCalendarToday className="text-lg" />
                    <span>{notification.time}</span>
                  </div>
                </div>
                <p className="text-brand-300 text-lg leading-relaxed mb-8 max-w-4xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500 italic font-bold opacity-60">{notification.message}</p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedNotification(notification);
                      setIsViewModalOpen(true);
                      navigate(`/notifications/${notification.id}`);
                    }}
                    className="group/view flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-brand-300 hover:text-white rounded-md text-[10px] font-black transition-all border border-white/5 uppercase tracking-widest shadow-inner"
                  >
                    <span>View Full Transmission</span>
                  </button>
                  {!notification.read && (
                    <button
                      onClick={() => {
                        setNotificationToMarkRead(notification);
                        setIsConfirmReadOpen(true);
                      }}
                      className="group/ack flex items-center gap-3 px-8 py-4 bg-accent-400 text-brand-950 hover:scale-105 rounded-md text-[10px] font-black transition-all uppercase tracking-widest shadow-xl shadow-accent-400/20 relative overflow-hidden active:scale-95"
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
        <div className="text-center py-32 bg-[#09111E] border border-white/5 rounded-md shadow-2xl">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-accent-400/20 rounded-md blur-2xl" />
            <div className="relative p-10 bg-[#09111E] rounded-md border border-white/5">
              <MdNotificationsOff className="text-7xl text-brand-300/20" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Network Silence</h3>
          <p className="text-brand-300 italic font-bold opacity-60 max-w-sm mx-auto leading-relaxed">
            All operational parameters fall within acceptable bounds. No alerts registered.
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
        <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-white/5">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Acknowledge Alert?</h2>
              <button onClick={() => { setIsConfirmReadOpen(false); setNotificationToMarkRead(null); setConfirmReadText(''); }} className="text-brand-300 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-brand-300 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to mark this alert as <span className="text-accent-400 not-italic">Acknowledged</span>. It will be archived and automatically removed soon.
              </p>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] px-2 italic opacity-60">
                  Type <span className="text-accent-400 not-italic">READ</span> to verify
                </p>
                <input type="text" value={confirmReadText} onChange={(e) => setConfirmReadText(e.target.value)} className="w-full bg-white/5 border border-white/5 text-white rounded-md px-6 py-5 font-black focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 shadow-inner placeholder:text-brand-300/20" placeholder="Type read..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-white/5">
              <button onClick={() => { setIsConfirmReadOpen(false); setNotificationToMarkRead(null); setConfirmReadText(''); }} className="w-full sm:w-auto px-10 py-5 text-brand-300 font-black hover:bg-white/5 rounded-md transition-all border border-white/5 uppercase text-[10px] tracking-widest">Abort</button>
              <button onClick={confirmMarkAsRead} disabled={confirmReadText.toLowerCase().trim() !== 'read'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-black transition-all active:scale-95 uppercase text-[10px] tracking-widest ${confirmReadText.toLowerCase().trim() === 'read' ? 'bg-accent-400 text-brand-950 shadow-xl shadow-accent-400/20' : 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Mark All as Read Modal */}
      {isConfirmAllOpen && (
        <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-white/5">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Archive All Alerts?</h2>
              <button onClick={() => { setIsConfirmAllOpen(false); setConfirmAllText(''); }} className="text-brand-300 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-brand-300 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to mark <span className="text-white not-italic uppercase font-black">All Notifications</span> as read. This is a bulk action and cannot be undone directly.
              </p>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] px-2 italic opacity-60">
                  Type <span className="text-accent-400 not-italic">READ ALL</span> to confirm
                </p>
                <input type="text" value={confirmAllText} onChange={(e) => setConfirmAllText(e.target.value)} className="w-full bg-white/5 border border-white/5 text-white rounded-md px-6 py-5 font-black focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 shadow-inner placeholder:text-brand-300/20" placeholder="Type read all..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-white/5">
              <button onClick={() => { setIsConfirmAllOpen(false); setConfirmAllText(''); }} className="w-full sm:w-auto px-10 py-5 text-brand-300 font-black hover:bg-white/5 rounded-md transition-all border border-white/5 uppercase text-[10px] tracking-widest">Abort</button>
              <button onClick={confirmMarkAllAsRead} disabled={confirmAllText.toLowerCase().trim() !== 'read all'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-black transition-all active:scale-95 uppercase text-[10px] tracking-widest ${confirmAllText.toLowerCase().trim() === 'read all' ? 'bg-accent-400 text-brand-950 shadow-xl shadow-accent-400/20' : 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Read Notifications Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl w-full max-w-md animate-in zoom-in duration-300 font-Urbanist">
            <div className="flex items-center justify-between p-10 border-b border-white/5">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Permanently Delete?</h2>
              <button onClick={() => { setIsConfirmDeleteOpen(false); setConfirmDeleteText(''); }} className="text-brand-300 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-md">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-brand-300 text-lg leading-relaxed italic font-bold opacity-60">
                You are about to <span className="text-red-500 font-black not-italic uppercase">Permanently Delete</span> all read alerts. This action is destructive and cannot be undone.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-6">
                <p className="text-xs font-black text-red-500 italic uppercase tracking-widest">
                  Warning: {notifications.filter(n => n.read).length} Archived items will be lost forever.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] px-2 italic opacity-60">
                  Type <span className="text-red-500 not-italic">DELETE READ</span> to confirm
                </p>
                <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)} className="w-full bg-white/5 border border-white/5 text-white rounded-md px-6 py-5 font-black focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/30 shadow-inner placeholder:text-brand-300/20" placeholder="Type delete read..." autoFocus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-10 border-t border-white/5">
              <button onClick={() => { setIsConfirmDeleteOpen(false); setConfirmDeleteText(''); }} className="w-full sm:w-auto px-10 py-5 text-brand-300 font-black hover:bg-white/5 rounded-md transition-all border border-white/5 uppercase text-[10px] tracking-widest">Abort</button>
              <button onClick={confirmDeleteReadNotifications} disabled={confirmDeleteText.toLowerCase().trim() !== 'delete read'} className={`w-full sm:w-auto px-10 py-5 rounded-md font-black transition-all active:scale-95 uppercase text-[10px] tracking-widest ${confirmDeleteText.toLowerCase().trim() === 'delete read' ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'}`}>Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    accent: 'text-accent-400 bg-accent-400/10 border-accent-400/20 from-accent-400',
    green: 'text-green-500 bg-green-500/10 border-green-500/20 from-green-500',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 from-blue-400',
  };
  const selected = colorMap[color] || 'text-brand-300 bg-white/5 border-white/10 from-transparent';
  const [textColor, bgStyle, borderStyle, gradStyle] = selected.split(' ');

  return (
    <div className="group bg-[#09111E] p-10 rounded-md border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/10">
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50`} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-brand-300 tracking-[0.2em] mb-4 uppercase italic opacity-60">{label}</p>
          <p className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
        </div>
        <div className={`p-5 rounded-md border ${bgStyle} ${borderStyle} ${textColor} shadow-inner group-hover:scale-110 transition-transform duration-500 text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Notification;
