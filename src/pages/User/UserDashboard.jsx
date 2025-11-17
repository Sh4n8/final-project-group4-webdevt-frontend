// src/pages/User/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";
import { getBooksByCategory } from "../../lib/api";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

const BookCard = ({ book, onView }) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover";

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      style={{ background: theme.panel }}
      onClick={() => onView(book.googleId)}
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/128x192?text=No+Cover";
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
        {book.averageRating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-600 text-xs">★</span>
            <span className="text-xs" style={{ color: theme.accent }}>
              {book.averageRating}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, books, loading, onView, showAll, toggleShowAll }) => {
  const visibleBooks = showAll ? books : books.slice(0, 6);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-serif font-bold"
          style={{ color: theme.text }}
        >
          {title}
        </h2>
        {books.length > 6 && (
          <button
            onClick={toggleShowAll}
            className="text-sm font-medium underline hover:opacity-80"
            style={{ color: theme.accent }}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg animate-pulse"
              style={{ background: "#eadfc6" }}
            ></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleBooks.map((b) => (
            <BookCard key={b.googleId} book={b} onView={onView} />
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "#6b5446" }}>
          No results found.
        </p>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mathematics, setMathematics] = useState([]);
  const [programming, setProgramming] = useState([]);
  const [physics, setPhysics] = useState([]);
  const [engineering, setEngineering] = useState([]);

  const [loadingMath, setLoadingMath] = useState(true);
  const [loadingProg, setLoadingProg] = useState(true);
  const [loadingPhys, setLoadingPhys] = useState(true);
  const [loadingEng, setLoadingEng] = useState(true);

  const [showAllMath, setShowAllMath] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [showAllPhys, setShowAllPhys] = useState(false);
  const [showAllEng, setShowAllEng] = useState(false);

  useEffect(() => {
    const fetchCategoryBooks = async (category, setter, loaderSetter) => {
      loaderSetter(true);
      try {
        const res = await getBooksByCategory(category, 20);
        setter(res.data.books || []);
      } catch (err) {
        console.error(`${category} fetch error:`, err);
        setter([]);
      } finally {
        loaderSetter(false);
      }
    };

    // Fetch books for each educational category
    fetchCategoryBooks("mathematics", setMathematics, setLoadingMath);
    fetchCategoryBooks("programming", setProgramming, setLoadingProg);
    fetchCategoryBooks("physics", setPhysics, setLoadingPhys);
    fetchCategoryBooks("engineering", setEngineering, setLoadingEng);
  }, []);

  const handleView = (googleId) => {
    navigate(`/dashboard/book/${googleId}`);
  };

  return (
    <div
      style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}
    >
      <UserNavBar />
      <div className="container mx-auto px-6 py-8">
        <h1
          className="text-3xl font-serif font-bold mb-8"
          style={{ color: theme.text }}
        >
          Educational Library
        </h1>

        <Section
          title="Mathematics"
          books={mathematics}
          loading={loadingMath}
          onView={handleView}
          showAll={showAllMath}
          toggleShowAll={() => setShowAllMath(!showAllMath)}
        />

        <Section
          title="Programming & Computer Science"
          books={programming}
          loading={loadingProg}
          onView={handleView}
          showAll={showAllProg}
          toggleShowAll={() => setShowAllProg(!showAllProg)}
        />

        <Section
          title="Physics"
          books={physics}
          loading={loadingPhys}
          onView={handleView}
          showAll={showAllPhys}
          toggleShowAll={() => setShowAllPhys(!showAllPhys)}
        />

        <Section
          title="Engineering"
          books={engineering}
          loading={loadingEng}
          onView={handleView}
          showAll={showAllEng}
          toggleShowAll={() => setShowAllEng(!showAllEng)}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
