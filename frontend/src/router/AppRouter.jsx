import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import Eventdetail from "../pages/Events/Eventdetail";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Navbar2 from "../components/Navbar2";
import { AuthContext } from "../context/AuthContext";
import PaymentPage from "../pages/Payment/PaymentPage";

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar2 />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Eventdetail />} />
        <Route path="/payment" element={<PaymentPage/>}/>

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
