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

// 📌 Improved BookCard (FULL cover display + nicer UI)
const BookCard = ({ book, onView }) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/300x450?text=No+Cover";

  return (
    <div
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      style={{ background: theme.panel }}
      onClick={() => onView(book.googleId)}
    >
      {/* FIXED: Full image cover display */}
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

      {/* Card Details */}
      <div className="p-3 flex flex-col flex-1">
        {/* FIXED: Multi-line title */}
        <h3
          className="font-semibold text-sm leading-tight line-clamp-2"
          style={{ color: theme.text, fontFamily: "'Arial', 'Helvetica', sans-serif" }}
        >
          {book.title}
        </h3>

        {/* FIXED: Multi-line authors */}
        <p
          className="text-xs mt-1 leading-tight line-clamp-2"
          style={{ color: "#6b5446", fontFamily: "'Arial', 'Helvetica', sans-serif" }}
        >
          {authors}
        </p>

        {book.averageRating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-600 text-xs">★</span>
            <span className="text-xs" style={{ color: theme.accent, fontFamily: "'Arial', 'Helvetica', sans-serif" }}>
              {book.averageRating}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 📌 Updated Section Component (cleaner spacing + alignment)
const Section = ({ title, books, loading, onView, showAll, toggleShowAll }) => {
  const visibleBooks = showAll ? books : books.slice(0, 6);

  return (
    <div className="mb-12">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: theme.text, fontFamily: "'Arial', 'Helvetica', sans-serif" }}
        >
          {title}
        </h2>

        {books.length > 6 && (
          <button
            onClick={toggleShowAll}
            className="text-sm font-medium underline hover:opacity-80"
            style={{ color: theme.accent, fontFamily: "'Arial', 'Helvetica', sans-serif" }}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* Book grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl animate-pulse"
              style={{ background: "#eadfc6" }}
            ></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {visibleBooks.map((b) => (
            <BookCard key={b.googleId} book={b} onView={onView} />
          ))}
        </div>
      ) : (
        <p className="text-sm mt-2" style={{ color: "#6b5446", fontFamily: "'Arial', 'Helvetica', sans-serif" }}>
          No results found.
        </p>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // States
  const [mathematics, setMathematics] = useState([]);
  const [programming, setProgramming] = useState([]);
  const [physics, setPhysics] = useState([]);
  const [engineering, setEngineering] = useState([]);
  const [chemistry, setChemistry] = useState([]);
  const [biology, setBiology] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [history, setHistory] = useState([]);
  const [economics, setEconomics] = useState([]);
  const [psychology, setPsychology] = useState([]);

  const [loadingMath, setLoadingMath] = useState(true);
  const [loadingProg, setLoadingProg] = useState(true);
  const [loadingPhys, setLoadingPhys] = useState(true);
  const [loadingEng, setLoadingEng] = useState(true);
  const [loadingChem, setLoadingChem] = useState(true);
  const [loadingBio, setLoadingBio] = useState(true);
  const [loadingMed, setLoadingMed] = useState(true);
  const [loadingHist, setLoadingHist] = useState(true);
  const [loadingEcon, setLoadingEcon] = useState(true);
  const [loadingPsych, setLoadingPsych] = useState(true);

  const [showAllMath, setShowAllMath] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [showAllPhys, setShowAllPhys] = useState(false);
  const [showAllEng, setShowAllEng] = useState(false);
  const [showAllChem, setShowAllChem] = useState(false);
  const [showAllBio, setShowAllBio] = useState(false);
  const [showAllMed, setShowAllMed] = useState(false);
  const [showAllHist, setShowAllHist] = useState(false);
  const [showAllEcon, setShowAllEcon] = useState(false);
  const [showAllPsych, setShowAllPsych] = useState(false);

  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem("dashboardSearch") || "";
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    return sessionStorage.getItem("dashboardCategory") || "all";
  });

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mathematics", label: "Mathematics" },
    { value: "programming", label: "Programming & Computer Science" },
    { value: "physics", label: "Physics" },
    { value: "engineering", label: "Engineering" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "medicine", label: "Medicine" },
    { value: "history", label: "History" },
    { value: "economics", label: "Economics" },
    { value: "psychology", label: "Psychology" },
  ];

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

    fetchCategoryBooks("mathematics", setMathematics, setLoadingMath);
    fetchCategoryBooks("programming", setProgramming, setLoadingProg);
    fetchCategoryBooks("physics", setPhysics, setLoadingPhys);
    fetchCategoryBooks("engineering", setEngineering, setLoadingEng);
    fetchCategoryBooks("chemistry", setChemistry, setLoadingChem);
    fetchCategoryBooks("biology", setBiology, setLoadingBio);
    fetchCategoryBooks("medicine", setMedicine, setLoadingMed);
    fetchCategoryBooks("history", setHistory, setLoadingHist);
    fetchCategoryBooks("economics", setEconomics, setLoadingEcon);
    fetchCategoryBooks("psychology", setPsychology, setLoadingPsych);
  }, []);

  const handleView = (googleId) => {
    sessionStorage.setItem("dashboardCategory", selectedCategory);
    sessionStorage.setItem("dashboardSearch", searchQuery);
    navigate(`/dashboard/book/${googleId}`);
  };

  const filterBooks = (books) => {
    if (!searchQuery) return books;
    const q = searchQuery.toLowerCase();
    return books.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const authors = Array.isArray(book.authors)
        ? book.authors.join(" ").toLowerCase()
        : "";
      return title.includes(q) || authors.includes(q);
    });
  };

  const getVisibleSections = () => {
    const sections = [];

    const pushSection = (value, title, books, loading, showAll, toggle) => {
      if (selectedCategory === "all" || selectedCategory === value) {
        sections.push({
          title,
          books: filterBooks(books),
          loading,
          showAll,
          toggleShowAll: toggle,
        });
      }
    };

    pushSection("mathematics", "Mathematics", mathematics, loadingMath, showAllMath, () =>
      setShowAllMath(!showAllMath)
    );
    pushSection("programming", "Programming & Computer Science", programming, loadingProg, showAllProg, () =>
      setShowAllProg(!showAllProg)
    );
    pushSection("physics", "Physics", physics, loadingPhys, showAllPhys, () =>
      setShowAllPhys(!showAllPhys)
    );
    pushSection("engineering", "Engineering", engineering, loadingEng, showAllEng, () =>
      setShowAllEng(!showAllEng)
    );
    pushSection("chemistry", "Chemistry", chemistry, loadingChem, showAllChem, () =>
      setShowAllChem(!showAllChem)
    );
    pushSection("biology", "Biology", biology, loadingBio, showAllBio, () =>
      setShowAllBio(!showAllBio)
    );
    pushSection("medicine", "Medicine", medicine, loadingMed, showAllMed, () =>
      setShowAllMed(!showAllMed)
    );
    pushSection("history", "History", history, loadingHist, showAllHist, () =>
      setShowAllHist(!showAllHist)
    );
    pushSection("economics", "Economics", economics, loadingEcon, showAllEcon, () =>
      setShowAllEcon(!showAllEcon)
    );
    pushSection("psychology", "Psychology", psychology, loadingPsych, showAllPsych, () =>
      setShowAllPsych(!showAllPsych)
    );

    return sections;
  };

  const selectedCategoryLabel =
    categories.find((cat) => cat.value === selectedCategory)?.label ||
    "All Categories";

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Arial', 'Helvetica', sans-serif" }}>
      <UserNavBar />

      <div className="container mx-auto px-6 py-8">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: theme.text, fontFamily: "'Arial', 'Helvetica', sans-serif" }}
        >
          Educational Library
        </h1>

        {/* Search + Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">

          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                sessionStorage.setItem("dashboardSearch", e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                borderColor: "#D4B896",
                color: theme.text,
                fontFamily: "'Arial', 'Helvetica', sans-serif"
              }}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: theme.accent }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Dropdown */}
          <div className="relative sm:w-64">
            <button
              onClick={() =>
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
              }
              className="w-full px-4 py-3 border rounded-lg text-sm font-medium flex items-center justify-between focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                borderColor: "#D4B896",
                color: theme.text,
                fontFamily: "'Arial', 'Helvetica', sans-serif"
              }}
            >
              <span>{selectedCategoryLabel}</span>

              <svg
                className={`w-4 h-4 transition-transform ${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isCategoryDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-full rounded-lg shadow-lg py-2 z-50 max-h-64 overflow-y-auto"
                style={{ background: "#fff" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      sessionStorage.setItem("dashboardCategory", cat.value);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{
                      color: theme.text,
                      background:
                        selectedCategory === cat.value
                          ? theme.panel
                          : "transparent",
                      fontFamily: "'Arial', 'Helvetica', sans-serif"
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Render Sections */}
        {getVisibleSections().map((section) => (
          <Section
            key={section.title}
            title={section.title}
            books={section.books}
            loading={section.loading}
            onView={handleView}
            showAll={section.showAll}
            toggleShowAll={section.toggleShowAll}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;