import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import { ThreeDots } from 'react-loader-spinner';
import { FaFilter } from 'react-icons/fa';

function Home({ categories }) {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const { category } = useParams();

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
    }, 1500);

    return () => clearTimeout(timer);
  }, [products, category, searchQuery, selectedCategory, sortOrder]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center w-full max-w-4xl px-4">
            <SearchBar
              placeholder="Search for products"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow py-2 px-4 border border-gray-300 rounded-lg shadow-md"
            />
            <button
              onClick={toggleFilters}
              className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
              aria-label="Toggle Filters"
            >
              <FaFilter size={20} />
            </button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap mt-4 justify-center w-full max-w-4xl px-4 gap-4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
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
                className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-wrap overflow-x-hidden overflow-y-auto p-2 sm:p-5 justify-center">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/details/${product._id}`}
                  className="w-full sm:w-[45%] md:w-[30%] lg:w-[20%] xl:w-[15%] h-[40vh] bg-white rounded-lg shadow-md m-2 sm:m-5 flex-col justify-center items-center"
                >
                  <div
                    className="w-full h-[80%] bg-cover bg-no-repeat bg-center hover:scale-110"
                    style={{ backgroundImage: `url(${product.image})` }}
                    alt={product.title}
                  ></div>
                  <h3 className="p-3 text-sm truncate">{product.title}</h3>
                  <p className="p-2 text-gray-600">${product.price}</p>
                </Link>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="mb-4">Follow us on social media:</p>
          <div className="flex justify-center space-x-4 mb-4">
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
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
