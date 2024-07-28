import React, { useEffect, useState } from "react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const API_BASE_URL = "https://project-cse-2200.vercel.app/api/admin";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const userToSave = users.find(user => user._id === id);
    const token = localStorage.getItem("accessToken");

    try {
      // Adjust this URL and method as needed
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT", // or "PATCH" if your API uses PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userToSave)
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => user._id === id ? userToSave : user));
        setEditingId(null);
      } else {
        throw new Error(data.message || "Failed to save user");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      // Adjust this URL as needed
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User No.</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => {
                          const updatedUsers = users.map(u => 
                            u._id === user._id ? { ...u, name: e.target.value } : u
                          );
                          setUsers(updatedUsers);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={user.role}
                        onChange={(e) => {
                          const updatedUsers = users.map(u => 
                            u._id === user._id ? { ...u, role: e.target.value } : u
                          );
                          setUsers(updatedUsers);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {editingId === user._id ? (
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">No users found.</p>
      )}
    </div>
  );
};

export default AllUsers;