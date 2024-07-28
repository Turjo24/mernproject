import React from 'react';
import AllUsers from './AllUsers';
import AllCartItems from './AllCartItems';

const AdminDashboard = ({ loggedInUser, userEmail }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {loggedInUser} ({userEmail})</p>
    </div>
  );
};

export default AdminDashboard;