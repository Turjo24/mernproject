import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import { ThreeDots } from "react-loader-spinner";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

function Home({ categories, isAuthenticated, selectedCategory, sortOrder }) {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = products;

      if (category || selectedCategory) {
        const filterCategory = (category || selectedCategory)
          .toLowerCase()
          .trim();
        filtered = filtered.filter(
          (product) => product.category.toLowerCase().trim() === filterCategory
        );
      }

      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [products, category, selectedCategory, searchQuery, sortOrder]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
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
          </div>
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
