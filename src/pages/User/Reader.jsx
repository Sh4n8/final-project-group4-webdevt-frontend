import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const theme = {
  bg: "#f8f1e4",
  text: "#3b2f2f",
  accent: "#7b4b26",
};

const Reader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [htmlUrl, setHtmlUrl] = useState(null);
  const [plainText, setPlainText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const res = await fetch(`https://gutendex.com/books/${bookId}`);
        if (!res.ok) throw new Error("Failed to load book.");
        const data = await res.json();
        const formats = data.formats || {};
        const htmlKey = Object.keys(formats).find((k) => k.startsWith("text/html"));
        const txtKey = Object.keys(formats).find((k) => k.startsWith("text/plain"));

        if (htmlKey) {
          setHtmlUrl(formats[htmlKey]);
        } else if (txtKey) {
          const textRes = await fetch(formats[txtKey]);
          const text = await textRes.text();
          setPlainText(text);
        } else {
          setError("No readable format available.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId]);

  if (loading) return <div className="h-screen flex items-center justify-center" style={{ background: theme.bg, color: theme.text }}>Loading book...</div>;
  if (error) return <div className="h-screen flex items-center justify-center" style={{ background: theme.bg, color: theme.text }}>Error: {error}</div>;

  return (
    <div className="h-screen w-full flex flex-col" style={{ background: theme.bg, color: theme.text }}>
      <div className="p-4 flex justify-between items-center border-b border-[#d2c0a3]">
        <button onClick={() => navigate(-1)} style={{ color: theme.accent }}>← Back</button>
        <h2 className="font-semibold text-lg">Book Reader</h2>
      </div>

      {htmlUrl ? (
        <iframe src={htmlUrl} title="Book Reader" className="flex-grow w-full border-0" />
      ) : (
        <div className="flex-grow overflow-y-auto p-6">
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{plainText}</pre>
        </div>
      )}
    </div>
  );
};

export default Reader;
