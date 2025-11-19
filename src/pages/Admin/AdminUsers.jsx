import React, { useState, useMemo } from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {Search, ArrowUpDown, Download, Plus, Edit, Trash2, Users, Mail, Shield, Circle,} from 'lucide-react';

// Helper: Format "last seen" time" beautifully
const formatLastSeen = (date) => {
  if (!date) return { text: 'Never', color: 'text-gray-400' };

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return { text: 'Active now', color: 'text-emerald-600', dot: 'bg-emerald-500' };
  if (diffMins < 60) return { text: `Active ${diffMins}m ago`, color: 'text-emerald-600', dot: 'bg-emerald-500' };
  if (diffHours < 24) return { text: `Active ${diffHours}h ago`, color: 'text-amber-600', dot: 'bg-amber-500' };
  if (diffDays < 7) return { text: `Active ${diffDays}d ago`, color: 'text-orange-600', dot: 'bg-orange-500' };
  return { text: 'Inactive', color: 'text-gray-400', dot: 'bg-gray-400' };
};

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Member", lastSeen: new Date(Date.now() - 2 * 60000) }, // 2 mins ago
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Librarian", lastSeen: new Date(Date.now() - 1000) }, // now
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin", lastSeen: new Date(Date.now() - 2 * 3600000) }, // 2h ago
    { id: 4, name: "Mike Johnson", email: "mike@example.com", role: "Member", lastSeen: new Date(Date.now() - 3 * 86400000) }, // 3 days ago
    { id: 5, name: "Sarah Lee", email: "sarah@example.com", role: "Member", lastSeen: null }, // never
  ]);

  const [form, setForm] = useState({ id: null, name: "", email: "", role: "Member" });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "lastSeen") {
          aVal = aVal || 0;
          bVal = bVal || 0;
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [users, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (isEditing) {
      setUsers(users.map(u => u.id === form.id ? { ...u, ...form } : u));
      setIsEditing(false);
    } else {
      setUsers([...users, {
        ...form,
        id: Math.max(...users.map(u => u.id)) + 1,
        lastSeen: new Date(), // new users are active now
      }]);
    }
    setForm({ id: null, name: "", email: "", role: "Member" });
  };

  const handleEdit = (user) => {
    setForm({ id: user.id, name: user.name, email: user.email, role: user.role });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user permanently?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      Admin: "bg-rose-100 text-rose-800 border-rose-200",
      Librarian: "bg-amber-100 text-amber-800 border-amber-200",
      Member: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return `px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[role] || styles.Member}`;
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-[#FAF5F0] via-[#F5E6D3] to-[#E8D8C3] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#4A3F35] flex items-center gap-3">
              <Users className="w-10 h-10 text-amber-700" />
              Users Management
            </h1>
            <p className="text-[#6B5B3F] mt-2">Track user activity and manage access</p>
          </div>
          <button
            onClick={() => {
              const doc = new jsPDF();
              doc.setFontSize(20);
              doc.setTextColor(93, 78, 55);
              doc.text("Library Users Report", 14, 20);
              doc.setFontSize(10);
              doc.setTextColor(100);
              doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

              const data = filteredAndSortedUsers.map(u => [
                u.id, u.name, u.email, u.role,
                u.lastSeen ? formatLastSeen(u.lastSeen).text : "Never"
              ]);

              autoTable(doc, {
                head: [["ID", "Name", "Email", "Role", "Last Seen"]],
                body: data,
                startY: 40,
                theme: "grid",
                headStyles: { fillColor: [93, 78, 55], textColor: 255 },
              });
              doc.save("library-users-report.pdf");
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-[#8B6F47]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-md focus:outline-none focus:ring-4 focus:ring-amber-200"
          />
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200" required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200" required />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200">
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="bg-[#8B6F47] hover:bg-[#7B624A] text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-lg transition hover:scale-105">
              <Plus className="w-5 h-5" />
              {isEditing ? "Update" : "Add User"}
            </button>
          </div>
        </form>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8B6F47] to-[#A07D5A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-white/10" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">Name <ArrowUpDown className="w-4 h-4" /></div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-white/10" onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email <ArrowUpDown className="w-4 h-4" /></div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-white/10" onClick={() => handleSort("lastSeen")}>
                    <div className="flex items-center gap-2">Last Seen <ArrowUpDown className="w-4 h-4" /></div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filteredAndSortedUsers.map((user) => {
                  const status = formatLastSeen(user.lastSeen);
                  return (
                    <tr key={user.id} className="hover:bg-amber-50/50 transition text-sm">
                      <td className="px-6 py-4 font-medium text-[#4A3F35]">{user.id}</td>
                      <td className="px-6 py-4 font-medium text-[#4A3F35]">{user.name}</td>
                      <td className="px-6 py-4 text-[#5D4E37]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={getRoleBadge(user.role)}>
                          {user.role === "Admin" && <Shield className="w-3.5 h-3.5 inline mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Circle className={`w-3 h-3 fill-current ${status.dot}`} />
                          <span className={`font-medium ${status.color}`}>{status.text}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(user)} className="text-amber-700 hover:bg-amber-100 p-2.5 rounded-lg transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:bg-red-100 p-2.5 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}