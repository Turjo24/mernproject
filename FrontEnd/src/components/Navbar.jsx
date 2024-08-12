import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import WebsiteLogo from "../assets/Logo.png";
import { FaUser, FaHeart, FaShoppingBag, FaBars } from "react-icons/fa";

const Navbar = ({ categories, isAuthenticated, onCategoryChange }) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setShowCategoryDropdown(false);
    setShowMobileMenu(false);
  };

  const navLinkStyle = "text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors duration-300";
  const dropdownItemStyle = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-500 transition-colors duration-300";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
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
                <Link to="/contact" className={navLinkStyle}>
                  Contact Us
                </Link>
                <Link to="/about" className={navLinkStyle}>
                  About Us
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link to="/wishlist" className={`${navLinkStyle} mx-3 flex items-center`}>
              <FaHeart className="mr-1" />
              Wishlist
            </Link>
            <Link to="/CartPage" className={`${navLinkStyle} mx-3 flex items-center`}>
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
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
              Home
            </Link>
            <button
              onClick={toggleCategoryDropdown}
              className={`${navLinkStyle} block px-3 py-2 rounded-md w-full text-left`}
            >
              Category
            </button>
            {showCategoryDropdown && (
              <div className="pl-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`${dropdownItemStyle} block px-3 py-2 rounded-md w-full text-left`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
            <Link to="/contact" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
              Contact Us
            </Link>
            <Link to="/about" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
              About Us
            </Link>
            <Link to="/wishlist" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
              Wishlist
            </Link>
            <Link to="/CartPage" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
              Bag
            </Link>
            {loggedInUser ? (
              <>
                <Link to="/Dashboard" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${navLinkStyle} block px-3 py-2 rounded-md w-full text-left`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/LogInPage" className={`${navLinkStyle} block px-3 py-2 rounded-md`}>
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white rounded-md shadow-lg px-6 py-3 transition-opacity duration-300">
          {notification}
        </div>
      )}
    </nav>
  );
};

export default Navbar;