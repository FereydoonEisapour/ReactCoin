import React from "react";
import { useAuthState } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  const { user } = useAuthState();
  if (!user) return <Navigate to="/" />;
  return <div>Dashboard</div>;
};

export default Dashboard;
