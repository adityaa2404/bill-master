import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import Customers from "./pages/Customers";
import BillingPage from "./pages/BillingPage";

const App = () => {
  return (
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
};

export default App;


