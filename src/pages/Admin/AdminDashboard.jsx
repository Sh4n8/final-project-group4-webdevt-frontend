import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNavBar from "../../components/AdminNavBar";

// Icons (install once: npm install lucide-react)
import { BookOpen, Users, Folders, AlertCircle, Clock, Library } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";

  const stats = [
    { title: "Total Books", count: 245, icon: BookOpen, color: "text-amber-700" },
    { title: "Total Users", count: 120, icon: Users, color: "text-emerald-700" },
    { title: "Categories", count: 8, icon: Folders, color: "text-indigo-700" },
    { title: "Reports", count: 5, icon: AlertCircle, color: "text-rose-700" },
  ];

  const activities = [
    { text: "Added 'The Great Gatsby' to the library.", time: "2 hours ago" },
    { text: "User JaneDoe borrowed '1984'.", time: "4 hours ago" },
    { text: "New category 'Science Fiction' created.", time: "Yesterday" },
    { text: "Report generated for overdue books.", time: "2 days ago" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FAF5F0] via-[#F5E6D3] to-[#E8D8C3]">
      {/* Sidebar */}
      <div className="h-screen w-64 fixed top-0 left-0 z-10 shadow-2xl">
        <AdminNavBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {isDashboard ? (
            <div className="space-y-10">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl p-8 lg:p-10 border border-amber-200 shadow-md">
                <div className="flex items-center gap-4">
                  <Library className="w-12 h-12 text-amber-800" />
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#4A3F35]">
                      Welcome back, {user?.username || "Admin"}
                    </h1>
                    <p className="mt-2 text-lg text-[#6B5B3F]">
                      Here's what's happening in your library today.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 group hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <item.icon className={`w-12 h-12 ${item.color} mb-4 group-hover:scale-110 transition-transform`} />
                      <h2 className="text-4xl font-bold text-[#4A3F35]">{item.count}</h2>
                      <p className="mt-3 text-sm font-semibold text-[#6B5B3F] tracking-wider uppercase">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activities */}
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35] mb-6 flex items-center gap-3">
                  <Clock className="w-7 h-7 text-amber-700" />
                  Recent Activities
                </h2>
                <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex gap-5 px-8 py-5 hover:bg-amber-50 transition-colors ${
                        index !== activities.length - 1 ? "border-b border-amber-100" : ""
                      }`}
                    >
                      <div className="w-3 h-3 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-[#4A3F35] font-medium leading-relaxed">
                          {activity.text}
                        </p>
                        <p className="text-sm text-amber-600 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Child Routes (e.g., Books, Users, etc.) */}
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}