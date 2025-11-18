import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName = user?.name || "Username";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-[#F5E6D3] border-b border-[#D4B896]">
      <div className="max-w-full px-6">
        <div className="flex items-center h-16">
          {/* Logo Section - Left Side */}
          <Link to="/dashboard" className="flex items-center gap-1 flex-shrink-0 cursor-pointer">

            <img 
              src="/logo-library.png" 
              alt="LibroLink Logo" 
              className="w-24 h-24 rounded"
            />
            <div>
              <h1 className="text-xl font-bold text-[#5D4E37]">LibroLink</h1>
              <p className="text-xs text-[#8B7355]">
                Library Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links - Left Side */}
          <div className="hidden md:flex items-center gap-6 ml-12">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full font-medium transition-colors text-[#5D4E37] hover:bg-[#8B7355] hover:text-white"
            >
              Explore
            </Link>

            <Link
              to="/library"
              className="px-4 py-2 rounded-full font-medium transition-colors text-[#5D4E37] hover:bg-[#8B7355] hover:text-white"
            >
              My Library
            </Link>
          </div>

          {/* User Profile Section - Right Side */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors"
              >
                <div className="w-9 h-9 bg-[#8B7355] rounded-full flex items-center justify-center text-white font-semibold">
                  {avatarLetter}
                </div>
                <span>{displayName}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Help
                  </Link>
                  <div className="border-t border-[#D4B896] my-2"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F5E6D3] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#5D4E37] hover:text-[#8B7355]"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#D4B896]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#D4B896]">
                <div className="w-9 h-9 bg-[#8B7355] rounded-full flex items-center justify-center text-white font-semibold">
                  {avatarLetter}
                </div>
                <span className="text-[#5D4E37] font-medium">
                  {displayName}
                </span>
              </div>

              <div className="px-4">
                <Link
                  to="/dashboard"
                  className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors"
                >
                  Explore
                </Link>
              </div>
              <div className="px-4">
                <Link
                  to="/library"
                  className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors"
                >
                  My Library
                </Link>
              </div>
              <div className="border-t border-[#D4B896] my-2"></div>
              <a
                href="#profile"
                className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors px-4"
              >
                Profile
              </a>
              <a
                href="#settings"
                className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors px-4"
              >
                Settings
              </a>
              <a
                href="#help"
                className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors px-4"
              >
                Help
              </a>
              <button
                onClick={logout}
                className="text-left text-red-600 font-medium transition-colors px-4"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavBar;