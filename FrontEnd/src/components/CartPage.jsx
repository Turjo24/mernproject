import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      console.log('Fetching cart items for user:', userId);
      fetchCartItems();
    } else {
      console.log('User not logged in');
      setError("User not logged in");
      setLoading(false);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      console.log('Received cart items:', data);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
      setError(error.message);
    }
  };

  const handleBuyNow = () => {
    navigate('/payment');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b py-2">
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p>Price: ${item.price}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 bg-gray-200">-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 bg-gray-200">+</button>
                <button onClick={() => removeItem(item.productId)} className="ml-4 px-2 py-1 bg-red-500 text-white">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <button onClick={handleBuyNow} className="px-4 py-2 bg-green-500 text-white">Buy Now</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;