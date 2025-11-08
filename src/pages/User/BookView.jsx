// Updated BookView.jsx (aesthetic improvements, reduced spacing)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

const theme = {
  bg: "#f8f1e4",
  panel: "#f2e1c3",
  text: "#3b2f2f",
  accent: "#7b4b26",
  muted: "#6b5446",
};

const BookView = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`https://gutendex.com/books/${bookId}`);
        if (!res.ok) throw new Error("Failed to load book details.");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (bookId) fetchBook();
  }, [bookId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-2xl" style={{ background: theme.bg, color: theme.text }}>
        Loading book details...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-2xl" style={{ background: theme.bg, color: theme.text }}>
        Error: {error}
      </div>
    );

  if (!book)
    return (
      <div className="h-screen flex items-center justify-center text-2xl" style={{ background: theme.bg, color: theme.text }}>
        Book not found.
      </div>
    );

  const cover = book.formats["image/jpeg"];
  const authors = book.authors?.map((a) => a.name).join(", ") || "Unknown Author";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg, color: theme.text }}>
      <UserNavbar />

      <div className="flex flex-col md:flex-row items-center justify-center flex-1 px-8 py-12 gap-4 md:gap-6">
        {/* Book Cover */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          {cover ? (
            <img src={cover} alt={book.title} className="w-80 md:w-[30rem] rounded-3xl shadow-xl" />
          ) : (
            <div className="w-64 h-[26rem] bg-gray-300 rounded-3xl"></div>
          )}
        </div>

        {/* Book Details */}
        <div className="max-w-3xl rounded-3xl shadow-lg p-8 md:p-10" style={{ background: theme.panel }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-serif leading-tight">{book.title}</h1>
          <p className="text-lg mb-6 italic" style={{ color: theme.muted }}>by {authors}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-6 text-base" style={{ color: theme.muted }}>
            <div className="flex items-center gap-1"><span>👁️</span> <span>2.5M Reads</span></div>
            <div className="flex items-center gap-1"><span>❤️</span> <span>10.3K Favorites</span></div>
            <div className="flex items-center gap-1"><span>🧾</span> <span>{(book.bookshelves?.length || 0) + 1} Parts</span></div>
          </div>

          <h2 className="text-2xl font-semibold mb-2 font-serif">Abstract</h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: theme.muted }}>
            {book.subjects?.length > 0 ? `Subjects: ${book.subjects.slice(0, 6).join(", ")}` : "No description available."}
          </p>

          <button
            onClick={() => navigate(`/reader/${bookId}`)}
            className="px-8 py-3 rounded-xl font-semibold text-lg shadow-md transition-transform duration-200 hover:scale-105"
            style={{ background: theme.accent, color: "#fff" }}
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookView;
