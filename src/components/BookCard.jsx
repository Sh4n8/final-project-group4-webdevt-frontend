// src/components/BookCard.jsx
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  const thumbnail =
    book.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover";

  return (
    <Link to={`/dashboard/book/${book.googleId}`} className="block">
      <div className="h-72 bg-[#e6d6b8] rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300">
        {/* Book Cover - Fixed aspect ratio */}
        <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={thumbnail}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/128x192?text=No+Cover";
            }}
          />
        </div>

        {/* Book Info */}
        <div className="p-3 h-24 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 text-[#3b2f2f] leading-tight">
              {book.title}
            </h3>
            <p className="text-xs text-[#6b5446] mt-1 line-clamp-1">
              {authors}
            </p>
          </div>

          {/* Optional: Show rating if available */}
          {book.averageRating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-600 text-xs">★</span>
              <span className="text-xs text-[#7b4b26]">
                {book.averageRating}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
