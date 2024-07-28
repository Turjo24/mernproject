import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaCreditCard, FaBox, FaUsers, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/Home");
    }, 1000);
  };

  const handleSuccess = (message) => {
    console.log(message);
  };

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${
          isActive
            ? "text-white bg-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="w-64 h-screen bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-5">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="flex-grow">
          <NavItem to="/Dashboard" icon={<FaUser className="w-5 h-5" />}>My Profile</NavItem>
          {userRole === "admin" && (
            <>
              <NavItem to="/Create" icon={<FaBox className="w-5 h-5" />}>Add New Product</NavItem>
              <NavItem to="/AllUsers" icon={<FaUsers className="w-5 h-5" />}>All User Details</NavItem>
              <NavItem to="/AdminOrderPage" icon={<FaClipboardList className="w-5 h-5" />}>Admin Order Page</NavItem>
            </>
          )}
          {userRole === "user" && (
            <>
              <NavItem to="/CartPage" icon={<FaShoppingCart className="w-5 h-5" />}>My Cart</NavItem>
              <NavItem to="/payment" icon={<FaCreditCard className="w-5 h-5" />}>Payment</NavItem>
            </>
          )}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-300"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;