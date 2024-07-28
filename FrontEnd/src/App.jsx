import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Create from "./components/Create";
import Details from "./components/Details";
import LogInPage from "./components/LogInPage";
import RegisterPage from "./components/RegisterPage";
import RefrshHandler from "./components/RefrshHandler";
import Dashboard from "./components/Dashboard";
import TokenRefresher from "./components/TokenRefresher";
import { apiRequest } from "./utills/auth";
import CartPage from './components/CartPage';
import AllUsers from "./components/AllUsers";
import AllCartItems from "./components/AllCartItems";
import PaymentPage from './components/PaymentPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import OrderPage from './components/OrderPage';
import AdminOrderPage from './components/AdminOrderPage';
import UserOrders from './components/UserOrders';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />
  }

  useEffect(() => {
    fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      let url = "https://project-cse-2200.vercel.app/api/products";
      let options = {};

      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (token) {
          options.headers = {
            'Authorization': `Bearer ${token}`
          };
        }
      }

      const products = await apiRequest("get", url, null, options);
      const uniqueCategories = [
        ...new Set(
          products.map((product) => product.category.toLowerCase().trim())
        ),
      ];
      setCategories(uniqueCategories);
      localStorage.setItem("categories", JSON.stringify(uniqueCategories));
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Error fetching categories");
      }
    }
  };

  const addCategory = (newCategory) => {
    const normalizedCategory = newCategory.toLowerCase().trim();
    if (!categories.includes(normalizedCategory)) {
      const updatedCategories = [...categories, normalizedCategory];
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <TokenRefresher />
      <Navbar categories={categories} />
      <Routes>
        <Route path="/" element={<Home categories={categories} />} />
        <Route path="/Home" element={<PrivateRoute element={<Home categories={categories} />} />} />
        <Route path="/category/:category" element={<PrivateRoute element={<Home categories={categories} />} />} />
        <Route path="/LogInPage" element={<LogInPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/create" element={<PrivateRoute element={<Create addCategory={addCategory} />} />} />
        <Route path="/details/:id" element={<PrivateRoute element={<Details />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/cartPage" element={<PrivateRoute element={<CartPage />} />} />
        <Route path="/AllUsers" element={<PrivateRoute element={<AllUsers />} />} />
        <Route path="/AllCartItems" element={<PrivateRoute element={<AllCartItems />} />} />
        <Route path="/payment" element={<PrivateRoute element={<PaymentPage />} />} />
        <Route path="/payment-success" element={<PrivateRoute element={<PaymentSuccessPage />} />} />
        <Route path="/your-orders" element={<PrivateRoute element={<OrderPage />} />} />
        <Route path="/AdminOrderPage" element={<PrivateRoute element={<AdminOrderPage />} />} />
        <Route path="/your-orders" element={<PrivateRoute element={<UserOrders />} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}