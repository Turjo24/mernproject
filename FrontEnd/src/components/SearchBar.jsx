import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full max-w-xl mx-auto">
      <div className="relative w-full">
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full px-4 py-2 pl-10 pr-12 text-sm text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:bg-white transition-colors duration-300"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch className="text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-medium text-white bg-pink-500 rounded-r-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-300"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;