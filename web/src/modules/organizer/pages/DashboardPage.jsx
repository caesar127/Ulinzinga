import React from "react";
import { CalendarDaysIcon, UsersIcon, TicketIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const DashboardPage = () => {
  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Organizer Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
            <CalendarDaysIcon className="h-6 w-6 text-[#FFB300]" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">15</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3">
            <div className="h-1 bg-[#FFB300] rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
            <CalendarDaysIcon className="h-6 w-6 text-[#FFB300]" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3">
            <div className="h-1 bg-[#FFB300] rounded-full w-1/2"></div>
          </div>
        </div>

        {/* Total Attendees */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Attendees</h3>
            <UsersIcon className="h-6 w-6 text-[#FFB300]" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3">
            <div className="h-1 bg-[#FFB300] rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Ticket Sales */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Ticket Sales</h3>
            <TicketIcon className="h-6 w-6 text-[#FFB300]" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">$12,450</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3">
            <div className="h-1 bg-[#FFB300] rounded-full w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Detailed Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Panel */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Upcoming Events
            <CalendarDaysIcon className="h-6 w-6 text-[#FFB300]" />
          </h2>
          <p className="text-gray-600 mb-4">Your upcoming events will appear here.</p>
          <ul className="space-y-3">
            <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition">
              <span>Summer Music Fest</span>
              <span className="text-sm text-gray-500">Aug 25, 2025</span>
            </li>
            <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition">
              <span>Food & Drinks Expo</span>
              <span className="text-sm text-gray-500">Sep 02, 2025</span>
            </li>
          </ul>
        </div>

        {/* Recent Activity Panel */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Recent Activity
            <ChartBarIcon className="h-6 w-6 text-[#FFB300]" />
          </h2>
          <p className="text-gray-600 mb-4">
            Recent ticket sales and registrations will appear here.
          </p>
          <ul className="space-y-3">
            <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition">
              <span>John Doe purchased 2 tickets</span>
              <span className="text-sm text-gray-500">5m ago</span>
            </li>
            <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition">
              <span>Jane Smith registered</span>
              <span className="text-sm text-gray-500">12m ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
