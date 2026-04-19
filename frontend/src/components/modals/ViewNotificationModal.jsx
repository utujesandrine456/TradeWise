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
      case 'Medium': return 'text-[#09111E] bg-brand-50 border-brand-100 shadow-sm';
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
    <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-400/5 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="p-10 border-b border-white/5 flex items-center justify-between relative z-10 bg-gradient-to-r from-accent-400/5 to-transparent">
          <div className="flex items-center gap-6">
            <div className="bg-white/5 p-4 rounded-md border border-white/5 shadow-xl">
              <MdNotifications className="text-accent-400 text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Intelligence Feed</h2>
              <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.3em] mt-3 italic opacity-60">Critical System Pulse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-brand-300 hover:text-white hover:bg-white/5 rounded-md transition-all shadow-sm hover:rotate-90 border border-transparent hover:border-white/10"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar relative z-10">
          <div className="flex items-start gap-8">
            <div className="bg-white/5 p-8 rounded-md shadow-2xl border border-white/5">
              <div className="text-accent-400">
                {getNotificationIcon(notification.filterType || notification.type)}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{notification.title}</h3>
              <div className="flex items-center gap-6">
                <span className={`px-6 py-2 text-[10px] font-black rounded-md border uppercase tracking-[0.2em] italic ${notification.impact?.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : notification.impact?.toLowerCase() === 'medium' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-blue-400/10 text-blue-400 border-blue-400/20'}`}>
                  {notification.impact} SEVERITY_LEVEL
                </span>
                {!notification.read && (
                  <span className="px-6 py-2 text-[10px] font-black rounded-md bg-accent-400/10 text-accent-400 border border-accent-400/20 uppercase tracking-[0.2em] animate-pulse">
                    URGENT_UNREAD
                  </span>
                )}
              </div>
            </div>
          </div>

          {notification.read && (
            <div className="bg-white/5 border border-white/5 rounded-md p-8 shadow-inner relative overflow-hidden group">
              <div className="flex items-start gap-8 relative z-10">
                <div className="bg-white/5 p-4 rounded-md border border-white/5 shadow-xl text-accent-400">
                  <MdCheckCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 italic">Protocol Acknowledged</h4>
                  <p className="text-[10px] text-brand-300 font-black uppercase tracking-widest leading-relaxed opacity-40 italic">
                    This transmission has been successfully synchronized and is currently queued for automated secure purge to maintain operational efficiency.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}

          <div className="bg-white/5 border border-white/5 rounded-md p-10 shadow-inner relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 opacity-40 italic">
                <MdInfo className="text-xl text-accent-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-300">Transmission Payload Content</span>
              </div>
              <p className="text-white text-2xl font-black uppercase tracking-tight leading-relaxed italic opacity-80">{notification.message}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-400/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/5 p-8 rounded-md shadow-inner group hover:bg-white/[0.07] transition-all">
              <span className="block text-[10px] font-black text-brand-300 uppercase mb-3 px-1 italic opacity-40">Event Category</span>
              <p className="text-white font-black leading-tight uppercase italic group-hover:text-accent-400 transition-colors">{notification.type}</p>
            </div>

            <div className="bg-white/5 border border-white/5 p-8 rounded-md shadow-inner group hover:bg-white/[0.07] transition-all">
              <span className="block text-[10px] font-black text-brand-300 uppercase mb-3 px-1 italic opacity-40">Delivery Timeline</span>
              <div className="flex items-center gap-3 text-white font-black leading-tight uppercase italic group-hover:text-accent-400 transition-colors">
                <MdCalendarToday className="text-xl" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-[10px] text-brand-300 mt-2 font-black uppercase italic opacity-30 px-1">Relative: {notification.time}</p>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-10 relative z-10">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              className="group relative px-10 py-5 bg-accent-400 text-brand-950 rounded-md font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-2xl shadow-accent-400/20 overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <MdMarkEmailRead size={20} />
                <span>Synchronize</span>
              </div>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-md font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white/10 active:scale-95 shadow-sm italic"
          >
            Dismiss Transmission
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationModal;
