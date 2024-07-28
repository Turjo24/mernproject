import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import WebsiteLogo from "../assets/Logo.png";

const Navbar = ({ categories }) => {
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

  const navLinkStyle = "nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950 transition-colors duration-300";
  const dropdownItemStyle = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300";

  return (
    <div className="main">
      <div className="px-5 py-2 flex justify-between items-center shadow-xl">
        <div className="logo text-xl font-bold">
          <img
            src={WebsiteLogo}
            alt="Website_Logo"
            className="object-fit rounded-xl"
            style={{ width: "100px", height: "50px" }}
          />
        </div>
        <div className="nav-links flex space-x-7 font-semibold opacity-75">
          <Link to="/" className={navLinkStyle}>
            Home
          </Link>
          <div className="relative">
            <button
              onClick={toggleCategoryDropdown}
              className={navLinkStyle}
            >
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
          <Link to="#" className={navLinkStyle}>
            About Us
          </Link>
          <Link to="#" className={navLinkStyle}>
            Contact Us
          </Link>
          {loggedInUser ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className={navLinkStyle}
              >
                Profile
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/Dashboard"
                    className={dropdownItemStyle}
                  >
                    Dashboard
                  </Link>
                  {userRole === "admin" ? (
                    <Link
                      to="/create"
                      className={dropdownItemStyle}
                    >
                      Add New Product
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/CartPage"
                        className={dropdownItemStyle}
                      >
                        My Cart
                      </Link>
                      <Link
                        to="/your-orders"
                        className={dropdownItemStyle}
                      >
                        Your Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className={dropdownItemStyle}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/LogInPage"
              className={navLinkStyle}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded shadow-lg px-6 py-3 transition-opacity duration-300">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Navbar;