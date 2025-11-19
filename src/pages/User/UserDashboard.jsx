// src/pages/User/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";
import { demoBooks } from "../../data/bookHelpers";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

// NEW BEAUTIFUL BOOK CARD (No image needed!)
const BookCard = ({ book, onView }) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  return (
    <div
      onClick={() => onView(book.googleId)}
      className="group cursor-pointer h-64 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-amber-200 overflow-hidden transform hover:-translate-y-1"
      style={{
        background: "linear-gradient(135deg, #faf5e9 0%, #f0e6d6 100%)",
      }}
    >
      {/* Subtle decorative blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-6 left-6 w-20 h-20 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 py-8 text-center">
        <h3 className="font-bold text-lg md:text-xl text-amber-900 leading-tight line-clamp-3 group-hover:text-amber-800 transition-colors">
          {book.title}
        </h3>
        <p className="mt-4 text-amber-700 font-medium text-sm tracking-wide">
          {authors}
        </p>

        {/* Hover hint */}
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-amber-600">
          View Details →
        </span>
      </div>
    </div>
  );
};

const Section = ({ title, books, loading, onView, showAll, toggleShowAll }) => {
  const visibleBooks = showAll ? books : books.slice(0, 6);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-serif font-bold"
          style={{ color: theme.text }}
        >
          {title}
        </h2>
        {books.length > 6 && (
          <button
            onClick={toggleShowAll}
            className="text-sm font-semibold underline hover:opacity-80 transition"
            style={{ color: theme.accent }}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl animate-pulse"
              style={{ background: "#eadfc6" }}
            />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {visibleBooks.map((b) => (
            <BookCard key={b.googleId} book={b} onView={onView} />
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-amber-700">
          No books found in this category.
        </p>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for each category
  const [mathematics, setMathematics] = useState([]);
  const [programming, setProgramming] = useState([]);
  const [physics, setPhysics] = useState([]);
  const [engineering, setEngineering] = useState([]);
  const [biology, setBiology] = useState([]);

  const [loadingMath, setLoadingMath] = useState(true);
  const [loadingProg, setLoadingProg] = useState(true);
  const [loadingPhys, setLoadingPhys] = useState(true);
  const [loadingEng, setLoadingEng] = useState(true);
  const [loadingBio, setLoadingBio] = useState(true);

  const [showAllMath, setShowAllMath] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [showAllPhys, setShowAllPhys] = useState(false);
  const [showAllEng, setShowAllEng] = useState(false);
  const [showAllBio, setShowAllBio] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState(
    () => sessionStorage.getItem("dashboardSearch") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    () => sessionStorage.getItem("dashboardCategory") || "all"
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mathematics", label: "Mathematics" },
    { value: "programming", label: "Programming & Computer Science" },
    { value: "physics", label: "Physics" },
    { value: "engineering", label: "Engineering" },
    { value: "biology", label: "Biology" },
  ];

  useEffect(() => {
    setMathematics(demoBooks.mathematics || []);
    setProgramming(demoBooks.programming || []);
    setPhysics(demoBooks.physics || []);
    setEngineering(demoBooks.engineering || []);
    setBiology(demoBooks.biology || []);

    setLoadingMath(false);
    setLoadingProg(false);
    setLoadingPhys(false);
    setLoadingEng(false);
    setLoadingBio(false);
  }, []);

  const handleView = (googleId) => {
    sessionStorage.setItem("dashboardCategory", selectedCategory);
    sessionStorage.setItem("dashboardSearch", searchQuery);
    navigate(`/dashboard/book/${googleId}`);
  };

  const filterBooks = (books) => {
    if (!searchQuery) return books;
    const query = searchQuery.toLowerCase();
    return books.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const authors = Array.isArray(book.authors)
        ? book.authors.join(" ").toLowerCase()
        : "";
      return title.includes(query) || authors.includes(query);
    });
  };

  const getVisibleSections = () => {
    const sections = [];

    if (selectedCategory === "all" || selectedCategory === "mathematics")
      sections.push({
        title: "Mathematics",
        books: filterBooks(mathematics),
        loading: loadingMath,
        showAll: showAllMath,
        toggleShowAll: () => setShowAllMath((prev) => !prev),
      });

    if (selectedCategory === "all" || selectedCategory === "programming")
      sections.push({
        title: "Programming & Computer Science",
        books: filterBooks(programming),
        loading: loadingProg,
        showAll: showAllProg,
        toggleShowAll: () => setShowAllProg((prev) => !prev),
      });

    if (selectedCategory === "all" || selectedCategory === "physics")
      sections.push({
        title: "Physics",
        books: filterBooks(physics),
        loading: loadingPhys,
        showAll: showAllPhys,
        toggleShowAll: () => setShowAllPhys((prev) => !prev),
      });

    if (selectedCategory === "all" || selectedCategory === "engineering")
      sections.push({
        title: "Engineering",
        books: filterBooks(engineering),
        loading: loadingEng,
        showAll: showAllEng,
        toggleShowAll: () => setShowAllEng((prev) => !prev),
      });

    if (selectedCategory === "all" || selectedCategory === "biology")
      sections.push({
        title: "Biology",
        books: filterBooks(biology),
        loading: loadingBio,
        showAll: showAllBio,
        toggleShowAll: () => setShowAllBio((prev) => !prev),
      });

    return sections;
  };

  const selectedCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label ||
    "All Categories";

  return (
    <div
      style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}
    >
      <UserNavBar />

      <div className="container mx-auto px-6 py-10">
        <h1
          className="text-4xl font-serif font-bold mb-10 text-center md:text-left"
          style={{ color: theme.text }}
        >
          Educational Library
        </h1>

        {/* Search + Category */}
        <div className="mb-10 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                sessionStorage.setItem("dashboardSearch", e.target.value);
              }}
              className="w-full pl-12 pr-6 py-4 rounded-xl border focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
              style={{
                background: "#fff",
                borderColor: "#D4B896",
                color: theme.text,
              }}
            />
            <svg
              className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"
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

          <div className="relative md:w-80">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full px-6 py-4 rounded-xl border flex items-center justify-between font-medium transition hover:bg-amber-50"
              style={{
                background: "#fff",
                borderColor: "#D4B896",
                color: theme.text,
              }}
            >
              {selectedCategoryLabel}
              <svg
                className={`w-5 h-5 transition ${
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
                className="absolute top-full mt-2 w-full rounded-xl shadow-xl border border-amber-200 overflow-hidden z-50"
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
                    className="w-full text-left px-6 py-3 hover:bg-amber-50 transition"
                    style={{
                      color:
                        selectedCategory === cat.value
                          ? theme.accent
                          : theme.text,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Sections */}
        <div className="space-y-16">
          {getVisibleSections().map((section) => (
            <Section key={section.title} {...section} onView={handleView} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
