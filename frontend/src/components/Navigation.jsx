import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Navigation groups for better organization
  const navigationGroups = {
    primary: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/attendance', label: 'Attendance', adminOnly: true }
    ],
    management: [
      { to: '/members', label: 'Members', adminOnly: true },
      { to: '/signup', label: 'Add User', adminOnly: true }
    ],
    tools: [
      { to: '/attendance/manual', label: 'Manual Entry', adminOrMentor: true },
      { to: '/attendance/history', label: 'History', adminOrMentor: true }
    ],
    system: [
      { to: '/system-status', label: 'System', adminOnly: true },
      { to: '/device-admin', label: 'Devices', adminOnly: true }
    ]
  };

  const shouldShowLink = (link) => {
    if (link.adminOnly && user?.role !== 'admin') return false;
    if (link.adminOrMentor && !['admin', 'mentor'].includes(user?.role)) return false;
    return true;
  };

  const DropdownMenu = ({ title, links, isOpen, onToggle }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center text-xs tracking-wider uppercase transition-colors duration-200 text-gray-400 hover:text-black group"
      >
        {title}
        <svg 
          className={`ml-1 h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 py-2 bg-white border border-gray-100 rounded-sm shadow-lg min-w-[120px] z-50">
          {links.filter(shouldShowLink).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onToggle()}
              className={({ isActive }) =>
                `block px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-200 ${
                  isActive 
                    ? 'text-black font-medium bg-gray-50' 
                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-medium text-black tracking-tight">
              Attendee
            </h1>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Primary Navigation */}
            {navigationGroups.primary.filter(shouldShowLink).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'text-black font-medium' 
                      : 'text-gray-400 hover:text-black'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Profile Link */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'text-black font-medium' 
                    : 'text-gray-400 hover:text-black'
                }`
              }
            >
              Profile
            </NavLink>

            {/* Grouped Navigation for Admin */}
            {user?.role === 'admin' && (
              <>
                <DropdownMenu
                  title="Manage"
                  links={navigationGroups.management}
                  isOpen={isDropdownOpen === 'management'}
                  onToggle={() => setIsDropdownOpen(isDropdownOpen === 'management' ? null : 'management')}
                />
                
                <DropdownMenu
                  title="System"
                  links={navigationGroups.system}
                  isOpen={isDropdownOpen === 'system'}
                  onToggle={() => setIsDropdownOpen(isDropdownOpen === 'system' ? null : 'system')}
                />
              </>
            )}

            {/* Tools for Admin/Mentor */}
            {(user?.role === 'admin' || user?.role === 'mentor') && (
              <DropdownMenu
                title="Tools"
                links={navigationGroups.tools}
                isOpen={isDropdownOpen === 'tools'}
                onToggle={() => setIsDropdownOpen(isDropdownOpen === 'tools' ? null : 'tools')}
              />
            )}

            {/* User Info & Logout - Desktop */}
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-8">
              <div className="text-xs text-gray-400">
                <span className="capitalize">{user?.role}</span>
                <span className="mx-2">•</span>
                <span className="hidden md:inline">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 tracking-wider uppercase hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* User Initial */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400">
                {user?.name?.charAt(0)}
              </span>
            </div>
            
            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 tracking-wider uppercase hover:text-black transition-colors duration-200 sm:hidden"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="lg:hidden border-t border-gray-100 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Primary Navigation */}
            {navigationGroups.primary.filter(shouldShowLink).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase transition-colors duration-200 ${
                    isActive 
                      ? 'text-black font-medium' 
                      : 'text-gray-400 hover:text-black'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-xs tracking-wider uppercase transition-colors duration-200 ${
                  isActive 
                    ? 'text-black font-medium' 
                    : 'text-gray-400 hover:text-black'
                }`
              }
            >
              Profile
            </NavLink>

            {/* All other navigation links for mobile */}
            {Object.values(navigationGroups).flat().filter(shouldShowLink).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase transition-colors duration-200 ${
                    isActive 
                      ? 'text-black font-medium' 
                      : 'text-gray-400 hover:text-black'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile User Info */}
            <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
              <div className="text-xs text-gray-400">
                <span className="capitalize">{user?.role}</span>
                <span className="mx-2">•</span>
                <span>{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
