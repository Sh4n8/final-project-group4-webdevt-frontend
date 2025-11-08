import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminBooks from "./pages/Admin/AdminBooks";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminReports from "./pages/Admin/AdminReports";
import UserDashboard from "./pages/User/UserDashboard";
import UserLibrary from "./pages/User/UserLibrary";
import PrivateRoute from "./lib/PrivateRoute";

import Profile from "./pages/UserProfile/Profile";
import Settings from "./pages/UserProfile/Settings";
import Help from "./pages/UserProfile/Help";

import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<h1>Welcome to the Admin Dashboard</h1>} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/library"
            element={
              <PrivateRoute>
                <UserLibrary />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
