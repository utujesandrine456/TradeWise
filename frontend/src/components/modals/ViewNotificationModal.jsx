import React from 'react';
import { MdClose, MdNotifications, MdCalendarToday, MdInfo, MdWarning, MdCheckCircle, MdError, MdMarkEmailRead } from 'react-icons/md';
import { format } from 'date-fns';

const ViewNotificationModal = ({ isOpen, onClose, notification, onMarkAsRead }) => {
  if (!isOpen || !notification) return null;

  const getNotificationIcon = (type) => {
    const iconClass = "text-3xl";
    switch (type?.toLowerCase()) {
      case 'success':
        return <MdCheckCircle className={`text-green-600 ${iconClass}`} />;
      case 'warning':
        return <MdWarning className={`text-chocolate-600 ${iconClass}`} />;
      case 'info':
        return <MdInfo className={`text-chocolate-600 ${iconClass}`} />;
      case 'error':
        return <MdError className={`text-red-600 ${iconClass}`} />;
      default:
        return <MdInfo className={`text-chocolate-600 ${iconClass}`} />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-700 bg-red-50 border-red-100 shadow-sm';
      case 'Medium': return 'text-chocolate-700 bg-chocolate-50 border-chocolate-100 shadow-sm';
      case 'Low': return 'text-chocolate-400 bg-chocolate-50/50 border-chocolate-50 shadow-sm';
      default: return 'text-chocolate-400 bg-chocolate-50 border-chocolate-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'unknown time';
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp').toLowerCase();
    } catch (error) {
      return 'invalid date';
    }
  };

  return (
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 shadow-sm">
              <MdNotifications className="text-chocolate-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">Notification Details</h2>
              <p className="text-sm text-chocolate-400 font-medium mt-1">Critical System Communication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-8">
            <div className="bg-chocolate-50 p-6 rounded-lg border border-chocolate-100 shadow-sm scale-110">
              {getNotificationIcon(notification.filterType || notification.type)}
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-#FC9E4F text-chocolate-900 leading-tight capitalize">{notification.title}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-6 py-1.5 text-xs font-#FC9E4F rounded-full border uppercase tracking-wider ${getImpactColor(notification.impact)}`}>
                  {notification.impact} Severity
                </span>
                {!notification.read && (
                  <span className="px-6 py-1.5 text-xs font-#FC9E4F rounded-full bg-red-50 text-red-600 border border-red-100 uppercase animate-pulse">
                    Urgent / Unread
                  </span>
                )}
              </div>
            </div>
          </div>

          {notification.read && (
            <div className="bg-chocolate-50/50 border border-chocolate-100 rounded-lg p-8 shadow-sm relative overflow-hidden group">
              <div className="flex items-start gap-6 relative z-10">
                <div className="bg-white p-3 rounded-lg border border-chocolate-100 shadow-sm">
                  <MdWarning className="text-chocolate-600 text-2xl" />
                </div>
                <div>
                  <h4 className="text-base font-#FC9E4F text-chocolate-600 mb-1 transition-colors">Archival Scheduled</h4>
                  <p className="text-sm text-chocolate-500 font-medium leading-relaxed">
                    This message has been acknowledged and is currently queued for automated cleanup to maintain workspace efficiency.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-chocolate-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}

          <div className="bg-chocolate-50 border border-chocolate-100 rounded-lg p-10 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 opacity-40">
                <MdInfo className="text-xl text-chocolate-600" />
                <span className="text-[10px] font-#FC9E4F uppercase tracking-[0.2em]">Transmission Content</span>
              </div>
              <p className="text-chocolate-900 text-xl font-medium leading-relaxed italic">{notification.message}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-chocolate-100/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-chocolate-100 p-8 rounded-lg shadow-sm hover:bg-chocolate-50 transition-colors">
              <span className="block text-[10px] font-#FC9E4F text-chocolate-400 uppercase mb-3 px-1">Event Category</span>
              <p className="text-chocolate-900 font-#FC9E4F leading-tight capitalize">{notification.type}</p>
            </div>

            <div className="bg-white border border-chocolate-100 p-8 rounded-lg shadow-sm hover:bg-chocolate-50 transition-colors">
              <span className="block text-[10px] font-#FC9E4F text-chocolate-400 uppercase mb-3 px-1">Delivery Timeline</span>
              <div className="flex items-center gap-3 text-chocolate-900 font-#FC9E4F leading-tight">
                <MdCalendarToday className="text-chocolate-600 text-lg" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-[10px] text-chocolate-500 mt-2 font-medium opacity-60 px-1">Relative: {notification.time}</p>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-chocolate-50 bg-chocolate-50/30 flex items-center justify-end gap-8">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              className="group relative px-10 py-5 bg-green-600 text-white rounded-lg font-#FC9E4F transition-all active:scale-95 shadow-lg overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <MdMarkEmailRead className="text-2xl" />
                <span className="text-lg">Acknowledge Receipt</span>
              </div>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-12 py-5 bg-white border border-chocolate-100 text-chocolate-600 rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-50 active:scale-95 shadow-sm"
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationModal;
