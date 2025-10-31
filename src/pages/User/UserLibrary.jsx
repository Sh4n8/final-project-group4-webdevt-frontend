import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";

const UserLibrary = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <UserNavBar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">User Library</h1>
        <p className="mb-4">Welcome, {user?.username || "User"}.</p>

        {/* library content goes here */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <p className="text-gray-600">
            This is where your saved items, books, or content will appear.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;
