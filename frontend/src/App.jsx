import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Customer from "./pages/Customer";
import Items from "./pages/Items";
import Laundry from "./pages/Loundary";
import Ironing from "./pages/Ironing";
import Dash from "./components/Dash";
import AdminDashboard from "./components/AdminDashboard";
import Cashiers from "./pages/RegisterCustomer";
import ProfileCashier from "./pages/ProfileCashier";
import AdminProfile from "./pages/AdminProfile";
import ProtectAdmin from "./components/ProtectAdmin";

const App = () => {
  return (
    <Routes>

      {/* Login & Register without sidebar */}
      <Route path="/" element={<Login />} />
      <Route path="/reg" element={<Register />} />

        {/* this     is cashier  protect */}
      {/* Dashboard Layout WITH sidebar */}
      <Route path="/dashboard" element={<Dashboard />}>
      <Route path="dash" element={<Dash />} />
        {/* CHILD ROUTES = appear inside <Outlet /> */}
        <Route path="customers" element={<Customer />} />
        <Route path="items" element={<Items />} />
        <Route path="laundry" element={<Laundry />} />
        <Route path="ironing" element={<Ironing />} />
        <Route path="profile" element={<ProfileCashier />} />

        {/* default dashboard page */}
        <Route index element={<h1 className="text-xl">Welcome to Dashboard</h1>} />

      </Route>
      {/* this is admin protect */}
      <Route
  path="/admin"
  element={
    <ProtectAdmin>
      <AdminDashboard />
    </ProtectAdmin>
  }
>
  <Route path="dash" element={<Dash />} />
  <Route path="register-cashier" element={<Cashiers />} />
  <Route path="profile" element={<AdminProfile />} />
</Route>

    </Routes>
  );
};

export default App;
