// src/pages/CustomerSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CustomerSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-primary-dark flex flex-col items-center justify-center text-cream">
      <div className="bg-primary p-6 rounded-lg shadow-lg border border-light-blue/30 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Billing · Select Customer</h1>
        <p className="text-sm text-light-blue mb-6">
          Choose an existing customer or create a new one to start billing.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-primary-dark hover:bg-primary text-cream border border-light-blue/40"
            onClick={() => navigate("/customers")}
          >
            Select Existing Customer
          </Button>

          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white"
            onClick={() => navigate("/customers?new=true")}
          >
            Go to Customers Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelect;
