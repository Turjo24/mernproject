import React, { useState } from "react";

const SearchBar = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="p-1 w-[60%] flex justify-between items-center">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="px-4 py-3 rounded-md border border-gray-800 focus:outline-none focus:border-indigo-500 w-[90%] h-10 mr-2"
      />
      <button className="rounded float-right text-white bg-green-500 hover:bg-green-400 font-bold py-2 px-4 border-b-4 hover:border-green-500">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
