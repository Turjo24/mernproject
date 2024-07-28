import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`https://project-cse-2200.vercel.app/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4">
            <p>Order ID: {order._id}</p>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Status: {order.status}</p>
            <h3 className="font-semibold mt-2">Products:</h3>
            {order.products.map((product) => (
              <div key={product._id} className="ml-4">
                <p>{product.productId.title} - Quantity: {product.quantity}, Price: ${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;