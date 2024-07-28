import React, { useState } from "react";

function Password({ name, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-4">
      <label
        className="block text-sm font-semibold text-gray-700"
        htmlFor="password"
      >
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-0 end-0 p-3.5 rounded-md"
        >
          <svg
            className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className={showPassword ? "hidden" : "hs-password-active:hidden"}
              d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
            />
            <path
              className={showPassword ? "hidden" : "hs-password-active:hidden"}
              d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
            />
            <path
              className={showPassword ? "hidden" : "hs-password-active:hidden"}
              d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
            />
            <line
              className={showPassword ? "hidden" : "hs-password-active:hidden"}
              x1="2"
              x2="22"
              y1="2"
              y2="22"
            />
            <path
              className={showPassword ? "hs-password-active:block" : "hidden"}
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
            />
            <circle
              className={showPassword ? "hs-password-active:block" : "hidden"}
              cx="12"
              cy="12"
              r="3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Password;
