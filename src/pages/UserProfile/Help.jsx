import React from "react";
import UserNavBar from "../../components/UserNavBar";

const Help = () => {
  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <UserNavBar />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-[#5D4E37]">Help Page</h1>
        <p className="text-[#8B7355] mt-4">
          This is the help page. Add your FAQ or support content here.
        </p>
      </div>
    </div>
  );
};

export default Help;
