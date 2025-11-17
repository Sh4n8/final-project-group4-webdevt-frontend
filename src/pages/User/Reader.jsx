// src/pages/User/Reader.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../../lib/api";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  sidebar: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
  border: "#d0c4a8",
};

const Reader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(bookId);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: theme.bg }}
        className="flex items-center justify-center"
      >
        <div className="animate-pulse text-lg" style={{ color: theme.text }}>
          Loading book...
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div
        style={{ minHeight: "100vh", background: theme.bg }}
        className="flex flex-col items-center justify-center"
      >
        <p className="text-lg mb-4" style={{ color: theme.text }}>
          Book not found
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 rounded-lg text-white"
          style={{ background: theme.accent }}
        >
          Back to Library
        </button>
      </div>
    );
  }

  
  const chapters = book.pageCount
    ? Array.from({ length: Math.min(book.pageCount / 10, 20) }, (_, i) => ({
        id: i,
        title: `Chapter ${i + 1}`,
        content: book.description || "Chapter content would go here...",
      }))
    : [
        {
          id: 0,
          title: "Introduction",
          content: book.description || "Book content...",
        },
      ];

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      window.scrollTo(0, 0);
    }
  };

  const currentChapterData = chapters[currentChapter];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex" }}>
      {/* Sidebar - Table of Contents */}
      <div
        className={`transition-all duration-300 ${
          showSidebar ? "w-80" : "w-0"
        } overflow-hidden`}
        style={{
          background: theme.sidebar,
          borderRight: `1px solid ${theme.border}`,
        }}
      >
        <div className="p-6">
          {/* Book Info */}
          <div className="mb-6">
            <button
              onClick={() => navigate(`/dashboard/book/${bookId}`)}
              className="text-sm mb-4 hover:underline flex items-center gap-2"
              style={{ color: theme.accent }}
            >
              ← Back to Book Details
            </button>
            <h2
              className="text-lg font-serif font-bold mb-2"
              style={{ color: theme.text }}
            >
              {book.title}
            </h2>
            <p className="text-sm" style={{ color: "#6b5446" }}>
              {Array.isArray(book.authors)
                ? book.authors.join(", ")
                : "Unknown Author"}
            </p>
          </div>

          {/* Reading Controls */}
          <div
            className="mb-6 pb-6 border-b"
            style={{ borderColor: theme.border }}
          >
            <p className="text-xs mb-2" style={{ color: theme.text }}>
              Font Size
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-3 py-1 rounded text-white text-sm"
                style={{ background: theme.accent }}
              >
                A-
              </button>
              <span className="text-sm" style={{ color: theme.text }}>
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-3 py-1 rounded text-white text-sm"
                style={{ background: theme.accent }}
              >
                A+
              </button>
            </div>
          </div>

          {/* Chapters List */}
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Table of Contents ({chapters.length} chapters)
            </h3>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {chapters.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapter(idx);
                    window.scrollTo(0, 0);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    currentChapter === idx
                      ? "font-semibold"
                      : "hover:bg-opacity-50"
                  }`}
                  style={{
                    background:
                      currentChapter === idx ? theme.accent : "transparent",
                    color: currentChapter === idx ? "white" : theme.text,
                  }}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Reader Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: theme.panel, borderColor: theme.border }}
        >
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-4 py-2 rounded hover:opacity-80"
            style={{ background: theme.accent, color: "white" }}
          >
            {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: theme.text }}>
              Chapter {currentChapter + 1} of {chapters.length}
            </span>
          </div>
        </div>

        {/* Reading Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Chapter Title */}
            <h1
              className="text-3xl font-serif font-bold mb-6"
              style={{ color: theme.text }}
            >
              {currentChapterData.title}
            </h1>

            {/* Chapter Content */}
            <div
              className="prose prose-lg leading-relaxed"
              style={{
                color: "#4a4139",
                fontSize: `${fontSize}px`,
                lineHeight: "1.8",
              }}
              dangerouslySetInnerHTML={{
                __html: currentChapterData.content,
              }}
            />

            {/* Chapter Navigation */}
            <div
              className="flex justify-between items-center mt-12 pt-8 border-t"
              style={{ borderColor: theme.border }}
            >
              <button
                onClick={handlePrevChapter}
                disabled={currentChapter === 0}
                className="px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: currentChapter === 0 ? "#ccc" : theme.accent,
                  color: "white",
                }}
              >
                ← Previous Chapter
              </button>

              <span className="text-sm" style={{ color: theme.text }}>
                {currentChapter + 1} / {chapters.length}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={currentChapter === chapters.length - 1}
                className="px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    currentChapter === chapters.length - 1
                      ? "#ccc"
                      : theme.accent,
                  color: "white",
                }}
              >
                Next Chapter →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reader;
