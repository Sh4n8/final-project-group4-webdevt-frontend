import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SignUp = () => {
  const { signup, checkCredentialExists } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [credentialExists, setCredentialExists] = useState(false);

  // Check email existence when typing stops
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && newEmail.includes("@")) {
      // Basic email validation
      if (checkCredentialExists(newEmail)) {
        setCredentialExists(true);
        setError(
          "An account with this email already exists. Please login instead."
        );
      } else {
        setCredentialExists(false);
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (credentialExists) {
      setError(
        "This username or email is already registered. Please login instead."
      );
      return;
    }

    try {
      await signup(email, username, password, isAdmin ? "admin" : "user");
      // signup will navigate via AuthContext on success
    } catch (err) {
      console.error("Signup error", err);
      setError(err?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
              if (value && checkCredentialExists(value)) {
                setCredentialExists(true);
                setError("This username is already taken.");
              } else {
                setCredentialExists(false);
                setError("");
              }
            }}
            required
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Choose a username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Account type:
          </label>
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className={`px-3 py-1 rounded ${
              !isAdmin ? "bg-[#7a4b2a] text-white" : "bg-gray-100"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setIsAdmin(true)}
            className={`px-3 py-1 rounded ${
              isAdmin ? "bg-[#7a4b2a] text-white" : "bg-gray-100"
            }`}
          >
            Admin
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#7a4b2a] text-white py-2 rounded"
        >
          Create Account
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7a4b2a] font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
