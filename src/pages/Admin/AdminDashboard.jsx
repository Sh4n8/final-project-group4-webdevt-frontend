import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNavBar from "../../components/AdminNavBar";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  
  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";

  const stats = [
    { title: "Total Books", count: 245 },
    { title: "Total Users", count: 120 },
    { title: "Categories", count: 8 },
    { title: "Reports", count: 5 },
  ];

  const activities = [
    "Added 'The Great Gatsby' to the library.",
    "User JaneDoe borrowed '1984'.",
    "New category 'Science Fiction' created.",
    "Report generated for overdue books.",
  ];

  return (
    <div className="flex min-h-screen bg-[#F5E6D3]">
      <AdminNavBar />

      <div className="flex-1 p-8">
        {isDashboard ? (
          <div>
            <h1 className="text-2xl font-bold text-[#5D4E37]">Admin Dashboard</h1>
            <p className="mt-2 text-[#5D4E37]">
              Welcome, <span className="font-semibold">{user?.username || "Admin"}</span>.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow text-center text-[#5D4E37]">
                  <h2 className="text-3xl font-bold">{item.count}</h2>
                  <p className="mt-1 text-sm">{item.title}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-[#5D4E37] mb-2">Recent Activities</h2>
              <ul className="bg-white rounded-xl p-4 space-y-2 text-[#5D4E37]">
                {activities.map((activity, index) => (
                  <li key={index} className="border-b last:border-none py-2">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}