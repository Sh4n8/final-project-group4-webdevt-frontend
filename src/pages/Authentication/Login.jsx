import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(credential, password, isAdmin ? "admin" : "user");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-0">
        <div className="hidden lg:flex h-full w-full items-center justify-center bg-gradient-to-br from-[#b97945] to-[#7a4b2a]">
          <div className="max-w-lg text-white text-center p-12">
            <div className="mb-6 text-left">
              <h1 className="text-4xl font-serif font-bold">LibroLink</h1>
            </div>
            <img
              src="/Welcome.png"
              alt="illustration"
              className="mx-auto w-600 h-auto drop-shadow-lg"
            />
            <p className="mt-6 text-lg">
              Your digital library management solution
            </p>
          </div>
        </div>
      </div>

      {/*Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f7f1e6]">
        <div className="max-w-md w-full">
          <div className="text-left mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">LibroLink</h1>
            <h2 className="text-2xl font-medium text-gray-700">Welcome back</h2>
          </div>

          <div className="flex rounded-lg bg-white/50 p-1 mb-8 border border-gray-200">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm font-medium ${
                !isAdmin
                  ? "bg-[#7a4b2a] text-white"
                  : "bg-transparent text-gray-700"
              }`}
              onClick={() => setIsAdmin(false)}
            >
              User
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm font-medium ${
                isAdmin
                  ? "bg-[#7a4b2a] text-white"
                  : "bg-transparent text-gray-700"
              }`}
              onClick={() => setIsAdmin(true)}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div>
              <label
                htmlFor="credential"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Username
              </label>
              <input
                id="credential"
                name="credential"
                type="text"
                required
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a4b2a] focus:border-[#7a4b2a]"
                placeholder="Email or username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a4b2a] focus:border-[#7a4b2a]"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#7a4b2a] focus:ring-[#7a4b2a] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#7a4b2a] hover:text-[#5b331e]"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a4b2a] hover:bg-[#5b331e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a4b2a] transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/SignUp"
              className="font-medium text-[#7a4b2a] hover:text-[#5b331e]"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
