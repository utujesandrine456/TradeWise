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
      case 'High': return 'text-red-700 bg-red-50 border-red-100 shadow-sm';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-100 shadow-sm';
      case 'Low': return 'text-blue-700 bg-blue-50 border-blue-100 shadow-sm';
      default: return 'text-gray-700 bg-gray-50 border-gray-100';
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
    <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gray-50 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="p-10 border-b border-gray-100 flex items-center justify-between relative z-10 bg-gradient-to-r from-gray-50/50 to-transparent">
          <div className="flex items-center gap-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 shadow-sm">
              <MdNotifications className="text-[#09111E] text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#09111E] uppercase tracking-tighter leading-none">Intelligence Feed</h2>
              <p className="text-[10px] font-black text-[#09111E]/60 uppercase tracking-[0.3em] mt-3 italic opacity-60">Critical System Pulse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-[#09111E]/40 hover:text-[#09111E] hover:bg-gray-50 rounded-md transition-all shadow-sm hover:rotate-90 border border-transparent hover:border-gray-200"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar relative z-10">
          <div className="flex items-start gap-8">
            <div className="bg-gray-50 p-8 rounded-md shadow-sm border border-gray-100">
              <div className="text-[#09111E]">
                {getNotificationIcon(notification.filterType || notification.type)}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-black text-[#09111E] uppercase tracking-tighter leading-none">{notification.title}</h3>
              <div className="flex items-center gap-6">
                <span className={`px-6 py-2 text-[10px] font-black rounded-md border uppercase tracking-[0.2em] italic ${getImpactColor(notification.impact)}`}>
                  {notification.impact} SEVERITY_LEVEL
                </span>
                {!notification.read && (
                  <span className="px-6 py-2 text-[10px] font-black rounded-md bg-gray-100 text-[#09111E] border border-gray-200 uppercase tracking-[0.2em] animate-pulse">
                    URGENT_UNREAD
                  </span>
                )}
              </div>
            </div>
          </div>

          {notification.read && (
            <div className="bg-gray-50 border border-gray-100 rounded-md p-8 shadow-inner relative overflow-hidden group">
              <div className="flex items-start gap-8 relative z-10">
                <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm text-emerald-500">
                  <MdCheckCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-[#09111E] uppercase tracking-[0.2em] mb-2 italic">Protocol Acknowledged</h4>
                  <p className="text-[10px] text-[#09111E]/60 font-black uppercase tracking-widest leading-relaxed opacity-40 italic">
                    This transmission has been successfully synchronized and is currently queued for automated secure purge to maintain operational efficiency.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-md p-10 shadow-inner relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 opacity-40 italic">
                <MdInfo className="text-xl text-[#09111E]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#09111E]/60">Transmission Payload Content</span>
              </div>
              <p className="text-[#09111E] text-2xl font-black uppercase tracking-tight leading-relaxed italic opacity-80">{notification.message}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-200/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-md shadow-inner group hover:bg-gray-100 transition-all">
              <span className="block text-[10px] font-black text-[#09111E]/60 uppercase mb-3 px-1 italic opacity-40">Event Category</span>
              <p className="text-[#09111E] font-black leading-tight uppercase italic group-hover:text-blue-600 transition-colors">{notification.type}</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-8 rounded-md shadow-inner group hover:bg-gray-100 transition-all">
              <span className="block text-[10px] font-black text-[#09111E]/60 uppercase mb-3 px-1 italic opacity-40">Delivery Timeline</span>
              <div className="flex items-center gap-3 text-[#09111E] font-black leading-tight uppercase italic group-hover:text-blue-600 transition-colors">
                <MdCalendarToday className="text-xl" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-[10px] text-[#09111E]/60 mt-2 font-black uppercase italic opacity-30 px-1">Relative: {notification.time}</p>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-gray-100 bg-gray-50/30 flex items-center justify-end gap-10 relative z-10">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              className="group relative px-10 py-5 bg-[#09111E] text-white rounded-md font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <MdMarkEmailRead size={20} />
                <span>Synchronize</span>
              </div>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-10 py-5 bg-white border border-gray-200 text-[#09111E] rounded-md font-black uppercase tracking-widest text-[10px] transition-all hover:bg-gray-50 active:scale-95 shadow-sm italic"
          >
            Dismiss Transmission
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationModal;
