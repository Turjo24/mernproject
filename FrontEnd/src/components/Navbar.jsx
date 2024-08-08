import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import WebsiteLogo from "../assets/Logo.png";
import { FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";

const Navbar = ({
  categories,
  isAuthenticated,
  onCategoryChange,
}) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("loggedInUser");
      const role = localStorage.getItem("userRole");
      setLoggedInUser(user);
      setUserRole(role);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      showNotification("User Logged out");
      setLoggedInUser("");
      setUserRole("");
      setShowProfileDropdown(false);

      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        navigate("/Home");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
      showNotification("An error occurred during logout.");
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowCategoryDropdown(false);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowProfileDropdown(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setShowCategoryDropdown(false);
  };

  const navLinkStyle = "text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors duration-300";
  const dropdownItemStyle = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-500 transition-colors duration-300";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                src={WebsiteLogo}
                alt="Website_Logo"
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className={navLinkStyle}>
                  Home
                </Link>
                <div className="relative">
                  <button onClick={toggleCategoryDropdown} className={navLinkStyle}>
                    Category
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleCategoryClick("men")}
                        className={dropdownItemStyle}
                      >
                        Men
                      </button>
                      <button
                        onClick={() => handleCategoryClick("women")}
                        className={dropdownItemStyle}
                      >
                        Women
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={dropdownItemStyle}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="#" className={navLinkStyle}>
                  Contact Us
                </Link>
                <Link to="#" className={navLinkStyle}>
                  About Us
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link to="#" className={`${navLinkStyle} mx-3 flex items-center`}>
                  <FaHeart className="mr-1" />
                  Wishlist
                </Link>
                <Link to="CartPage" className={`${navLinkStyle} mx-3 flex items-center`}>
                  <FaShoppingBag className="mr-1" />
                  Bag
                </Link>
                {loggedInUser ? (
                  <div className="relative ml-3">
                    <button
                      onClick={toggleProfileDropdown}
                      className={`${navLinkStyle} flex items-center`}
                    >
                      <FaUser className="mr-1" />
                      Profile
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link to="/Dashboard" className={dropdownItemStyle}>
                          Dashboard
                        </Link>
                        <button onClick={handleLogout} className={dropdownItemStyle}>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/LogInPage" className={`${navLinkStyle} ml-3 flex items-center`}>
                    <FaUser className="mr-1" />
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white rounded-md shadow-lg px-6 py-3 transition-opacity duration-300">
          {notification}
        </div>
      )}
    </nav>
  );
};

export default Navbar;