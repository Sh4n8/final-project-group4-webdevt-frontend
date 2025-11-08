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

const BookCard = ({ book, onView }) => {
  const cover =
    book.formats["image/jpeg"] ||
    "https://via.placeholder.com/200x300?text=No+Cover";
  const author =
    book.authors && book.authors.length > 0
      ? book.authors[0].name
      : "Unknown Author";

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
      style={{ background: theme.panel }}
      onClick={() => onView(book.id)}
    >
      <img src={cover} alt={book.title} className="w-full h-44 object-cover" />
      <div className="p-3">
        <h3
          className="text-sm font-semibold truncate"
          style={{ color: theme.text }}
        >
          {book.title}
        </h3>
        <p className="text-xs mt-1" style={{ color: "#6b5446" }}>
          {author}
        </p>
      </div>
    </div>
  );
};

const Section = ({
  title,
  books,
  loading,
  onView,
  showAll,
  toggleShowAll,
}) => {
  const visibleBooks = showAll ? books : books.slice(0, 5);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif" style={{ color: theme.text }}>
          {title}
        </h2>
        {books.length > 5 && (
          <button
            onClick={toggleShowAll}
            className="text-sm font-medium underline hover:text-brown-700"
            style={{ color: theme.accent }}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-lg animate-pulse"
              style={{ background: "#eadfc6" }}
            ></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {visibleBooks.map((b) => (
            <BookCard key={b.id} book={b} onView={onView} />
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "#6b5446" }}>
          No results.
        </p>
      )}
    </div>
  );
};

const UserLibrary = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);
  const [journals, setJournals] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [digital, setDigital] = useState([]);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [loadingAcademic, setLoadingAcademic] = useState(true);
  const [loadingDigital, setLoadingDigital] = useState(true);

  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllJournals, setShowAllJournals] = useState(false);
  const [showAllAcademic, setShowAllAcademic] = useState(false);
  const [showAllDigital, setShowAllDigital] = useState(false);

  useEffect(() => {
    const fetchBooks = async (query, setter, loaderSetter) => {
      loaderSetter(true);
      try {
        const res = await fetch(
          `https://gutendex.com/books/?search=${encodeURIComponent(
            query
          )}&mime_type=text&languages=en&page=1`
        );
        const data = await res.json();
        setter(data.results || []);
      } catch (err) {
        console.error(`${query} fetch error:`, err);
      } finally {
        loaderSetter(false);
      }
    };

    fetchBooks("fiction", setTrending, setLoadingTrending); // Trending
    fetchBooks("education", setJournals, setLoadingJournals); // E-Resources & Journals
    fetchBooks("academic", setAcademic, setLoadingAcademic); // Academic References
  }, []);

  const handleView = (id) => {
    navigate(`/dashboard/book/${id}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}>
      <UserNavBar />
      <div className="container mx-auto px-6 py-8">
        <Section
          title="Trending"
          books={trending}
          loading={loadingTrending}
          onView={handleView}
          showAll={showAllTrending}
          toggleShowAll={() => setShowAllTrending(!showAllTrending)}
        />

        <Section
          title="E-Resources & Journals"
          books={journals}
          loading={loadingJournals}
          onView={handleView}
          showAll={showAllJournals}
          toggleShowAll={() => setShowAllJournals(!showAllJournals)}
        />

        <Section
          title="Academic References"
          books={academic}
          loading={loadingAcademic}
          onView={handleView}
          showAll={showAllAcademic}
          toggleShowAll={() => setShowAllAcademic(!showAllAcademic)}
        />
      </div>
    </div>
  );
};

export default UserLibrary;
