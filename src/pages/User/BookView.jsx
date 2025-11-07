// src/pages/User/BookView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  const [fullTextHtmlUrl, setFullTextHtmlUrl] = useState(null); // html url for iframe
  const [fullTextPlain, setFullTextPlain] = useState(null); // plain text content
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://gutendex.com/books/${bookId}`);
        if (!res.ok) throw new Error("Failed to load book details.");
        const data = await res.json();
        setBook(data);

        // determine text links (prefer text/html)
        const formats = data.formats || {};
        // prefer HTML variants
        const htmlKeys = Object.keys(formats).filter((k) => k.startsWith("text/html"));
        const plainKeys = Object.keys(formats).filter((k) => k.startsWith("text/plain"));
        if (htmlKeys.length > 0) {
          // use first HTML link
          setFullTextHtmlUrl(formats[htmlKeys[0]]);
        } else if (plainKeys.length > 0) {
          // fetch plain text lazily when user clicks Start Reading (or load now)
          setFullTextPlain(null); // will fetch when user starts reading
        } else {
          setFullTextHtmlUrl(null);
          setFullTextPlain(null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading book");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);

  const startReading = async () => {
    // If HTML link exists, it will render via iframe automatically (no extra work)
    // If only plain text exists, fetch it here and store in state
    if (fullTextHtmlUrl) return; // nothing to do

    if (!book) return;
    const formats = book.formats || {};
    const plainKeys = Object.keys(formats).filter((k) => k.startsWith("text/plain"));
    if (plainKeys.length === 0) {
      setError("No readable text available for this book.");
      return;
    }

    const txtUrl = formats[plainKeys[0]];
    setLoadingText(true);
    try {
      const res = await fetch(txtUrl);
      if (!res.ok) throw new Error("Failed to fetch book text.");
      const text = await res.text();
      setFullTextPlain(text);
    } catch (err) {
      console.error("Error fetching plain text:", err);
      setError("Failed to fetch book text.");
    } finally {
      setLoadingText(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }} className="flex items-center justify-center">
        <p style={{ color: theme.text }}>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }} className="flex flex-col items-center justify-center">
        <p style={{ color: "#b23b3b" }}>Error: {error}</p>
        <button
          onClick={() => navigate("/library")}
          className="mt-4 px-4 py-2 rounded"
          style={{ background: theme.accent, color: "#fff" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }} className="flex flex-col items-center justify-center">
        <p style={{ color: theme.text }}>Book not found.</p>
        <button
          onClick={() => navigate("/library")}
          className="mt-4 px-4 py-2 rounded"
          style={{ background: theme.accent, color: "#fff" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const cover = book.formats["image/jpeg"] || null;
  const authors = book.authors?.map((a) => a.name).join(", ") || "Unknown Author";
  // Gutendex does not always include description; we try to use subjects as summary fallback
  const description = book?.subjects && book.subjects.length > 0
    ? `Subjects: ${book.subjects.slice(0, 6).join(", ")}`
    : book?.title;

  // stats placeholders (Gutendex doesn't give reads/favorites) — we keep mockup numbers
  const stats = {
    reads: "2.5M",
    favorites: "10.3k",
    parts: (book?.bookshelves?.length || 0) + 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text }} className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6" style={{ color: theme.accent }}>← Back to Library</button>

        <div className="bg-white/0 rounded-lg p-6" style={{ background: theme.panel }}>
          <div className="md:flex gap-6">
            {/* Cover + meta */}
            <div className="w-full md:w-1/3 flex flex-col items-start">
              {cover ? (
                <img src={cover} alt={book.title} className="w-64 rounded-md shadow-md mb-4" />
              ) : (
                <div className="w-64 h-80 rounded-md mb-4" style={{ background: "#ddd" }}></div>
              )}

              <div className="w-full">
                <h1 className="text-2xl font-serif font-bold mb-1">{book.title}</h1>
                <p className="text-sm mb-3" style={{ color: "#6b5446" }}>{authors}</p>

                <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: "#6b5446" }}>
                  <div>📘 Reads: <span className="ml-1 font-semibold">{stats.reads}</span></div>
                  <div>❤️ Favorites: <span className="ml-1 font-semibold">{stats.favorites}</span></div>
                  <div>🧾 Parts: <span className="ml-1 font-semibold">{stats.parts}</span></div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startReading()}
                    className="px-4 py-2 rounded-md"
                    style={{ background: theme.accent, color: "#fff" }}
                  >
                    Start Reading
                  </button>
                  <button
                    onClick={() => navigator.share ? navigator.share({ title: book.title, url: window.location.href }) : alert("Share not supported")}
                    className="px-4 py-2 rounded-md border"
                    style={{ borderColor: "#d2c0a3", color: theme.text }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Abstract + Reviews */}
            <div className="w-full md:w-2/3 mt-6 md:mt-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Abstract</h2>
                <div style={{ color: "#6b5446" }}>
                  {description}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Reviews</h2>
                <div className="space-y-3">
                  {/* Placeholder review boxes */}
                  <div className="p-4 rounded" style={{ background: "#f3e9d9" }}>
                    <p className="text-sm" style={{ color: "#6b5446" }}>Great classic that explores social justice and redemption.</p>
                  </div>
                  <div className="p-4 rounded" style={{ background: "#f3e9d9" }}>
                    <p className="text-sm" style={{ color: "#6b5446" }}>Rich characters and vivid storytelling.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* READER */}
          <div className="mt-8">
            {/* If we have an HTML full-text link, show iframe */}
            {fullTextHtmlUrl ? (
              <div>
                <h3 className="text-lg mb-3">Full Text</h3>
                <iframe
                  src={fullTextHtmlUrl}
                  title="Book Reader"
                  className="w-full h-[75vh] rounded-md border-0"
                />
              </div>
            ) : (
              // If plain text is present in state, show it; otherwise show Start Reading button
              <div>
                {fullTextPlain ? (
                  <div>
                    <h3 className="text-lg mb-3">Full Text</h3>
                    <div
                      className="prose max-w-none p-6 overflow-auto h-[75vh] bg-white rounded"
                      style={{ color: theme.text, background: "#fff" }}
                    >
                      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                        {fullTextPlain}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#6b5446" }}>Full text not loaded yet.</p>
                    <button
                      onClick={startReading}
                      className="mt-3 px-4 py-2 rounded-md"
                      style={{ background: theme.accent, color: "#fff" }}
                    >
                      {loadingText ? "Loading..." : "Load Full Text"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookView;
