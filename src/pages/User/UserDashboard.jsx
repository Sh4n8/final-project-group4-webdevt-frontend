import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <UserNavBar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="mb-4">Hello, {user?.username || "User"}.</p>

        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
};

export default UserDashboard;
