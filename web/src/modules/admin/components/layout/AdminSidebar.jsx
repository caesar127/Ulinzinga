import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/events', label: 'Events', icon: '🎉' },
    { path: '/admin/vendors', label: 'Vendors', icon: '🛍️' },
    { path: '/admin/organizers', label: 'Organizers', icon: '🎯' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/reports', label: 'Reports', icon: '📄' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              location.pathname === item.path ? 'bg-gray-800 border-r-4 border-red-500 text-white' : ''
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
