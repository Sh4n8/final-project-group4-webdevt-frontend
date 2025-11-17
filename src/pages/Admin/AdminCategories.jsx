import React, {useState} from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Science" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    if (isEditing) {
      setCategories(categories.map((cat) => (cat.id === form.id ? form : cat)));
      setIsEditing(false);
    } else {
      const newCategory = { ...form, id: categories.length ? categories[categories.length - 1].id + 1 : 1 };
      setCategories([...categories, newCategory]);
    }
    setForm({ id: null, name: "" });
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#F5E6D3] min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold text-[#5D4E37] mb-6">Categories Management</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by category name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#5D4E37] text-white px-4 py-2 rounded hover:bg-[#7B624A] transition"
        >
          {isEditing ? "Update Category" : "Add Category"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAD7BE] text-[#5D4E37]">
              <th className="p-3">ID</th>
              <th className="p-3">Category Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#EAD7BE] hover:bg-[#FFF9F2]">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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