import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import { ThreeDots } from 'react-loader-spinner';

function Home({ categories }) {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { category } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (category) {
        setFilteredProducts(
          products.filter(
            (product) =>
              product.category.toLowerCase().trim() ===
              category.toLowerCase().trim()
          )
        );
      } else {
        setFilteredProducts(products);
      }
      setIsLoading(false);
    }, 1500); // Simulating a delay of 1.5 seconds

    return () => clearTimeout(timer);
  }, [products, category]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <div className="justify-center items-center flex mt-4">
        <SearchBar
          placeholder="Search for products"
          value={searchQuery}
          onChange={handleSearchChange}
        />
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
                className="w-full sm:w-[45%] md:w-[30%] lg:w-[20%] xl:w-[13%] h-[30vh] bg-white rounded-lg shadow-md m-2 sm:m-5 flex-col justify-center items-center"
              >
                <div
                  className="w-full h-[80%] bg-cover bg-no-repeat bg-center hover:scale-110"
                  style={{ backgroundImage: `url(${product.image})` }}
                  alt={product.title}
                ></div>
                <h3 className="p-3 text-sm truncate">{product.title}</h3>
              </Link>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
    </>
  );
}

export default Home;