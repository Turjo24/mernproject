import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create a context for products
export const productContext = createContext();

const Context = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://project-cse-2200.vercel.app/api/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // You might want to add some error handling here, e.g., setting an error state
      }
    };

    fetchProducts();
  }, []);

  return (
    <productContext.Provider value={[products, setProducts]}>
      {children}
    </productContext.Provider>
  );
};

export default Context;
