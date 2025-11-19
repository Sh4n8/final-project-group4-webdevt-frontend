// src/pages/User/UserLibrary.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

const BookCard = ({ book, onView, onRemove }) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/300x450?text=No+Cover";

  return (
    <div
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer flex flex-col"
      style={{ background: theme.panel }}
      onClick={() => onView(book.googleId)}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(book.googleId);
        }}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center hover:bg-red-600"
        style={{ fontFamily: "'Arial', 'Helvetica', sans-serif" }}
        title="Remove"
      >
        ×
      </button>

      {/* FULL COVER DISPLAY — FIXED */}
      <div className="w-full h-56 bg-white flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={book.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Cover";
          }}
        />
      </div>

      {/* Book details */}
      <div className="p-3 flex flex-col flex-1">
        {/* Multi-line title */}
        <h3
          className="font-semibold text-sm leading-tight line-clamp-2"
          style={{
            color: theme.text,
            fontFamily: "'Arial', 'Helvetica', sans-serif",
          }}
        >
          {book.title}
        </h3>

        {/* Multi-line authors */}
        <p
          className="text-xs mt-1 leading-tight line-clamp-2"
          style={{
            color: "#6b5446",
            fontFamily: "'Arial', 'Helvetica', sans-serif",
          }}
        >
          {authors}
        </p>

        {book.category && (
          <p
            className="text-xs mt-1"
            style={{
              color: theme.accent,
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            {book.category}
          </p>
        )}
      </div>
    </div>
  );
};

const LibrarySection = ({ title, books, onView, onRemove, emptyMessage }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-bold"
          style={{
            color: theme.text,
            fontFamily: "'Arial', 'Helvetica', sans-serif",
          }}
        >
          {title}
          <span
            className="text-sm font-normal ml-2"
            style={{
              color: "#6b5446",
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
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
          <p
            className="text-sm"
            style={{
              color: "#6b5446",
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
};

const UserLibrary = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for different reading lists
  const [readingList, setReadingList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's saved books from backend
    // For now, using mock data from localStorage
    const loadSavedBooks = () => {
      try {
        const savedReadingList = JSON.parse(
          localStorage.getItem("readingList") || "[]"
        );
        const savedFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        const savedThesis = JSON.parse(localStorage.getItem("thesis") || "[]");
        const savedJournals = JSON.parse(
          localStorage.getItem("journals") || "[]"
        );

        setReadingList(savedReadingList);
        setFavorites(savedFavorites);
        setThesis(savedThesis);
        setJournals(savedJournals);
      } catch (err) {
        console.error("Error loading saved books:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedBooks();
  }, []);

  const handleView = (googleId) => {
    navigate(`/dashboard/book/${googleId}`);
  };

  const handleRemove = (googleId, listName) => {
    // TODO: Remove from backend
    // For now, remove from localStorage
    const currentList = JSON.parse(localStorage.getItem(listName) || "[]");
    const updatedList = currentList.filter(
      (book) => book.googleId !== googleId
    );
    localStorage.setItem(listName, JSON.stringify(updatedList));

    // Update state
    switch (listName) {
      case "readingList":
        setReadingList(updatedList);
        break;
      case "favorites":
        setFavorites(updatedList);
        break;
      case "thesis":
        setThesis(updatedList);
        break;
      case "journals":
        setJournals(updatedList);
        break;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          fontFamily: "'Arial', 'Helvetica', sans-serif",
        }}
      >
        <UserNavBar />
        <div className="container mx-auto px-6 py-8 flex justify-center">
          <div
            className="animate-pulse text-lg"
            style={{
              color: theme.text,
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            Loading your library...
          </div>
        </div>
      </div>
    );
  }

  const totalBooks =
    readingList.length + favorites.length + thesis.length + journals.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      }}
    >
      <UserNavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{
              color: theme.text,
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            My Library
          </h1>
          <p
            className="text-sm mt-2"
            style={{
              color: "#6b5446",
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            {totalBooks} {totalBooks === 1 ? "book" : "books"} in your personal
            collection
          </p>
        </div>

        <LibrarySection
          title="My Reading List"
          books={readingList}
          onView={handleView}
          onRemove={(id) => handleRemove(id, "readingList")}
          emptyMessage="No books in your reading list yet. Start exploring and add books!"
        />

        <LibrarySection
          title="Favorites"
          books={favorites}
          onView={handleView}
          onRemove={(id) => handleRemove(id, "favorites")}
          emptyMessage="No favorite books yet. Mark books as favorites to see them here!"
        />

        <LibrarySection
          title="Thesis Materials"
          books={thesis}
          onView={handleView}
          onRemove={(id) => handleRemove(id, "thesis")}
          emptyMessage="No thesis materials saved yet."
        />

        <LibrarySection
          title="Journals & Research"
          books={journals}
          onView={handleView}
          onRemove={(id) => handleRemove(id, "journals")}
          emptyMessage="No journals saved yet."
        />
      </div>
    </div>
  );
};

export default UserLibrary;
