import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4">Your order has been saved and is being processed.</p>
      {orderId && <p className="mb-4">Order ID: {orderId}</p>}
      <Link to="/your-orders" className="px-4 py-2 bg-green-500 text-white mr-4">
        View Your Orders
      </Link>
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white">
        Back to Home
      </Link>
    </div>
  );
};

export default PaymentSuccessPage