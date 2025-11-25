const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$2,450</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pending Reviews</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Your recent bookings and service updates will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
