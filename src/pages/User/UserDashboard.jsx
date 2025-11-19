// src/pages/User/UserDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/UserNavBar";

const theme = {
  bg: "#f8f1e4",
  text: "#3b2f2f",
  accent: "#7b4b26",
  muted: "#6b5446",
};

const shelves = {
  mathematics: [
    { id: "m1", title: "Principles of Mathematical Analysis", author: "Walter Rudin", rating: 4.9, cover: "https://m.media-amazon.com/images/I/71g1Yc5fGYL.jpg" },
    { id: "m2", title: "Calculus", author: "James Stewart", rating: 4.7, cover: "https://m.media-amazon.com/images/I/91R13w4cVXL.jpg" },
    { id: "m3", title: "Linear Algebra", author: "David C. Lay", rating: 4.4, cover: "https://m.media-amazon.com/images/I/81n9cA5vZYL.jpg" },
    { id: "m4", title: "Abstract Algebra", author: "Dummit & Foote", rating: 4.8, cover: "https://m.media-amazon.com/images/I/71rF8o8gZBL.jpg" },
  ],
  programming: [
    { id: "p1", title: "Clean Code", author: "Robert C. Martin", rating: 4.8, cover: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg" },
    { id: "p2", title: "The Pragmatic Programmer", author: "Hunt & Thomas", rating: 4.7, cover: "https://m.media-amazon.com/images/I/91W5J2B7LHL.jpg" },
    { id: "p3", title: "Eloquent JavaScript", author: "Marijn Haverbeke", rating: 4.6, cover: "https://m.media-amazon.com/images/I/91asIC1fRwL.jpg" },
  ],
  physics: [
    { id: "ph1", title: "The Feynman Lectures", author: "Richard Feynman", rating: 4.9, cover: "https://m.media-amazon.com/images/I/81rW8WMEE-L.jpg" },
    { id: "ph2", title: "University Physics", author: "Young & Freedman", rating: 4.5, cover: "https://m.media-amazon.com/images/I/81V0e7qLllL.jpg" },
  ],
  history: [
    { id: "h1", title: "Sapiens", author: "Yuval Noah Harari", rating: 4.6, cover: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg" },
    { id: "h2", title: "Guns, Germs, and Steel", author: "Jared Diamond", rating: 4.4, cover: "https://m.media-amazon.com/images/I/81eMczZd1PL.jpg" },
  ],
};

const allBooks = Object.values(shelves).flat();

const categories = [
  { value: "all", label: "All Categories" },
  { value: "mathematics", label: "Mathematics" },
  { value: "programming", label: "Programming & Computer Science" },
  { value: "physics", label: "Physics" },
  { value: "history", label: "History" },
];

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/book/${book.id}`)}
      className="flex-none w-40 cursor-pointer group transform transition-all duration-200 hover:scale-105"
    >
      <div className="bg-white rounded-lg shadow-sm group-hover:shadow-xl transition-shadow p-3 border border-transparent group-hover:border-[#d4b896]">
        <img src={book.cover} alt={book.title} className="w-full h-56 object-contain rounded" loading="lazy" />
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm leading-tight line-clamp-2" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          {book.title}
        </p>
        <p className="text-xs mt-1" style={{ color: theme.muted }}>{book.author}</p>
        {book.rating && (
          <p className="text-xs mt-1 flex items-center justify-center gap-1">
            <span className="text-yellow-600">★</span>
            <span style={{ color: theme.accent }}>{book.rating}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const Shelf = ({ title, books }) => (
  <section className="mb-14">
    <h2 className="text-xl mb-6" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
      {title}
    </h2>
    <div className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex gap-8">
        {books.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
    <div className="text-right mt-2">
      <span className="text-xs italic" style={{ color: theme.muted }}>← swipe to explore →</span>
    </div>
  </section>
);

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Base books: all or one category
  const baseBooks = selectedCategory === "all" ? allBooks : shelves[selectedCategory] || [];

  // Final filtered results
  const results = searchQuery
    ? baseBooks.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseBooks;

  // Dynamic title
  const getTitle = () => {
    if (!searchQuery && selectedCategory === "all") return "All Books";
    const label = categories.find(c => c.value === selectedCategory)?.label || "All Categories";
    return `${label} (${results.length} found)`;
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#d4b896] shadow-sm">
        <UserNavBar />
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <h1 className="text-4xl text-center mb-10" style={{ color: theme.text, fontFamily: "'Georgia', serif" }}>
          Educational Library
        </h1>

        {/* Search + Category */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-[#7b4b26]/30"
              style={{ background: "#fff", borderColor: "#d4b896", color: theme.text }}
            />
            <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-6 py-4 rounded-lg border text-base flex items-center gap-2"
              style={{ background: "#fff", borderColor: "#d4b896", color: theme.text }}
            >
              {categories.find(c => c.value === selectedCategory)?.label}
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 w-full rounded-lg shadow-lg border border-[#d4b896] bg-white z-10">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#e6d6b8]"
                    style={{ color: selectedCategory === cat.value ? theme.accent : theme.text }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* One single shelf — always */}
        {results.length > 0 ? (
          <Shelf title={getTitle()} books={results} />
        ) : (
          <p className="text-center text-lg italic py-20" style={{ color: theme.muted }}>
            No books found. Try another search or category.
          </p>
        )}

        {/* When no filter/search → show normal shelves */}
        {!searchQuery && selectedCategory === "all" && (
          <>
            <Shelf title="Mathematics" books={shelves.mathematics} />
            <Shelf title="Programming & Computer Science" books={shelves.programming} />
            <Shelf title="Physics" books={shelves.physics} />
            <Shelf title="History" books={shelves.history} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;