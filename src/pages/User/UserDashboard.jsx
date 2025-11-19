// src/pages/User/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNavBar from "../../components/UserNavBar";
import BookCard from "../../components/BookCard"; // ← IMPORT HERE
import { demoBooks } from "../../data/bookHelpers";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

const Section = ({ title, books, loading, onView, showAll, toggleShowAll }) => {
  const visibleBooks = showAll ? books : books.slice(0, 6);

  return (
    <div className="mb-16">
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-amber-100 animate-pulse"
            />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {visibleBooks.map((book) => (
            <BookCard key={book.googleId} book={book} onView={onView} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-amber-700 text-lg">
          No books found in this category.
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
  const [biology, setBiology] = useState([]);

  const [loadingMath, setLoadingMath] = useState(true);
  const [showAllMath, setShowAllMath] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [showAllPhys, setShowAllPhys] = useState(false);
  const [showAllEng, setShowAllEng] = useState(false);
  const [showAllBio, setShowAllBio] = useState(false);

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
        toggleShowAll: () => setShowAllMath(!showAllMath),
      });
    if (selectedCategory === "all" || selectedCategory === "programming")
      sections.push({
        title: "Programming & Computer Science",
        books: filterBooks(programming),
        showAll: showAllProg,
        toggleShowAll: () => setShowAllProg(!showAllProg),
      });
    if (selectedCategory === "all" || selectedCategory === "physics")
      sections.push({
        title: "Physics",
        books: filterBooks(physics),
        showAll: showAllPhys,
        toggleShowAll: () => setShowAllPhys(!showAllPhys),
      });
    if (selectedCategory === "all" || selectedCategory === "engineering")
      sections.push({
        title: "Engineering",
        books: filterBooks(engineering),
        showAll: showAllEng,
        toggleShowAll: () => setShowAllEng(!showAllEng),
      });
    if (selectedCategory === "all" || selectedCategory === "biology")
      sections.push({
        title: "Biology",
        books: filterBooks(biology),
        showAll: showAllBio,
        toggleShowAll: () => setShowAllBio(!showAllBio),
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
        <h1 className="text-4xl font-serif font-bold mb-10 text-center md:text-left">
          Educational Library
        </h1>

        {/* Search + Category */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
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
                    className="w-full text-left px-6 py-3 hover:bg-amber-50 transition font-medium"
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

        {/* Sections */}
        <div className="space-y-20">
          {getVisibleSections().map((section) => (
            <Section key={section.title} {...section} onView={handleView} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
