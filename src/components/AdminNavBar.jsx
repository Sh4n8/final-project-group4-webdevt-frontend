import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FolderOpen,
  FileBarChart,
  LogOut,
} from "lucide-react";

const AdminNavBar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    { name: "Book", icon: <BookOpen size={20} />, path: "/admin/books" },
    { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
    {
      name: "Categories",
      icon: <FolderOpen size={20} />,
      path: "/admin/categories",
    },
    {
      name: "Reports",
      icon: <FileBarChart size={20} />,
      path: "/admin/reports",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#5D4E37] flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#D4B896]">
          <div className="bg-[#8B7355] p-2 rounded">
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
            <h1 className="text-lg font-bold text-[#F5E6D3]">LibroLink</h1>
            <p className="text-xs text-[#D4B896]">Library System</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#D4B896] text-[#5D4E37] font-semibold"
                    : "text-[#F5E6D3] hover:bg-[#8B7355] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4 mb-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-[#F5E6D3] hover:bg-[#8B7355] transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminNavBar;
