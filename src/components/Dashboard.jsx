import React from 'react';
import { BsBook } from "react-icons/bs";
import { FaDollarSign, FaShoppingCart } from "react-icons/fa";
import SalesChart from './SalesChart';
import PurchaseChart from './PurchaseChart';
import ProductsTable from './ProductsTable';
import StatsCard from './StatsCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          title="Total Income"
          value="49,000 Frw"
          icon={<BsBook className="text-white text-2xl" />}
          bgColor="bg-black"
          descri="+12.9% increase month"
          iconColor="bg-blue-600"
        />
        <StatsCard 
          title="Total sales"
          value="31,000 Frw"
          icon={<FaDollarSign className="text-white text-2xl" />}
          bgColor="bg-black"
          descri="+23.9% increase month"
          iconColor="bg-green-600"
        />
        <StatsCard 
          title="Total expenses"
          value="17,000 Frw"
          icon={<FaShoppingCart className="text-white text-2xl" />}
          bgColor="bg-black"
          descri="-56.5% decrease month"
          iconColor="bg-purple-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SalesChart />
        <PurchaseChart />
      </div>
      
      {/* Table */}
      <ProductsTable />
    </div>
  );
};

export default Dashboard;
