const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">5,234</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Events</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">142</p>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$45,230</p>
          <p className="text-sm text-green-600 mt-2">↑ 23% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Vendors</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">89</p>
          <p className="text-sm text-green-600 mt-2">↑ 5% from last month</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Activity</h2>
          <p className="text-gray-600">Real-time platform activity and user engagement metrics.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Health</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-semibold">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Load</span>
              <span className="text-yellow-600 font-semibold">Moderate</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Actions</h2>
        <p className="text-gray-600">Recent administrative actions and system events will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
