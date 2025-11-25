import { useSelector } from 'react-redux';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">Manage platform operations and users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800">
            <span className="text-2xl">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
