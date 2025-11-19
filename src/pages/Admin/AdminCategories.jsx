import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  BookOpen,
} from "lucide-react";

export default function AdminCategories() {
  // Now each category has a bookCount!
  const [categories, setCategories] = useState([
    { id: 1, name: "Fiction", bookCount: 248 },
    { id: 2, name: "Non-Fiction", bookCount: 189 },
    { id: 3, name: "Science", bookCount: 97 },
    { id: 4, name: "Fantasy", bookCount: 127 },
    { id: 5, name: "Mystery", bookCount: 84 },
    { id: 6, name: "Romance", bookCount: 156 },
  ]);

  const [form, setForm] = useState({ id: null, name: "", bookCount: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing) {
      setCategories(categories.map((cat) => (cat.id === form.id ? { ...form, name: form.name.trim() } : cat)));
      setIsEditing(false);
    } else {
      const newCategory = {
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: form.name.trim(),
        bookCount: 0, // New categories start with 0 books
      };
      setCategories([...categories, newCategory]);
    }
    setForm({ id: null, name: "", bookCount: 0 });
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category? Books will not be deleted.")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-[#FAF5F0] via-[#F5E6D3] to-[#E8D8C3] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#4A3F35] flex items-center gap-3">
              <FolderOpen className="w-10 h-10 text-amber-700" />
              Categories Management
            </h1>
            <p className="text-[#6B5B3F] mt-2">Organize your library by genre and topic</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#4A3F35]">
              {categories.length}
            </p>
            <p className="text-sm text-[#8B6F47]">Total Categories</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-[#8B6F47]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-md focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
          />
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="flex flex-col sm:flex-row gap-5 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#5D4E37] mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Science Fiction, Biography, Poetry..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#8B6F47] hover:bg-[#7B624A] text-white font-semibold rounded-xl px-8 py-4 flex items-center justify-center gap-3 shadow-lg transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              {isEditing ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>

        {/* Categories Grid - Much nicer than table! */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition">
                    <FolderOpen className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#4A3F35]">{cat.name}</h3>
                    <p className="text-sm text-[#8B6F47] flex items-center gap-2 mt-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-semibold">{cat.bookCount}</span> book{cat.bookCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-amber-700 hover:bg-amber-100 p-3 rounded-xl transition"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:bg-red-100 p-3 rounded-xl transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-20 h-20 mx-auto text-amber-200 mb-4" />
            <p className="text-xl text-[#8B6F47]">No categories found</p>
            <p className="text-[#6B5B3F]">Try adjusting your search or add a new category.</p>
          </div>
        )}
      </div>
    </div>
  );
}