import React, { useState, useRef, useContext, useEffect } from "react";
import { Edit2, Camera, X } from "lucide-react";
import UserNavBar from "../../components/UserNavBar";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  // Cover & profile
  const [cover, setCover] = useState(() => localStorage.getItem("coverPhoto") || null);
  const [profilePic, setProfilePic] = useState(user?.avatar || null);
  const coverInputRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setProfilePic(user?.avatar || null);
  }, [user?.avatar]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const coverURL = URL.createObjectURL(file);
      setCover(coverURL);
      localStorage.setItem("coverPhoto", coverURL);
    }
  };

  // Sample activities with categories
  const activities = [
    { id: 1, title: "THE CRUEL PRINCE", author: "Holly Black", cover: "https://covers.openlibrary.org/b/id/10523364-L.jpg", category: "Fantasy" },
    { id: 2, title: "SIX OF CROWS: Book 1 of the Duology", author: "Leigh Bardugo", cover: "https://covers.openlibrary.org/b/id/8372791-L.jpg", category: "Fantasy" },
    { id: 3, title: "THE SONG OF ACHILLES", author: "Madeline Miller", cover: "https://covers.openlibrary.org/b/id/8311821-L.jpg", category: "History" },
  ];

  // Dynamic category counts
  const categoriesOverview = [
    { genre: "Fantasy", count: activities.filter(a => a.category === "Fantasy").length },
    { genre: "History", count: activities.filter(a => a.category === "History").length },
    { genre: "Mathematics", count: activities.filter(a => a.category === "Mathematics").length },
    { genre: "Physics", count: activities.filter(a => a.category === "Physics").length },
    { genre: "Engineering", count: activities.filter(a => a.category === "Engineering").length },
    { genre: "Chemistry", count: activities.filter(a => a.category === "Chemistry").length },
    { genre: "Biology", count: activities.filter(a => a.category === "Biology").length },
    { genre: "Medicine", count: activities.filter(a => a.category === "Medicine").length },
    { genre: "Economics", count: activities.filter(a => a.category === "Economics").length },
    { genre: "Psychology", count: activities.filter(a => a.category === "Psychology").length },
  ];

  // Filter books
  const filteredBooks =
    selectedCategory === null
      ? activities
      : selectedCategory === "All"
      ? activities
      : activities.filter((book) => book.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <UserNavBar />

      <div className="p-8 flex flex-col items-center pb-12 bg-[#F5E6D3]">
        {/* Cover Section */}
        <div className="relative w-full h-52 bg-[#D4B896] group flex items-center justify-center mt-4">
          {cover && <img src={cover} alt="Cover" className="w-full h-full object-cover opacity-80" />}
          <Edit2
            className="absolute top-2 right-2 w-8 h-8 text-white bg-[#5D4E37] p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
            onClick={() => coverInputRef.current.click()}
          />
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={handleCoverChange}
            className="hidden"
          />
          {/* Profile Picture */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="w-40 h-40 rounded-full border-4 border-[#F5E6D3] overflow-hidden shadow-lg flex items-center justify-center bg-[#EDE0D4]">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-[#5D4E37]" />
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-24 text-center">
          <h1 className="text-3xl font-bold text-[#5D4E37]">{user?.username || "User Name"}</h1>
          <p className="text-[#8B7355]">Book Enthusiast & Reader</p>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl w-full mt-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 h-[500px]">
          {/* LEFT: Category Overview */}
          <div className="bg-white border border-[#D4B896] rounded-xl shadow p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#5D4E37] mb-4">Categories Overview</h2>

            <div className="space-y-3">
              {/* All Reads */}
              <div
                className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer ${
                  selectedCategory === "All" ? "bg-[#E9DCC5]" : "bg-[#F5E6D3] hover:bg-[#E9DCC5]"
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                <span className="text-[#5D4E37] font-medium">All Reads</span>
                <span className="text-[#8B7355]">{activities.length} read</span>
              </div>

              {categoriesOverview.map((item) => (
                <div
                  key={item.genre}
                  className={`flex justify-between px-4 py-2 rounded-lg cursor-pointer ${
                    item.count > 0
                      ? selectedCategory === item.genre
                        ? "bg-[#E9DCC5]"
                        : "bg-[#F5E6D3] hover:bg-[#E9DCC5]"
                      : "bg-[#F3F1ED] cursor-not-allowed"
                  }`}
                  onClick={() => item.count > 0 && setSelectedCategory(item.genre)}
                >
                  <span className="text-[#5D4E37] font-medium">{item.genre}</span>
                  <span className="text-[#8B7355]">{item.count} read</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Activity / Books List */}
          <div className="lg:col-span-2 bg-white border border-[#D4B896] rounded-xl shadow p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#5D4E37]">
                {selectedCategory
                  ? selectedCategory === "All"
                    ? "All Reads"
                    : `${selectedCategory} Books`
                  : "Activity"}
              </h2>
              {selectedCategory && (
                <X
                  className="w-6 h-6 text-[#5D4E37] cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                />
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {(filteredBooks.length > 0 ? filteredBooks : activities).map((book) => (
                <div
                  key={book.id}
                  className="flex items-center bg-[#F9EFE2] rounded-lg p-4 hover:bg-[#F3E4CD] transition"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-14 h-20 rounded-md object-cover mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-[#5D4E37] font-medium">
                      Completed: <span className="font-semibold">{book.title}</span> by {book.author}
                    </p>
                  </div>
                </div>
              ))}

              {filteredBooks.length === 0 && selectedCategory && (
                <p className="text-[#8B7355]">No books read in this category yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
