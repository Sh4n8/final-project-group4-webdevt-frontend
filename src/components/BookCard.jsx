export default function BookCard({ book }) {
  return (
    <div className="w-40 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-2">
        <h3 className="text-sm font-semibold line-clamp-2">{book.title}</h3>

        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
          {book.authors?.join(", ") || "Unknown Author"}
        </p>
      </div>
    </div>
  );
}
