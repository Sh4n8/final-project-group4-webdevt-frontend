// src/components/BookCard.jsx
import React from "react";

export default function BookCard({ book, onView }) {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : "Unknown Author";

  return (
    <div
      onClick={() => onView(book.googleId)}
      className="group relative h-64 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-amber-200 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-6 left-6 w-24 h-24 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 right-8 w-28 h-28 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 py-8 text-center">
        <h3 className="font-bold text-lg md:text-xl text-amber-900 leading-tight line-clamp-3 group-hover:text-amber-800 transition-colors">
          {book.title}
        </h3>
        <p className="mt-4 text-amber-700 font-medium text-sm tracking-wide">
          {authors}
        </p>

        {/* Hover hint */}
        <span className="absolute bottom-5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-amber-600 flex items-center gap-1">
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
