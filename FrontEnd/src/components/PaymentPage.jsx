import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePayment = async () => {
    if (!address.trim()) {
      setError('Please enter a valid address.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('https://project-cse-2200.vercel.app/api/orders/create',
        { userId, paymentMethod, address },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` } }
      );
      if (response.data.success) {
        navigate('/payment-success', { state: { orderId: response.data.orderId } });
      } else {
        setError('Failed to create order. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <div className="mb-4">
        <label className="block mb-2">Address:</label>
        <textarea
          value={address}
          onChange={handleAddressChange}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Enter your full address"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          Online Payment
        </label>
        <label className="block">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          Cash on Delivery
        </label>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={!paymentMethod || !address.trim() || isLoading}
        className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default PaymentPage;