import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

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
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'text-black font-medium' 
                    : 'text-gray-400 hover:text-black'
                }`
              }
            >
              Dashboard
            </NavLink>

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

            {user?.role === 'admin' && (
              <>
                <NavLink
                  to="/attendance"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Attendance
                </NavLink>

                <NavLink
                  to="/members"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Members
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Signup
                </NavLink>

                <NavLink
                  to="/system-status"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  System
                </NavLink>

                <NavLink
                  to="/device-admin"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Devices
                </NavLink>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'mentor') && (
              <>
                <NavLink
                  to="/attendance/manual"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Manual
                </NavLink>

                <NavLink
                  to="/attendance/history"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  History
                </NavLink>
              </>
            )}

            {/* User Info & Logout - Desktop */}
            <div className="hidden sm:flex items-center space-x-4 border-l border-gray-200 pl-8">
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
          <div className="flex flex-wrap gap-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-xs tracking-wider uppercase transition-colors duration-200 ${
                  isActive 
                    ? 'text-black font-medium' 
                    : 'text-gray-400 hover:text-black'
                }`
              }
            >
              Dashboard
            </NavLink>

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

            {user?.role === 'admin' && (
              <>
                <NavLink
                  to="/attendance"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Attendance
                </NavLink>

                <NavLink
                  to="/members"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Members
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Signup
                </NavLink>

                <NavLink
                  to="/system-status"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  System
                </NavLink>

                <NavLink
                  to="/device-admin"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Devices
                </NavLink>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'mentor') && (
              <>
                <NavLink
                  to="/attendance/manual"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  Manual
                </NavLink>

                <NavLink
                  to="/attendance/history"
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase transition-colors duration-200 ${
                      isActive 
                        ? 'text-black font-medium' 
                        : 'text-gray-400 hover:text-black'
                    }`
                  }
                >
                  History
                </NavLink>
              </>
            )}

            {/* Mobile User Info */}
            <div className="sm:hidden w-full border-t border-gray-100 pt-4 mt-2">
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
