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
        return <MdWarning className={`text-black ${iconClass}`} />;
      case 'info':
        return <MdInfo className={`text-black ${iconClass}`} />;
      case 'error':
        return <MdError className={`text-red-600 ${iconClass}`} />;
      default:
        return <MdInfo className={`text-black ${iconClass}`} />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-100 shadow-sm';
      case 'Medium': return 'text-brand-900 bg-brand-50 border-brand-100 shadow-sm';
      case 'Low': return 'text-brand-300 bg-brand-50/50 border-brand-50 shadow-sm';
      default: return 'text-brand-400 bg-brand-50/30 border-brand-100';
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
    <div className="fixed inset-0 bg-brand-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-brand-100 rounded-md shadow-[0_50px_100px_-20px_rgba(9,17,30,0.3)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="p-12 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-md border border-brand-100 shadow-xl">
              <MdNotifications className="text-brand-900 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-brand-900 uppercase tracking-tighter leading-none">Intelligence Feed</h2>
              <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.3em] mt-3 italic">Critical System Pulse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-brand-200 hover:text-brand-900 hover:bg-white rounded-md transition-all shadow-sm hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <div className="p-12 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-10">
            <div className="bg-brand-900 p-8 rounded-md shadow-2xl scale-110">
              <div className="brightness-0 invert opacity-80">
                {getNotificationIcon(notification.filterType || notification.type)}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-4xl font-black text-brand-900 uppercase tracking-tighter leading-none">{notification.title}</h3>
              <div className="flex items-center gap-6">
                <span className={`px-8 py-2 text-[10px] font-black rounded-md border uppercase tracking-[0.2em] ${getImpactColor(notification.impact)}`}>
                  {notification.impact} SEVERITY_LEVEL
                </span>
                {!notification.read && (
                  <span className="px-8 py-2 text-[10px] font-black rounded-md bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-[0.2em] animate-pulse">
                    URGENT_UNREAD
                  </span>
                )}
              </div>
            </div>
          </div>

          {notification.read && (
            <div className="bg-brand-50/50 border border-brand-100 rounded-md p-10 shadow-inner relative overflow-hidden group">
              <div className="flex items-start gap-8 relative z-10">
                <div className="bg-white p-4 rounded-md border border-brand-100 shadow-xl text-brand-900">
                  <MdWarning size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-brand-900 uppercase tracking-[0.2em] mb-2">Protocol Acknowledged</h4>
                  <p className="text-[10px] text-brand-300 font-black uppercase tracking-widest leading-relaxed opacity-60">
                    This transmission has been successfully synchronized and is currently queued for automated secure purge to maintain operational efficiency.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-900/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}

          <div className="bg-brand-50/50 border border-brand-100 rounded-md p-12 shadow-inner relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 opacity-40 italic">
                <MdInfo className="text-xl text-brand-900" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Transmission Payload Content</span>
              </div>
              <p className="text-brand-900 text-2xl font-black uppercase tracking-tight leading-none italic">{notification.message}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-900/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <span className="block text-[10px] font-bold text-gray-400 uppercase mb-3 px-1">Event Category</span>
              <p className="text-black font-bold leading-tight capitalize">{notification.type}</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <span className="block text-[10px] font-bold text-gray-400 uppercase mb-3 px-1">Delivery Timeline</span>
              <div className="flex items-center gap-3 text-black font-bold leading-tight">
                <MdCalendarToday className="text-black text-lg" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-medium opacity-60 px-1">Relative: {notification.time}</p>
            </div>
          </div>
        </div>

        <div className="p-12 border-t border-brand-50 bg-brand-50/20 flex items-center justify-end gap-10">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              className="group relative px-12 py-5 bg-emerald-600 text-white rounded-md font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <MdMarkEmailRead size={20} />
                <span>Confirm Synchronization</span>
              </div>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-12 py-5 bg-white border border-brand-100 text-brand-900 rounded-md font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-brand-50 active:scale-95 shadow-sm"
          >
            Dismiss Transmission
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationModal;
