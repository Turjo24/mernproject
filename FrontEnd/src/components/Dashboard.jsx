import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./FormElement/Sidebar";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setLoggedInUser(data.name);
          setUserEmail(data.email);
          setUserRole(data.role);
          localStorage.setItem("loggedInUser", data.name);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userRole", data.role);
        } else {
          console.error("Failed to fetch user data");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/login");
      }
    };

    const user = localStorage.getItem("loggedInUser");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (user && email && role) {
      setLoggedInUser(user);
      setUserEmail(email);
      setUserRole(role);
    } else {
      fetchUserData();
    }
  }, [navigate]);

  if (!loggedInUser) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-3/5 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              {userRole === "admin" ? (
                <AdminDashboard
                  loggedInUser={loggedInUser}
                  userEmail={userEmail}
                />
              ) : (
                <UserDashboard
                  loggedInUser={loggedInUser}
                  userEmail={userEmail}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
