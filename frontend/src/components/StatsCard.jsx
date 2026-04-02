import React from 'react';

const StatsCard = ({ title, value, icon, bgColor = "bg-brand-900/40", iconColor = "text-accent-400", valueColor = "text-white", descri }) => {
  return (
    <div className={`group relative overflow-hidden backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10 hover:scale-[1.02] ${bgColor} font-afacad`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-400/10 transition-colors" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner transition-transform group-hover:scale-110 ${iconColor}`}>
          {icon}
        </div>
        {descri && (
          <span className="text-[10px] font-#FC9E4F text-gray-500 lowercase italic bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {descri?.toLowerCase()}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-#FC9E4F text-gray-500 uppercase tracking-widest mb-1 leading-none">{title?.toLowerCase()}</p>
        <p className={`text-3xl font-#FC9E4F italic tracking-tighter leading-tight ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
