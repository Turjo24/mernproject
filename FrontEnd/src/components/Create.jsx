import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import Navbar from "./Navbar";
import Sidebar from "./FormElement/Sidebar";

const Create = ({ addCategory }) => {
  const [products, setProducts] = useContext(productContext);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const generateRandomId = () => Math.floor(Math.random() * 900) + 100;

  const normalizeCategory = (cat) => cat.trim().toLowerCase();

  const addProduct = async () => {
    if (!title || !image || !category || !price || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const newProduct = {
      id: generateRandomId(),
      title,
      image,
      category: normalizeCategory(category),
      price,
      description,
    };

    try {
      const response = await fetch(
        "https://project-cse-2200.vercel.app/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      setProducts([...products, data]);

      // Add new category
      addCategory(normalizeCategory(category));

      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-3/5 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Add New Product
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addProduct();
                }}
                className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    placeholder="Category"
                    value={category}
                    onChange={(e) =>
                      setCategory(normalizeCategory(e.target.value))
                    } // Normalize input here
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="image"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
