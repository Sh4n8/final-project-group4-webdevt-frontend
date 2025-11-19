// src/pages/User/UserLibrary.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";

const theme = {
  bg: "#f8f1e4",
  text: "#3b2f2f",
  accent: "#7b4b26",
  muted: "#6b5446",
};

const BookCard = ({ book, onRemove }) => {
  const navigate = useNavigate();
  const authors = Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown";
  const cover = book.thumbnail || "https://via.placeholder.com/300x450/e6d6b8/7b4b26?text=No+Cover";

  return (
    <div
      onClick={() => navigate(`/dashboard/book/${book.googleId}`)}
      className="flex-none w-36 cursor-pointer group relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(book.googleId);
        }}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center hover:bg-red-600"
        title="Remove"
      >
        X
      </button>

      <div className="bg-white rounded-md shadow-sm group-hover:shadow-md transition-all duration-300 p-3 border border-transparent group-hover:border-[#d4b896]">
        <img src={cover} alt={book.title} className="w-full h-52 object-contain" loading="lazy" />
      </div>

      <div className="mt-2 text-center">
        <h3 className="text-xs leading-tight line-clamp-2" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          {book.title}
        </h3>
        <p className="text-xs mt-1 leading-tight" style={{ color: theme.muted }}>
          {authors}
        </p>
      </div>
    </div>
  );
};

const EmptyShelf = ({ message }) => (
  <div className="py-8 text-center">
    <p className="text-sm italic" style={{ color: theme.muted, fontFamily: "'Georgia', serif" }}>
      {message}
    </p>
  </div>
);

const LibraryShelf = ({ title, books, onRemove, icon }) => {
  if (books.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-base mb-4 flex items-center gap-2" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          {icon} {title}
        </h2>
        <EmptyShelf message={`No books in ${title.toLowerCase()} yet.`} />
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-base mb-4 flex items-center gap-2" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
        {icon} {title}
        <span className="text-xs" style={{ color: theme.muted }}>
          ({books.length})
        </span>
      </h2>

      <div className="overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex gap-6">
          {books.map(book => (
            <BookCard key={book.googleId || book._id} book={book} onRemove={onRemove} />
          ))}
        </div>
      </div>

      <div className="text-right mt-1">
        <span className="text-xs italic" style={{ color: theme.muted }}>
          ← swipe →
        </span>
      </div>
    </section>
  );
};

const UserLibrary = () => {
  const { user } = useContext(AuthContext);
  const [readingList, setReadingList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      try {
        setReadingList(JSON.parse(localStorage.getItem("readingList") || "[]"));
        setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
        setThesis(JSON.parse(localStorage.getItem("thesis") || "[]"));
        setJournals(JSON.parse(localStorage.getItem("journals") || "[]"));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const removeFromList = (id, setter, key) => {
    setter(prev => {
      const updated = prev.filter(b => b.googleId !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const total = readingList.length + favorites.length + thesis.length + journals.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <p className="text-sm" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          Loading your library...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#d4b896]">
        <UserNavBar />
      </div>

      {/* Main Content - EXACT same as Educational Library */}
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {/* BIG, BEAUTIFUL TITLE - matches 100% */}
        <h1 className="text-4xl text-center mb-10" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          My Library
        </h1>

        {/* Subtle total count */}
        <p className="text-center text-sm mb-12" style={{ color: theme.muted }}>
          {total === 0 ? "Your personal collection is waiting to grow..." : `${total} book${total > 1 ? 's' : ''} in your library`}
        </p>

        {/* Shelves */}
        <LibraryShelf
          title="Reading List"
          books={readingList}
          icon="Open Book"
          onRemove={(id) => removeFromList(id, setReadingList, "readingList")}
        />
        <LibraryShelf
          title="Favorites"
          books={favorites}
          icon="Red Heart"
          onRemove={(id) => removeFromList(id, setFavorites, "favorites")}
        />
        <LibraryShelf
          title="Thesis"
          books={thesis}
          icon="Graduation Cap"
          onRemove={(id) => removeFromList(id, setThesis, "thesis")}
        />
        <LibraryShelf
          title="Journals"
          books={journals}
          icon="Clipboard"
          onRemove={(id) => removeFromList(id, setJournals, "journals")}
        />
      </div>
    </div>
  );
};

export default UserLibrary;