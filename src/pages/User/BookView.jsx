import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../../lib/api";
import UserNavBar from "../../components/UserNavBar";

const theme = {
  bg: "#f8f1e4",
  panel: "#e6d6b8",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

const BookView = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedLists, setSelectedLists] = useState({
    readingList: false,
    favorites: false,
    thesis: false,
    journals: false,
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log("Fetching book with ID:", bookId);
        const res = await getBookById(bookId);
        console.log("Book data received:", res.data);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
        console.error("Error details:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    } else {
      setLoading(false);
    }
  }, [bookId]);

  const handleToggleList = (list) => {
    setSelectedLists((prev) => ({
      ...prev,
      [list]: !prev[list],
    }));
  };

  const handleDone = () => {
    const bookData = {
      googleId: book.googleId,
      title: book.title,
      authors: book.authors,
      thumbnail: book.thumbnail,
      categories: book.categories,
    };

    Object.keys(selectedLists).forEach((listName) => {
      if (selectedLists[listName]) {
        const currentList = JSON.parse(localStorage.getItem(listName) || "[]");

        const exists = currentList.some((b) => b.googleId === book.googleId);

        if (!exists) {
          currentList.push(bookData);
          localStorage.setItem(listName, JSON.stringify(currentList));
        }
      }
    });

    alert("Book added to your library!");
    setShowAddMenu(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        <UserNavBar />
        <div className="container mx-auto px-6 py-8 flex justify-center items-center">
          <div className="animate-pulse text-lg" style={{ color: theme.text }}>
            Loading book...
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        <UserNavBar />
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-lg" style={{ color: theme.text }}>
            Book not found
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 rounded-lg text-white"
            style={{ background: theme.accent }}
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";
  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/400x600?text=No+Cover";
  const pageCount = book.pageCount || "Unknown";
  const publishedDate = book.publishedDate
    ? new Date(book.publishedDate).getFullYear()
    : "Unknown";
  const categories = Array.isArray(book.categories)
    ? book.categories.join(", ")
    : "Uncategorized";

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <UserNavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div
              className="rounded-lg overflow-hidden shadow-lg"
              style={{ background: theme.panel }}
            >
              <img
                src={thumbnail}
                alt={book.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x600?text=No+Cover";
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1
              className="text-3xl font-serif font-bold mb-2"
              style={{ color: theme.text }}
            >
              {book.title}
            </h1>
            <p className="text-lg mb-4" style={{ color: "#6b5446" }}>
              {book.subtitle || `By ${authors}`}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  📄 Pages:
                </span>
                <span className="text-sm" style={{ color: "#6b5446" }}>
                  {pageCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  📅 Published:
                </span>
                <span className="text-sm" style={{ color: "#6b5446" }}>
                  {publishedDate}
                </span>
              </div>

              {book.publisher && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    🏢 Publisher:
                  </span>
                  <span className="text-sm" style={{ color: "#6b5446" }}>
                    {book.publisher}
                  </span>
                </div>
              )}

              {book.averageRating && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    ⭐ Rating:
                  </span>
                  <span className="text-sm" style={{ color: "#6b5446" }}>
                    {book.averageRating} ({book.ratingsCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <span
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                📚 Categories:
              </span>
              <p className="text-sm mt-1" style={{ color: "#6b5446" }}>
                {categories}
              </p>
            </div>

            <div className="flex gap-3 mb-8 relative">
              <button
                className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
                style={{ background: theme.accent }}
                onClick={() => {
                  if (book.previewLink) {
                    window.open(book.previewLink, "_blank");
                  } else if (book.infoLink) {
                    window.open(book.infoLink, "_blank");
                  } else if (book.googleId) {
                    window.open(
                      `https://books.google.com/books?id=${book.googleId}`,
                      "_blank"
                    );
                  } else {
                    alert("Preview not available for this book");
                  }
                }}
              >
                Start Reading
              </button>

              <button
                className="px-6 py-3 rounded-lg font-medium border-2 hover:opacity-90 transition relative"
                style={{
                  background: theme.panel,
                  borderColor: theme.accent,
                  color: theme.accent,
                }}
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                Add to +
              </button>

              {showAddMenu && (
                <div
                  className="absolute top-full mt-2 right-0 rounded-lg shadow-lg p-4 z-10 w-64"
                  style={{ background: theme.panel }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold" style={{ color: theme.text }}>
                      Add to
                    </h3>
                    <button
                      onClick={handleDone}
                      className="text-sm font-medium hover:underline"
                      style={{ color: theme.accent }}
                    >
                      Done
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: "readingList", label: "My Reading List" },
                      { key: "favorites", label: "Favorites" },
                      { key: "thesis", label: "Thesis" },
                      { key: "journals", label: "Journals" },
                    ].map((list) => (
                      <label
                        key={list.key}
                        className="flex items-center justify-between cursor-pointer hover:opacity-80 p-2 rounded"
                        style={{ background: "#f8f1e4" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📚</span>
                          <span
                            className="text-sm"
                            style={{ color: theme.text }}
                          >
                            {list.label}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedLists[list.key]}
                          onChange={() => handleToggleList(list.key)}
                          className="w-4 h-4 cursor-pointer"
                          style={{ accentColor: theme.accent }}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new reading list..."
                      className="flex-1 px-3 py-2 rounded text-sm border"
                      style={{
                        background: "#fff",
                        borderColor: "#d0c4a8",
                        color: theme.text,
                      }}
                    />
                    <button
                      className="px-3 py-2 rounded"
                      style={{ background: theme.accent, color: "white" }}
                    >
                      ⊕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2
                className="text-xl font-serif font-bold mb-3"
                style={{ color: theme.text }}
              >
                Abstract
              </h2>
              <p
                className="text-sm leading-relaxed text-justify"
                style={{ color: "#6b5446" }}
                dangerouslySetInnerHTML={{
                  __html: book.description || "No description available.",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookView;
