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

  // Search and filter states - restore from sessionStorage on mount
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
    { value: "biology", label: "Biology" },
  ];

  useEffect(() => {
    // Use demo books instead of API to avoid rate limiting
    setMathematics(demoBooks.mathematics || []);
    setLoadingMath(false);
    
    setProgramming(demoBooks.programming || []);
    setLoadingProg(false);
    
    setPhysics(demoBooks.physics || []);
    setLoadingPhys(false);
    
    setEngineering(demoBooks.engineering || []);
    setLoadingEng(false);
    
    setBiology(demoBooks.biology || []);
    setLoadingBio(false);
    
    // Set other categories to empty arrays for now
    setChemistry([]);
    setLoadingChem(false);
    
    setMedicine([]);
    setLoadingMed(false);
    
    setHistory([]);
    setLoadingHist(false);
    
    setEconomics([]);
    setLoadingEcon(false);
    
    setPsychology([]);
    setLoadingPsych(false);
  }, []);

  const handleView = (googleId) => {
    // Save current state before navigating
    sessionStorage.setItem("dashboardCategory", selectedCategory);
    sessionStorage.setItem("dashboardSearch", searchQuery);
    navigate(`/dashboard/book/${googleId}`);
  };

  // Filter books based on search query
  const filterBooks = (books) => {
    if (!searchQuery) return books;
    return books.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const authors = Array.isArray(book.authors)
        ? book.authors.join(" ").toLowerCase()
        : "";
      const query = searchQuery.toLowerCase();
      return title.includes(query) || authors.includes(query);
    });
  };

  // Get filtered sections based on category selection
  const getVisibleSections = () => {
    const sections = [];

    if (selectedCategory === "all" || selectedCategory === "mathematics") {
      sections.push({
        title: "Mathematics",
        books: filterBooks(mathematics),
        loading: loadingMath,
        showAll: showAllMath,
        toggleShowAll: () => setShowAllMath(!showAllMath),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "programming") {
      sections.push({
        title: "Programming & Computer Science",
        books: filterBooks(programming),
        loading: loadingProg,
        showAll: showAllProg,
        toggleShowAll: () => setShowAllProg(!showAllProg),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "physics") {
      sections.push({
        title: "Physics",
        books: filterBooks(physics),
        loading: loadingPhys,
        showAll: showAllPhys,
        toggleShowAll: () => setShowAllPhys(!showAllPhys),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "engineering") {
      sections.push({
        title: "Engineering",
        books: filterBooks(engineering),
        loading: loadingEng,
        showAll: showAllEng,
        toggleShowAll: () => setShowAllEng(!showAllEng),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "chemistry") {
      sections.push({
        title: "Chemistry",
        books: filterBooks(chemistry),
        loading: loadingChem,
        showAll: showAllChem,
        toggleShowAll: () => setShowAllChem(!showAllChem),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "biology") {
      sections.push({
        title: "Biology",
        books: filterBooks(biology),
        loading: loadingBio,
        showAll: showAllBio,
        toggleShowAll: () => setShowAllBio(!showAllBio),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "medicine") {
      sections.push({
        title: "Medicine",
        books: filterBooks(medicine),
        loading: loadingMed,
        showAll: showAllMed,
        toggleShowAll: () => setShowAllMed(!showAllMed),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "history") {
      sections.push({
        title: "History",
        books: filterBooks(history),
        loading: loadingHist,
        showAll: showAllHist,
        toggleShowAll: () => setShowAllHist(!showAllHist),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "economics") {
      sections.push({
        title: "Economics",
        books: filterBooks(economics),
        loading: loadingEcon,
        showAll: showAllEcon,
        toggleShowAll: () => setShowAllEcon(!showAllEcon),
      });
    }

    if (selectedCategory === "all" || selectedCategory === "psychology") {
      sections.push({
        title: "Psychology",
        books: filterBooks(psychology),
        loading: loadingPsych,
        showAll: showAllPsych,
        toggleShowAll: () => setShowAllPsych(!showAllPsych),
      });
    }

    return sections;
  };

  const selectedCategoryLabel =
    categories.find((cat) => cat.value === selectedCategory)?.label ||
    "All Categories";

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

        {/* Search Bar and Category Filter */}
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

          {/* Category Filter Dropdown */}
          <div className="relative sm:w-64">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full px-4 py-3 border rounded-lg text-sm font-medium flex items-center justify-between focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                borderColor: "#D4B896",
                color: theme.text,
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