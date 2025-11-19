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

const BookCard = ({ book, onView, onRemove }) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover";

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative group"
      style={{ background: theme.panel }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(book.googleId);
        }}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center hover:bg-red-600"
        title="Remove from library"
      >
        X
      </button>

      <div className="cursor-pointer" onClick={() => onView(book.googleId)}>
        <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={thumbnail}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/128x192?text=No+Cover";
            }}
          />
        </div>
        <div className="p-3">
          <h3
            className="text-sm font-semibold line-clamp-2"
            style={{ color: theme.text }}
          >
            {book.title}
          </h3>
          <p className="text-xs mt-1 line-clamp-1" style={{ color: "#6b5446" }}>
            {authors}
          </p>
          {book.category && (
            <p className="text-xs mt-1" style={{ color: theme.accent }}>
              {book.category}
            </p>
          )}
        </div>
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
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-serif font-bold"
          style={{ color: theme.text }}
        >
          {title}
          <span
            className="text-sm font-normal ml-2"
            style={{ color: "#6b5446" }}
          >
            ({books.length} books)
          </span>
        </h2>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.googleId || book._id}
              book={book}
              onView={onView}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 rounded-lg"
          style={{ background: theme.panel }}
        >
          <p className="text-sm" style={{ color: "#6b5446" }}>
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
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
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        <UserNavBar />
        <div className="container mx-auto px-6 py-8 flex justify-center">
          <div className="animate-pulse text-lg" style={{ color: theme.text }}>
            Loading your library...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}
    >
      <UserNavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-serif font-bold"
            style={{ color: theme.text }}
          >
            My Library
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6b5446" }}>
            {totalBooks} {totalBooks === 1 ? "book" : "books"} in your personal
            collection
          </p>
        </div>

        <LibrarySection
          title="My Reading List"
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