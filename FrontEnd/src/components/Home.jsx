import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import { ThreeDots } from 'react-loader-spinner';
import { FaFilter, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Home({ categories, isAuthenticated }) {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = products;

      if (category) {
        filtered = filtered.filter(
          (product) =>
            product.category.toLowerCase().trim() ===
            category.toLowerCase().trim()
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          (product) =>
            product.category.toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );
      }

      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (sortOrder === "asc") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [products, category, searchQuery, selectedCategory, sortOrder]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddToFavorites = (product) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your favorites.");
      return;
    }

    const newFavorites = [...favorites];
    const index = newFavorites.findIndex(fav => fav._id === product._id);

    if (index !== -1) {
      newFavorites.splice(index, 1);
      toast.success("Removed from favorites");
    } else {
      newFavorites.push(product);
      toast.success("Added to favorites");
    }

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  const handleProductClick = (productId) => {
    if (isAuthenticated) {
      navigate(`/details/${productId}`);
    } else {
      toast.error("Please log in to view product details.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <SearchBar
              placeholder="Search for products"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow max-w-xl py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={toggleFilters}
              className="ml-4 p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              aria-label="Toggle Filters"
            >
              <FaFilter size={20} />
            </button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap mt-4 gap-4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots height="80" width="80" radius="9" color="#ec4899" ariaLabel="three-dots-loading" visible={true} />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div
                    className="w-full h-48 bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${product.image})` }}
                    onClick={() => handleProductClick(product._id)}
                  ></div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
                    <p className="mt-2 text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{product.category}</span>
                      <button
                        className={`text-2xl ${isFavorite(product._id) ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500`}
                        onClick={() => handleAddToFavorites(product)}
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No products found
              </p>
            )}
          </div>
        </div>
      )}
      
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">Your company description here.</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-sm">
                <li className="mb-2"><a href="#" className="hover:text-gray-400">Home</a></li>
                <li className="mb-2"><a href="#" className="hover:text-gray-400">Products</a></li>
                <li className="mb-2"><a href="#" className="hover:text-gray-400">About</a></li>
                <li className="mb-2"><a href="#" className="hover:text-gray-400">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-400">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <form className="flex">
                <input type="email" placeholder="Your email" className="flex-grow p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <button type="submit" className="bg-pink-600 text-white px-4 rounded-r-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;