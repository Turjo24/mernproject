import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import Sidebar from "./FormElement/Sidebar";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const lastSeenOrderId = localStorage.getItem("lastSeenOrderId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://project-cse-2200.vercel.app/api/orders/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setOrders(response.data.orders);
      if (response.data.orders.length > 0) {
        const latestOrderId = response.data.orders[0]._id;
        localStorage.setItem("lastSeenOrderId", latestOrderId);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center text-lg mt-5">
        Error: {error}
      </div>
    );

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-grow overflow-hidden">
          <div className=" min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-2/3 p-4 mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Your Orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-center mt-40 text-gray-600 text-lg">
                You have no orders yet.
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className={`mb-6 bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    order.status === "Paid"
                      ? "border-green-500"
                      : "border-red-500"
                  } ${
                    lastSeenOrderId && order._id === lastSeenOrderId
                      ? "border-yellow-500"
                      : ""
                  }`}
                >
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Order ID: {order._id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="mb-2">
                      Total Amount: ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="mb-4">
                      Payment Method: {order.paymentMethod}
                    </p>
                    <h4 className="font-semibold mb-2">Products:</h4>
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          {product.productId ? (
                            <p>
                              {product.productId.title} - Quantity:{" "}
                              {product.quantity}, Price: $
                              {product.price.toFixed(2)}
                            </p>
                          ) : (
                            <p className="text-gray-500">
                              Product no longer available - Quantity:{" "}
                              {product.quantity}, Price: $
                              {product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
