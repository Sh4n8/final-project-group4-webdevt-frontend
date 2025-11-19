// src/components/BookCard.jsx
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  return (
    <Link to={`/dashboard/book/${book.googleId}`} className="block">
      <div className="h-44 bg-[#e6d6b8] rounded-lg shadow hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center justify-center text-center">
        {/* Title */}
        <h3 className="font-semibold text-base text-[#3b2f2f] line-clamp-2">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-[#6b5446] mt-2 line-clamp-1">{authors}</p>
      </div>
    </Link>
  );
}
