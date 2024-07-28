import React, { useEffect, useState } from "react";

const AllCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await fetch("https://project-cse-2200.vercel.app/api/admin/cartitems", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        console.log("Fetched cart items:", data);
        if (data.success && Array.isArray(data.cartItems)) {
          setCartItems(data.cartItems);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">All Cart Items</h2>
      {cartItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.user ? `${item.user.name} (${item.user.email})` : 'N/A'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.product ? item.product.title : 'N/A'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.product ? `$${item.product.price.toFixed(2)}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">No cart items found.</p>
      )}
    </div>
  );
};

export default AllCartItems;