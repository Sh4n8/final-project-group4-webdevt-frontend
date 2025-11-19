// src/components/BookCard.jsx
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  return (
    <Link to={`/dashboard/book/${book.googleId}`} className="block group">
      <div className="relative h-64 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-200">
        
        {/* Optional subtle decorative element */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-16 h-16 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        {/* Content - Centered */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 py-8 text-center">
          {/* Book Title */}
          <h3 className="font-bold text-lg md:text-xl text-amber-900 leading-tight line-clamp-3 group-hover:text-amber-800 transition-colors">
            {book.title}
          </h3>

          {/* Author Name */}
          <p className="mt-3 text-sm md:text-base text-amber-700 font-medium tracking-wide">
            {authors}
          </p>

          {/* Optional "Read More" hint on hover */}
          <span className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-amber-600 font-semibold">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}