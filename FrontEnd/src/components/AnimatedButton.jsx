import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const AnimatedButton = ({ initialText, successText, onClick, isSuccess }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <button
      onClick={onClick}
      disabled={isAnimating}
      className={`
        relative flex items-center justify-center
        w-full sm:w-4/6 py-4 px-4
        border border-transparent rounded-full
        text-sm font-medium text-white
        transition-all duration-300
        overflow-hidden
        ${
          isAnimating
            ? "bg-green-500 bg-opacity-80 hover:bg-green-600"
            : "bg-indigo-500 bg-opacity-80 hover:bg-indigo-600"
        }
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            flex items-center justify-center
            transition-all duration-300 transform
            ${isAnimating ? "opacity-0 translate-y-full" : "opacity-100"}
          `}
        >
          <span>{initialText}</span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            flex items-center justify-center
            transition-all duration-300 transform
            ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }
          `}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-white text-lg mr-2"
          />
          <span>{successText}</span>
        </div>
      </div>
    </button>
  );
};

export default AnimatedButton;
