import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./FormElement/Sidebar";
import { ThreeDots } from "react-loader-spinner";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      console.log("Fetching cart items for user:", userId);
      fetchCartItems();
    } else {
      console.log("User not logged in");
      setError("User not logged in");
      setLoading(false);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://project-cse-2200.vercel.app/api/cart/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      console.log("Received cart items:", data);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (e, productId, newQuantity) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://project-cse-2200.vercel.app/api/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId, quantity: newQuantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(error.message);
    }
  };

  const removeItem = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://project-cse-2200.vercel.app/api/cart/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error.message);
    }
  };

  const handleBuyNow = (e, item) => {
    e.preventDefault();
    navigate("/payment", { state: { items: [item], totalAmount: item.price * item.quantity } });
  };

  const handleBuyAll = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://project-cse-2200-ui-mu.vercel.app/api/cart/buyall/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to buy all items");
      }
      const data = await response.json();
      const totalAmount = data.items.reduce((total, item) => total + item.price * item.quantity, 0);
      navigate("/payment", { state: { items: data.items, totalAmount } });
    } catch (error) {
      console.error("Error buying all items:", error);
      setError(error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-grow overflow-hidden">
          <div className=" min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-2/3 p-4 mx-auto">
            <h1 className="max-w-2xl mx-auto text-center font-bold text-2xl mb-10">
              Your Cart
            </h1>
            {cartItems.length === 0 ? (
              <p className="flex justify-center items-center h-full">
                Your cart is empty.
              </p>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between border-b py-2 mb-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-5 h-40"
                  >
                    <div className="flex flex-col w-80 overflow-hidden text-ellipsis">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="flex">Price: ${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) =>
                          updateQuantity(
                            e,
                            item.productId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 bg-gray-200 rounded-md"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={(e) =>
                          updateQuantity(e, item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded-md"
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={(e) => removeItem(e, item.productId)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md mr-10"
                      >
                        Remove
                      </button>

                      <button
                        onClick={(e) => handleBuyNow(e, item)}
                        className="px-2 py-1 bg-green-500 text-white rounded-md"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleBuyAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Buy All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;