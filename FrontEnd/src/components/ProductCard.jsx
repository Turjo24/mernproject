import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product, isAuthenticated, onAddToFavorites }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      setIsFavorite(!isFavorite);
      onAddToFavorites(product);
    } else {
      // Redirect to login page or show login modal
      alert("Please log in to add items to your favorites.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="mt-2 text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">{product.category}</span>
          <button
            className={`text-2xl ${isFavorite ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500`}
            onClick={handleFavoriteClick}
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;