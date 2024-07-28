import React, { useState } from "react";
import axios from "axios";

const EditProduct = ({ product, onUpdate, onCancel }) => {
  const [editProduct, setEditProduct] = useState({
    title: product.title,
    category: product.category,
    price: product.price,
    description: product.description,
    image: product.image,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      title: editProduct.title,
      category: editProduct.category,
      price: editProduct.price,
      description: editProduct.description,
      image: editProduct.image,
    };

    try {
      const { data } = await axios.put(
        `https://fakestoreapi.com/products/${product.id}`,
        updatedProduct
      );
      onUpdate(data);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={editProduct.title}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={editProduct.category}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={editProduct.price}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={editProduct.description}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          name="image"
          value={editProduct.image}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="rounded bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
