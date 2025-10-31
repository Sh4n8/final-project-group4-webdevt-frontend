import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNavBar from "../../components/AdminNavBar";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  
  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";

  return (
    <div className="flex min-h-screen bg-[#F5E6D3]">
      {/* Sidebar */}
      <AdminNavBar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {isDashboard ? (
          <div>
            <h1 className="text-2xl font-bold text-[#5D4E37]">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-[#5D4E37]">
              Welcome, <span className="font-semibold">{user?.username || "Admin"}</span>.
            </p>
          </div>
        ) : null}

        
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
