import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const categories = [
    "Dynamic Categories",
    "Academic & Reference",
    "Arts & Literature",
    "Self-Development & Lifestyle",
    "Science & Technology",
    "Languages & Communication",
    "Digital Resources",
  ];

  return (
    <nav className="bg-[#F5E6D3] border-b border-[#D4B896]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-[#8B7355] p-2.5 rounded">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#5D4E37]">LibroLink</h1>
              <p className="text-xs text-[#8B7355]">
                Library Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/explore"
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === "explore"
                  ? "bg-[#8B7355] text-white"
                  : "text-[#5D4E37] hover:text-[#8B7355]"
              }`}
            >
              Explore
            </Link>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setActiveTab("category");
                }}
                className={`flex items-center gap-1 px-4 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "category" || isCategoryOpen
                    ? "bg-[#8B7355] text-white"
                    : "text-[#5D4E37] hover:text-[#8B7355]"
                }`}
              >
                Category
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
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

              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-3 z-50">
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/library"
              onClick={() => setActiveTab("my-library")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === "my-library"
                  ? "bg-[#8B7355] text-white"
                  : "text-[#5D4E37] hover:text-[#8B7355]"
              }`}
            >
              My Library
            </Link>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 !bg-white border border-[#D4B896] rounded-full text-sm focus:outline-none focus:border-[#8B7355] !text-[#5D4E37] placeholder-[#8B7355]"
              />
              <svg
                className="w-5 h-5 text-[#8B7355] absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors"
              >
                <div className="w-9 h-9 bg-[#8B7355] rounded-full flex items-center justify-center text-white font-semibold">
                  {avatarLetter}
                </div>
                <span>{user?.username || "Username"}</span>
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
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Settings
                  </a>
                  <a
                    href="#help"
                    className="block px-4 py-2 text-[#5D4E37] hover:bg-[#F5E6D3] transition-colors"
                  >
                    Help
                  </a>
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
                  {user?.username || "Username"}
                </span>
              </div>

              <div className="px-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 !bg-white border border-[#D4B896] rounded-full text-sm focus:outline-none focus:border-[#8B7355] !text-[#5D4E37] placeholder-[#8B7355]"
                />
              </div>

              <Link
                to="/explore"
                className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors px-4"
              >
                Explore
              </Link>
              <Link
                to="/library"
                className="text-[#5D4E37] hover:text-[#8B7355] font-medium transition-colors px-4"
              >
                My Library
              </Link>
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
