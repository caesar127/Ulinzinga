import React from "react";
import {
  CalendarDaysIcon,
  UsersIcon,
  TicketIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const DashboardPage = () => {
  return (
    <div className="p-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs">Total Revenue (last 6 months)</h3>
            <div className="bg-[#FFF3CD] p-2 rounded-full">
              <ChartBarIcon className="h-5 w-5 text-[#FFB300]" />
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-2">MK10,000,000</p>
          <p className="text-green-600 text-xs mt-1">+6% increase in revenue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs">Total Events</h3>
            <div className="bg-[#FFF3CD] p-2 rounded-full">
              <CalendarDaysIcon className="h-5 w-5 text-[#FFB300]" />
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-2">10</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs">Event Vendors</h3>
            <div className="bg-[#FFF3CD] p-2 rounded-full">
              <UsersIcon className="h-5 w-5 text-[#FFB300]" />
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-2">210</p>
          <p className="text-green-600 text-xs mt-1">+20% increase</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs">User Generated Content</h3>
            <div className="bg-[#FFF3CD] p-2 rounded-full">
              <TicketIcon className="h-5 w-5 text-[#FFB300]" />
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-2">16.5K</p>
        </div>

      </div>

      {/* Charts + Right Side Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        {/* Ticket Sales Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Sales Overview</h2>
          <div className="h-48 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

        {/* User Generated Content Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Generated Content</h2>
          <div className="h-48 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            Small Chart Placeholder
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">#003</p>
                  <p className="text-xs text-gray-500">John Tadala</p>
                </div>
                <p className="font-semibold">MK200,000</p>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  Success
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <button className="text-sm text-blue-500">View All</button>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/event.png" className="h-10 w-10 rounded-full" />
                <span className="font-medium">Wanted Finale Grand Tour</span>
              </div>
              <span className="text-gray-500 text-sm">More Info</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
