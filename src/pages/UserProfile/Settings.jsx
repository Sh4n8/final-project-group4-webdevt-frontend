import React, { useState, useContext, useRef } from "react";
import UserNavBar from "../../components/UserNavBar";
import { Camera, Edit2, ChevronDown } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("account");

  // Account form states
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const avatarInputRef = useRef(null);

  const [openFAQ, setOpenFAQ] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const removeAvatar = () => setAvatar(null);

  const handleSaveChanges = () => {
    updateUser({
      username,
      email,
      phone,
      avatar,
    });
    alert("Changes saved!");
  };

  const sidebarItems = ["account", "notifications", "help"];

  const faqs = [
    { question: "How do I reset my password?", answer: "Go to the password tab in settings and update your password." },
    { question: "How do I change my username?", answer: "You can change it in the account tab and click save changes." },
    { question: "Can I delete my account?", answer: "Currently, account deletion is not supported." },
  ];

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <UserNavBar />

      <div className="flex max-w-7xl mx-auto p-8 gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white border border-[#D4B896] rounded-xl shadow p-6 flex flex-col gap-4">
          {sidebarItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === item
                  ? "bg-[#8B7355] text-white"
                  : "hover:bg-[#F3E4CD] text-[#5D4E37]"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white border border-[#D4B896] rounded-xl shadow p-8">
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-[#5D4E37]">Account Settings</h1>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 relative">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-[#EDE0D4] flex items-center justify-center overflow-hidden border-2 border-[#D4B896]">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-[#5D4E37]" />
                    )}
                  </div>

                  <Edit2
                    className="absolute -top-3 -right-3 w-10 h-10 p-2 bg-[#5D4E37] text-white rounded-full cursor-pointer shadow-lg"
                    onClick={() => avatarInputRef.current.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {avatar && (
                  <button
                    onClick={removeAvatar}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col">
                <label className="text-[#5D4E37] font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-[#D4B896] rounded-lg p-2 focus:outline-none focus:border-[#8B7355]"
                  placeholder="Enter new username"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-[#5D4E37] font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[#D4B896] rounded-lg p-2 focus:outline-none focus:border-[#8B7355]"
                  placeholder="Enter new email"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-[#5D4E37] font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-[#D4B896] rounded-lg p-2 focus:outline-none focus:border-[#8B7355]"
                  placeholder="Enter phone number"
                />
              </div>

              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#5D4E37] transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h1 className="text-2xl font-bold text-[#5D4E37] mb-4">Notifications</h1>
              <p className="text-[#8B7355]">
                Notifications when new books are dropped in the library system.
              </p>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-2xl font-bold text-[#5D4E37] mb-4">Frequently Asked Questions</h1>
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#D4B896] rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between p-4 bg-[#F5E6D3] font-medium text-[#5D4E37]"
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  >
                    {faq.question}
                    <ChevronDown
                      className={`transform transition-transform ${openFAQ === idx ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFAQ === idx && (
                    <div className="p-4 bg-white text-[#8B7355]">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
