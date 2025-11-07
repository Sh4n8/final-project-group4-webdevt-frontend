import React,{useState} from "react";

export default function AdminBooks() {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic" },
    { id: 2, title: "1984", author: "George Orwell", category: "Dystopian" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction" },
  ]);

  const [form, setForm] = useState({ id: null, title: "", author: "", category: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.category) return;

    if (isEditing) {
      setBooks(books.map((book) => (book.id === form.id ? form : book)));
      setIsEditing(false);
    } else {
      const newBook = { ...form, id: books.length ? books[books.length - 1].id + 1 : 1 };
      setBooks([...books, newBook]);
    }
    setForm({ id: null, title: "", author: "", category: "" });
  };

  const handleEdit = (book) => {
    setForm(book);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="p-6 bg-[#F5E6D3] min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold text-[#5D4E37] mb-6">Books Management</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#5D4E37] text-white px-4 py-2 rounded hover:bg-[#7B624A] transition"
        >
          {isEditing ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAD7BE] text-[#5D4E37]">
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-[#EAD7BE] hover:bg-[#FFF9F2]">
                <td className="p-3">{book.id}</td>
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
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
