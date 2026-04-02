import React, { useState } from 'react';
import { MdNotifications, MdNotificationsActive, MdNotificationsOff, MdDelete, MdMarkEmailRead, MdWarning, MdInfo, MdCheckCircle, MdCalendarToday } from 'react-icons/md';


const Notification = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Payment Received',
      message: 'Payment of 2,000,000 Frw received from John Doe for iPhone 15 Pro',
      time: '2 minutes ago',
      read: false,
      icon: <MdCheckCircle className="text-[#BE741E]" />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'iPhone 15 Pro is running low on stock. Only 3 units remaining.',
      time: '15 minutes ago',
      read: false,
      icon: <MdWarning className="text-[#BE741E]" />
    },
    {
      id: 3,
      type: 'info',
      title: 'New Order Received',
      message: 'New order received from Jane Smith for MacBook Air M2',
      time: '1 hour ago',
      read: true,
      icon: <MdInfo className="text-[#BE741E]" />
    },
    {
      id: 4,
      type: 'success',
      title: 'Inventory Updated',
      message: 'Stock levels have been updated successfully for all products',
      time: '2 hours ago',
      read: true,
      icon: <MdCheckCircle className="text-[#BE741E]" />
    },
    {
      id: 5,
      type: 'warning',
      title: 'Payment Pending',
      message: 'Payment for Samsung Galaxy S24 is still pending from Mike Johnson',
      time: '3 hours ago',
      read: false,
      icon: <MdWarning className="text-[#BE741E]" />
    },
    {
      id: 6,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will occur tonight at 2:00 AM',
      time: '5 hours ago',
      read: true,
      icon: <MdInfo className="text-[#BE741E]" />
    }
  ]);

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-600">Stay updated with your business activities</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{unreadCount} unread</span>
          <button 
            onClick={markAllAsRead}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2"
          >
            <MdMarkEmailRead className="text-xl" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdNotifications className="text-[#fff] text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unread</p>
              <p className="text-2xl font-bold text-[#000]">{unreadCount}</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdNotificationsActive className="text-[#fff] text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Read</p>
              <p className="text-2xl font-bold text-[#000]">{notifications.length - unreadCount}</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdNotificationsOff className="text-[#fff] text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today</p>
              <p className="text-2xl font-bold text-black">{notifications.filter(n => n.time.includes('minutes') || n.time.includes('hour')).length}</p>
            </div>
            <div className="bg-[#BE741E] p-3 rounded-lg">
              <MdCalendarToday className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              selectedFilter === 'all' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter('success')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              selectedFilter === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Success ({notifications.filter(n => n.type === 'success').length})
          </button>
          <button
            onClick={() => setSelectedFilter('warning')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              selectedFilter === 'warning' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Warning ({notifications.filter(n => n.type === 'warning').length})
          </button>
          <button
            onClick={() => setSelectedFilter('info')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              selectedFilter === 'info' 
                ? 'bg-blue-400 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Info ({notifications.filter(n => n.type === 'info').length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-6 rounded-xl border transition duration-200 hover:shadow-md ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            } ${getTypeColor(notification.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{notification.message}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button className="text-[#BE741E] hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 text-sm">
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <MdNotificationsOff className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up! No new notifications at the moment.</p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BE741E]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BE741E]"></div>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Low Stock Alerts</p>
                <p className="text-sm text-gray-600">Get notified when stock is low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BE741E]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Payment Notifications</p>
                <p className="text-sm text-gray-600">Get notified about payments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BE741E]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
