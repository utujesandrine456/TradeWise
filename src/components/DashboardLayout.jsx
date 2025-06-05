import React from 'react';
import { MdDashboard, MdStorage, MdHistory, MdShoppingBag, MdAttachMoney, MdNotifications, MdCreditCard, MdShowChart, MdLogout } from "react-icons/md";
import { GiTrade } from "react-icons/gi";
import { BsBook } from "react-icons/bs";
import { FaDollarSign, FaShoppingCart } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import logo from '../assets/logo.png';

import SalesChart from './SalesChart';
import PurchaseChart from './PurchaseChart';
import ProductsTable from './ProductsTable';
import StatsCard from './StatsCard';


const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-800">

      
      <div className="w-64 shadow-2xl flex flex-col border-r border-gray-200 " style={{ backgroundColor: '#be741e' }}>
        
        <div className="p-6 border-b border-gray-200 flex items-center">
           <img src={logo} alt="TradeWise logo" className='w-[50px] h-[40px] rounded-full mr-1' />
          <h1 className="text-2xl font-bold tracking-wide text-white">TradeWise</h1>
        </div>
      
        <nav className="flex-grow p-6 space-y-2">
          <ul>
            <li>
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium bg-black cursor-pointer">
                <MdDashboard className="mr-4 text-xl text-white"/>
                Dashboard
              </a>
            </li>
            <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                 <MdStorage className="mr-4 text-xl text-white"/>
                Stock
              </a>
            </li>
            <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                 <MdHistory className="mr-4 text-xl text-white"/>
                History
              </a>
            </li>
             <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                <MdShoppingBag className="mr-4 text-xl text-white"/>
                Purchase Products
              </a>
            </li>
             <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                <MdAttachMoney className="mr-4 text-xl text-white"/>
                Selling Products
              </a>
            </li>
             <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                <MdNotifications className="mr-4 text-xl text-white"/>
                Notification
              </a>
            </li>
             <li className="mt-1">
              <a href="#" className="flex items-center py-3 px-4 text-white hover:bg-black rounded-lg transition duration-200 font-medium cursor-pointer">
                <MdCreditCard className="mr-4 text-xl text-white"/>
                Credits/Debit
              </a>
            </li>
            
          </ul>
        </nav>
        {/* Logout */}
         <div className="p-6 border-t border-gray-200 ">
           <a href="#" className="flex items-center py-3 px-4 text-black hover:bg-white rounded-lg transition duration-200 font-medium cursor-pointer bg-white">
                <MdLogout className="mr-4 text-xl"/>
                Logout
              </a>
         </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white text-gray-800">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm text-gray-800">
          <div className="text-3xl font-semibold">Welcome Back, User !!!!!</div>
           {/* Language Selector or other header elements */}
           <div><span className='text-[30px]' ><FaCartPlus /></span></div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {/* Content of each dashboard section will be rendered here */}
          {/* Stats Cards */}
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
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout; 