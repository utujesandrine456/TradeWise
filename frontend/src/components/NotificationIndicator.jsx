import { Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationIndicator = () => {
  const { isConnected, notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Bell size={24} className={isConnected ? 'text-gray-700' : 'text-gray-400'} />
        
        {/* Connection status dot */}
        <span 
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationIndicator;
