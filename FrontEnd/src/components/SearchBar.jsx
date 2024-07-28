import React from "react";

const SearchBar = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative w-full max-w-md">
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-r-md border border-green-500 focus:outline-none"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
