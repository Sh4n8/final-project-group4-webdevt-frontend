import React, {useState} from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Member" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Librarian" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin" },
  ]);

  const [form, setForm] = useState({ id: null, name: "", email: "", role: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;

    if (isEditing) {
      setUsers(users.map((user) => (user.id === form.id ? form : user)));
      setIsEditing(false);
    } else {
      const newUser = { ...form, id: users.length ? users[users.length - 1].id + 1 : 1 };
      setUsers([...users, newUser]);
    }
    setForm({ id: null, name: "", email: "", role: "" });
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#F5E6D3] min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold text-[#5D4E37] mb-6">Users Management</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Role (e.g. Member, Librarian, Admin)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#5D4E37] text-white px-4 py-2 rounded hover:bg-[#7B624A] transition"
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAD7BE] text-[#5D4E37]">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#EAD7BE] hover:bg-[#FFF9F2]">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
