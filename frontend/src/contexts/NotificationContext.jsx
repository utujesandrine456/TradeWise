import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from '../utils/toast';
import { backendGqlApi } from '../utils/axiosInstance';
import { getAllNotifications } from '../utils/gqlQuery';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Fetch initial unread notifications from database
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchInitialNotifications = async () => {
      try {
        setLoading(true);
        const response = await backendGqlApi.post('/graphql', {
          query: getAllNotifications,
          variables: { timeFilters: 'Unread' }
        });

        if (response.data.errors) {
          console.error('Error fetching notifications:', response.data.errors[0].message);
          return;
        }

        const notificationsData = response.data.data.getNotifications || [];
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching initial notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNotifications();
  }, [user]);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get token from localStorage or cookie
    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      console.warn('No token found for WebSocket connection');
      return;
    }

    // Create socket connection
    const socketUrl = import.meta.env.MODE === 'development' 
      ? 'http://localhost:2015/notifications'
      : 'https://tradewise-backend-v2.onrender.com/notifications';
    
    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Listen for notifications
    newSocket.on('notification', (notification) => {
      console.log('📬 New notification received:', notification);
      
      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Trigger refresh for components using GraphQL
      setRefreshTrigger((prev) => prev + 1);

      // Show toast notification
      const message = notification.message || notification.title;
      const title = notification.title || 'New Notification';
      
      if (notification.impact === 'High' || notification.filterType === 'WARNING') {
        toast.warning(`${title}: ${message}`);
      } else if (notification.filterType === 'SUCCESS') {
        toast.success(`${title}: ${message}`);
      } else {
        toast.info(`${title}: ${message}`);
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const value = {
    socket,
    notifications,
    isConnected,
    refreshTrigger, // Components can watch this to refetch data
    loading,
    clearNotifications: () => setNotifications([]),
    markAsRead: (notificationId) => {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    },
    removeNotification: (notificationId) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
