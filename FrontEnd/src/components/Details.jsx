import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner';
import { toast } from "react-toastify";

const Details = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserRole("guest");
          return;
        }
        const response = await fetch("https://project-cse-2200.vercel.app/api/user/role", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          throw new Error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserRole("guest");
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://project-cse-2200.vercel.app/api/products/${id}`,
          {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized access. Please log in.");
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setEditProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
        if (error.message === "Unauthorized access. Please log in.") {
          toast.error("Please log in to view product details");
          navigate("/LogInPage");
        }
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id, navigate]);

  const ProductDeleteHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://project-cse-2200.vercel.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      toast.success("Product deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product: " + error.message);
    }
  };

  const ProductEditHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      title: editProduct.title,
      category: editProduct.category,
      price: editProduct.price,
      description: editProduct.description,
      image: editProduct.image,
    };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://project-cse-2200.vercel.app/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      const data = await response.json();
      setProduct(data);
      setIsEditing(false);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product: " + error.message);
    }
  };
  
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to add items to cart");
      navigate("/LogInPage");
      return;
    }
  
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(
        "https://project-cse-2200.vercel.app/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            productId: id,
            quantity,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await response.json();
      toast.success("Item added to cart successfully");
      navigate('/CartPage');
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(`Failed to add product to cart: ${error.message}`);
    }
  };
  
  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Product not found</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <div className="container max-w-4xl mx-auto p-4 md:p-10 bg-white shadow-2xl rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <img
            className="object-contain h-64 md:h-96 w-full md:w-1/2 mb-4 md:mb-0 rounded"
            src={product.image}
            alt={product.title}
          />
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              {product.title}
            </h1>
            <h3 className="text-lg md:text-xl text-gray-500 mb-2 md:mb-4">
              Category: {product.category}
            </h3>
            <h2 className="text-xl md:text-2xl text-red-500 mb-2 md:mb-4">
              $ {product.price}
            </h2>
            <p className="text-base md:text-lg mb-4">{product.description}</p>
            {isEditing ? (
              <form onSubmit={ProductEditHandler} className="space-y-4">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={editProduct.title}
                    onChange={(e) => setEditProduct({...editProduct, title: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700">Category</label>
                  <input
                    type="text"
                    id="category"
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-bold text-gray-700">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-bold text-gray-700">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={editProduct.image}
                    onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="rounded bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4">
                    Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4 md:space-y-0">
                {userRole === "admin" ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 w-full md:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={ProductDeleteHandler}
                      className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 w-full md:w-auto"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                        }
                        className="rounded-l bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4"
                      >
                        -
                      </button>
                      <span className="bg-white text-black font-bold py-2 px-4">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="rounded-r bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="rounded bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 w-full md:w-auto"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;