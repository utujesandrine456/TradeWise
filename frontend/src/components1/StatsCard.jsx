import React from 'react';

const StatsCard = ({ title, value, icon, bgColor, iconColor, valueColor = "text-white", descri }) => {
  return (
    <div className={`flex items-center p-6 rounded-lg shadow-lg ${bgColor}`}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconColor}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-normal font-medium text-gray-300">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-sm text-gray-400 mt-2">{descri}</p>
      </div>
    </div>
  );
};

export default StatsCard; 

