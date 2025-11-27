// src/lib/api.js
import axios from "axios";

const GOOGLE_BOOKS_API_KEY =
  import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "YOUR_GOOGLE_API_KEY_HERE";
const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

// Create axios instance for backend (keep for auth if it works)
const isDev = import.meta.env.DEV;
const baseURL = isDev
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL ||
    "https://final-project-group4-webdevt-backend-production-48cb.up.railway.app";

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Auth token management (for backend auth if it works)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("token");
};


// Mock user database (stored in localStorage)
const USERS_KEY = "librolink_users";
const CURRENT_USER_KEY = "librolink_current_user";

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUserLocal = (data) => {
  return new Promise((resolve, reject) => {
    const users = getUsers();

    // Check if user exists
    if (users.find((u) => u.email === data.email || u.name === data.name)) {
      reject(new Error("User already exists"));
      return;
    }

    // Create new user
    const newUser = {
      _id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password, // In real app, this should be hashed
      userType: data.userType || "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Generate mock token
    const token = btoa(
      JSON.stringify({ id: newUser._id, email: newUser.email })
    );

    // Save current user
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      })
    );

    resolve({
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        token,
      },
    });
  });
};

export const loginUserLocal = (data) => {
  return new Promise((resolve, reject) => {
    const users = getUsers();

    // Find user by email or username
    const user = users.find(
      (u) => u.email === data.email || u.name === data.email
    );

    if (!user) {
      reject(new Error("Invalid email or password"));
      return;
    }

    // Check password
    if (user.password !== data.password) {
      reject(new Error("Invalid email or password"));
      return;
    }

    // Check userType if provided
    if (data.userType && user.userType !== data.userType) {
      reject(new Error("Invalid user type"));
      return;
    }

    // Generate mock token
    const token = btoa(JSON.stringify({ id: user._id, email: user.email }));

    // Save current user
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      })
    );

    resolve({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token,
      },
    });
  });
};

export const getProfileLocal = () => {
  return new Promise((resolve, reject) => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUser) {
      reject(new Error("Not authenticated"));
      return;
    }
    resolve({ data: JSON.parse(currentUser) });
  });
};

export const checkCredentialLocal = (credential) => {
  return new Promise((resolve) => {
    const users = getUsers();
    const exists = users.some(
      (u) => u.email === credential || u.name === credential
    );
    resolve({ data: { exists } });
  });
};

// ========================================
// GOOGLE BOOKS DATA NORMALIZER
// ========================================
const normalizeGoogleBook = (item) => {
  if (!item) return null;

  const vol = item.volumeInfo || {};
  return {
    googleId: item.id,
    id: item.id,
    title: vol.title || "Unknown Title",
    subtitle: vol.subtitle || "",
    authors: vol.authors || ["Unknown Author"],
    description: vol.description || "No description available.",
    thumbnail:
      vol.imageLinks?.thumbnail?.replace("http://", "https://") ||
      vol.imageLinks?.smallThumbnail?.replace("http://", "https://") ||
      null,
    categories: vol.categories || ["Uncategorized"],
    publisher: vol.publisher || "Unknown Publisher",
    publishedDate: vol.publishedDate || null,
    pageCount: vol.pageCount || null,
    averageRating: vol.averageRating || null,
    ratingsCount: vol.ratingsCount || null,
    previewLink: vol.previewLink || null,
    infoLink: vol.infoLink || null,
    language: vol.language || "en",
  };
};

// ========================================
// GOOGLE BOOKS API (NO BACKEND NEEDED)
// ========================================

export const searchBooksGoogle = async (query, maxResults = 20) => {
  try {
    if (!query || query.trim() === "") {
      return { data: { items: [] } };
    }

    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: query,
        maxResults,
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    // Normalize the response
    const items = (response.data.items || [])
      .map(normalizeGoogleBook)
      .filter(Boolean);

    return {
      ...response,
      data: { items },
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    throw error;
  }
};

export const getBooksByCategoryGoogle = async (category, maxResults = 20) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: `subject:${category}`,
        maxResults,
        orderBy: "relevance",
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    const items = (response.data.items || [])
      .map(normalizeGoogleBook)
      .filter(Boolean);

    return {
      ...response,
      data: { items },
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    throw error;
  }
};

export const getBookByIdGoogle = async (id) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/${id}`, {
      params: {
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    const normalizedBook = normalizeGoogleBook(response.data);

    return {
      ...response,
      data: normalizedBook,
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    throw error;
  }
};

export const getFeaturedBooksGoogle = async () => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: "subject:fiction",
        maxResults: 12,
        orderBy: "relevance",
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    const items = (response.data.items || [])
      .map(normalizeGoogleBook)
      .filter(Boolean);

    return {
      ...response,
      data: { items },
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    throw error;
  }
};

// Save book to localStorage (frontend only)
export const saveBookLocal = (bookData) => {
  return new Promise((resolve) => {
    const savedBooks = JSON.parse(localStorage.getItem("saved_books") || "[]");

    // Check if book already exists
    const exists = savedBooks.some((b) => b.googleId === bookData.googleId);

    if (!exists) {
      savedBooks.push({
        ...bookData,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem("saved_books", JSON.stringify(savedBooks));
    }

    resolve({ data: { success: true, message: "Book saved successfully" } });
  });
};

// Get saved books from localStorage
export const getSavedBooksLocal = () => {
  return new Promise((resolve) => {
    const savedBooks = JSON.parse(localStorage.getItem("saved_books") || "[]");
    resolve({ data: { items: savedBooks } });
  });
};


export const registerUser = async (data) => {
  try {
    return await api.post("/api/users/register", data);
  } catch (error) {
    console.log("⚠️ Backend unavailable, using local storage for registration");
    return registerUserLocal(data);
  }
};

export const loginUser = async (data) => {
  try {
    return await api.post("/api/users/login", data);
  } catch (error) {
    console.log("⚠️ Backend unavailable, using local storage for login");
    return loginUserLocal(data);
  }
};

export const getProfile = async () => {
  try {
    return await api.get("/api/users/profile");
  } catch (error) {
    console.log("⚠️ Backend unavailable, using local storage for profile");
    return getProfileLocal();
  }
};

export const checkCredential = async (c) => {
  try {
    return await api.get("/api/users/check-credential", {
      params: { credential: c },
    });
  } catch (error) {
    console.log(
      "⚠️ Backend unavailable, using local storage for credential check"
    );
    return checkCredentialLocal(c);
  }
};

// Book endpoints - Use Google API directly
export const searchBooks = searchBooksGoogle;
export const getBooksByCategory = getBooksByCategoryGoogle;
export const getBookById = getBookByIdGoogle;
export const getFeaturedBooks = getFeaturedBooksGoogle;
export const saveBook = saveBookLocal;
export const getSavedBooks = getSavedBooksLocal;

export default api;
