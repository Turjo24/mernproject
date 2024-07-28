import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`https://project-cse-2200.vercel.app/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response:', response.data); // Log the entire response
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-md">
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Total Amount: ${order.totalAmount?.toFixed(2) || 'N/A'}</p>
              <p>Status: {order.status || 'N/A'}</p>
              <p>Payment Method: {order.paymentMethod || 'N/A'}</p>
              <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p>Shipping Address: {order.shipping?.address || 'Not provided'}</p>
              <div className="mt-2">
                <h3 className="font-semibold">Products:</h3>
                {order.products && order.products.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {order.products.map((product, index) => (
                      <li key={product.productId || index}>
                        {product.productId?.title || 'Unknown Product'} - 
                        Quantity: {product.quantity || 'N/A'}, 
                        Price: ${product.price?.toFixed(2) || 'N/A'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No products in this order</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
