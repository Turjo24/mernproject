import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://project-cse-2200-xi.vercel.app/api/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAdminData(response.data.admin);
        } else {
          setError("Failed to fetch admin data");
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to fetch admin data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!adminData) {
    return <div>No admin data available</div>;
  }

  return (
    <div className="max-w-400px mx-auto h-900px p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
        <div className="mt-4">
          <p>
            <strong>Name:</strong>{" "}
            <span className="text-red-600">{adminData.name}</span>
          </p>
        </div>
        <div className="mt-4">
          <p>
            <strong>Email:</strong>{" "}
            <span className="text-red-600">{adminData.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
