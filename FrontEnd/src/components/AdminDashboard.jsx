import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const [profileResponse, statsResponse] = await Promise.all([
          axios.get("https://project-cse-2200-xi.vercel.app/api/admin/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://project-cse-2200-xi.vercel.app/api/admin/dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileResponse.data.success) {
          setAdminData(profileResponse.data.admin);
        } else {
          setError("Failed to fetch admin data");
        }

        if (statsResponse.data.success) {
          setDashboardStats(statsResponse.data.stats);
        } else {
          setError("Failed to fetch dashboard stats");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUsersChartData = () => {
    return {
      labels: ['Total Users'],
      datasets: [
        {
          label: 'Number of Users',
          data: [dashboardStats.totalUsers],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  const getCartItemsChartData = () => {
    return {
      labels: dashboardStats.topProducts.map(product => product.title),
      datasets: [
        {
          data: dashboardStats.topProducts.map(product => product.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
        },
      ],
    };
  };

  const getOverviewChartData = () => {
    return {
      labels: ['Users', 'Cart Items', 'Products'],
      datasets: [
        {
          label: 'Overview',
          data: [dashboardStats.totalUsers, dashboardStats.totalCartItems, dashboardStats.totalProducts],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!adminData || !dashboardStats) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">Admin Profile</h2>
          <p><strong>Name:</strong> <span className="text-red-600">{adminData.name}</span></p>
          <p><strong>Email:</strong> <span className="text-red-600">{adminData.email}</span></p>
        </div>
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">User Statistics</h2>
          <Bar data={getUsersChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">Top Products in Cart</h2>
          <Pie data={getCartItemsChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <Line data={getOverviewChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;