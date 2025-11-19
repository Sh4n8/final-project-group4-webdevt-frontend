// src/data/bookHelpers.js
import demoBooks from './demoBooks.json';

// Export the demoBooks object
export { demoBooks };

// Helper function to get demo book details by ID
export const getDemoBookById = (bookId) => {
  for (const category in demoBooks) {
    const book = demoBooks[category].find((b) => b.googleId === bookId);
    if (book) return book;
  }
  return null;
};