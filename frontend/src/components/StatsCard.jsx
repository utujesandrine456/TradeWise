import React from 'react';

const StatsCard = ({ title, value, icon, bgColor = "bg-[#09111E]/40", iconColor = "text-accent-400", valueColor = "text-white", descri }) => {
  return (
    <div className={`group relative overflow-hidden backdrop-blur-xl p-8 rounded-md border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10 hover:scale-[1.02] ${bgColor} font-Urbanist`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/5 rounded-md blur-3xl -mr-16 -mt-16 group-hover:bg-accent-400/10 transition-colors" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-5 rounded-md bg-blue-600/5 border border-white/5 shadow-inner transition-transform group-hover:scale-110 ${iconColor}`}>
          {icon}
        </div>
        {descri && (
          <span className="text-[10px] font-bold text-brand-300 italic bg-blue-600/5 px-4 py-1.5 rounded-md border border-white/5">
            {descri}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-xs font-bold text-brand-300 mb-3 leading-none opacity-60 px-1">{title}</p>
        <p className={`text-5xl font-bold  leading-none ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
