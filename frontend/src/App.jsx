import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import Customers from "./pages/Customers";
import BillingPage from "./pages/BillingPage";
import CustomerSelect from "./pages/CustomerSelect";
import PinGuard from "@/components/PinGuard";
import { useState } from "react";
const App = () => {

  return (
    <PinGuard>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customer-select" element={<CustomerSelect />} />
    </Routes>
    </PinGuard>
  );
};

export default App;

{/* <Route path="/billing" element={<BillingPage />} />
        <Route path="/customer-select" element={<CustomerSelect />} />
        <Route path="/customers" element={<Customers />} /> */}
