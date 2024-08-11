import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import { ThreeDots } from "react-loader-spinner";
import { FaHeart, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function Home({ categories, isAuthenticated, selectedCategory, sortOrder }) {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = products;

      // Filter by selected categories
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((product) =>
          selectedCategories.includes(product.category.toLowerCase().trim())
        );
      } else if (category || selectedCategory) {
        const filterCategory = (category || selectedCategory).toLowerCase().trim();
        filtered = filtered.filter(
          (product) => product.category.toLowerCase().trim() === filterCategory
        );
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by price range
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Sort the filtered products based on the sortOrder
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });

      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [products, category, selectedCategory, searchQuery, sortOrder, selectedCategories, priceRange]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange([priceRange[0], parseInt(event.target.value)]);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSearchQuery("");
  };

  const handleAddToFavorites = (product) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your favorites.");
      return;
    }

    const newFavorites = [...favorites];
    const index = newFavorites.findIndex((fav) => fav._id === product._id);

    if (index !== -1) {
      newFavorites.splice(index, 1);
      toast.success("Removed from favorites");
    } else {
      newFavorites.push(product);
      toast.success("Added to favorites");
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav._id === productId);
  };

  const handleProductClick = (productId) => {
    if (isAuthenticated || !isAuthenticated) {
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
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <FaFilter />
            </button>
          </div>
          {showFilters && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedCategories.includes(category.toLowerCase())}
                      onChange={() => handleCategoryChange(category.toLowerCase())}
                    />
                    <span className="ml-2">{category}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={handlePriceRangeChange}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#ec4899"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div
                    className="w-full h-48 bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${product.image})` }}
                    onClick={() => handleProductClick(product._id)}
                  ></div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-pink-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {product.category}
                      </span>
                      <button
                        className={`text-2xl ${
                          isFavorite(product._id)
                            ? "text-pink-500"
                            : "text-gray-400"
                        } hover:text-pink-500`}
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

      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default Home;