import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, 
  User, 
  MapPin, 
  LogOut, 
  ChevronRight
} from 'lucide-react';

export const AccountSidebar = ({ activeTab, onSelectTab }) => {
  const { user, logout, orders } = useAuth();

  if (!user) return null;

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'In Transit' || o.status === 'Placed' || o.status === 'Packed'
  ).length;

  const menuItems = [
    {
      id: 'orders',
      label: 'My Orders & Tracking',
      icon: Package,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} Active` : null,
      badgeColor: 'bg-[#821D38] text-white',
    },
    {
      id: 'profile',
      label: 'Personal Information',
      icon: User,
    },
    {
      id: 'addresses',
      label: 'Saved Delivery Addresses',
      icon: MapPin,
    },
  ];

  return (
    <aside className="w-full lg:w-[300px] shrink-0 font-sans select-none space-y-4">
      {/* User Mini Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#ECE7EC] shadow-xs">
        <div className="flex items-center gap-3.5">
          {/* User Profile Image if uploaded, otherwise left empty */}
          {(user?.avatar || user?.image) ? (
            <img
              src={user.avatar || user.image}
              alt={user.firstName || user.name || 'Profile'}
              className="w-13 h-13 rounded-full object-cover border-2 border-[#821D38] shrink-0 shadow-xs"
            />
          ) : null}

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-[#111827] truncate">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-[#6F6870] truncate">{user.email}</span>
            <span className="text-[11px] text-[#6F6870]">{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <nav className="bg-white rounded-2xl p-2 border border-[#ECE7EC] shadow-xs space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 border-0 ${
                isActive
                  ? 'bg-[#821D38] text-white shadow-xs'
                  : 'text-[#4A3E45] hover:bg-[#FDF2F4] hover:text-[#821D38]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className={isActive ? 'text-white' : 'text-[#821D38]'} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  size={15}
                  className={`transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-neutral-400'
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* Logout Button */}
        <div className="pt-1 mt-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 border-0"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
