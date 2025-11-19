import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {Search, ArrowUpDown, Eye, Edit, Trash2, Download, Plus,} from "lucide-react";

export default function AdminBooks() {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", views: 2847 },
    { id: 2, title: "1984", author: "George Orwell", category: "Dystopian", views: 5123 },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", views: 3981 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", views: 2671 },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", views: 1892 },
  ]);

  const [form, setForm] = useState({ id: null, title: "", author: "", category: "", views: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Search + Sort Logic
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [books, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.category) return;

    if (isEditing) {
      setBooks(books.map(book => (book.id === form.id ? { ...form } : book)));
      setIsEditing(false);
    } else {
      const newBook = {
        ...form,
        id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
        views: form.views || 0,
      };
      setBooks([...books, newBook]);
    }
    setForm({ id: null, title: "", author: "", category: "", views: 0 });
  };

  const handleEdit = (book) => {
    setForm(book);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(93, 78, 55);
    doc.text("Library Books Catalog", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Books: ${books.length}`, 14, 36);

    const tableData = filteredAndSortedBooks.map(book => [
      book.id.toString(),
      book.title,
      book.author,
      book.category,
      book.views.toLocaleString(),
    ]);

    autoTable(doc, {
      head: [["ID", "Title", "Author", "Category", "Views"]],
      body: tableData,
      startY: 45,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [93, 78, 55], textColor: 255 },
      alternateRowStyles: { fillColor: [252, 245, 235] },
    });

    doc.save("library-books-catalog.pdf");
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-[#FAF5F0] via-[#F5E6D3] to-[#E8D8C3] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#4A3F35]">Books Management</h1>
            <p className="text-[#6B5B3F] mt-2">Manage your library collection</p>
          </div>
          <button
            onClick={exportToPDF}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Export to PDF
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-[#8B6F47]" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-md focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
          />
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <input
              type="text"
              placeholder="Book Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-amber-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-amber-200"
              required
            />
            <button
              type="submit"
              className="bg-[#8B6F47] hover:bg-[#7B624A] text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              {isEditing ? "Update Book" : "Add New Book"}
            </button>
          </div>
        </form>

        {/* Books Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8B6F47] to-[#A07D5A] text-white">
                <tr>
                  <th className="px-6 py-5 text-left">ID</th>
                  <th className="px-6 py-5 text-left cursor-pointer hover:bg-white/10 transition" onClick={() => handleSort("title")}>
                    <div className="flex items-center gap-2">
                      Title <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left cursor-pointer hover:bg-white/10 transition" onClick={() => handleSort("author")}>
                    <div className="flex items-center gap-2">
                      Author <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left">Category</th>
                  <th className="px-6 py-5 text-left cursor-pointer hover:bg-white/10 transition" onClick={() => handleSort("views")}>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Views <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedBooks.map((book) => (
                  <tr key={book.id} className="border-b border-amber-100 hover:bg-amber-50/50 transition">
                    <td className="px-6 py-5 font-medium text-[#4A3F35]">{book.id}</td>
                    <td className="px-6 py-5 font-semibold text-[#4A3F35]">{book.title}</td>
                    <td className="px-6 py-5 text-[#5D4E37]">{book.author}</td>
                    <td className="px-6 py-5">
                      <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-[#4A3F35]">{book.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-amber-700 hover:bg-amber-100 p-3 rounded-xl transition"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-red-600 hover:bg-red-100 p-3 rounded-xl transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedBooks.length === 0 && (
              <div className="text-center py-12 text-[#8B6F47]">
                <p className="text-xl">No books found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}