// src/pages/Customers.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setCustomer } from "@/store/billingSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Test User",
    phone: "9999999999",
    email: "test@example.com",
    address: "Pune",
  },
  {
    id: "2",
    name: "Second User",
    phone: "8888888888",
    email: "second@example.com",
    address: "Mumbai",
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  // If URL has ?new=true -> open form directly
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);

  const handleSelectCustomer = (cust) => {
    dispatch(setCustomer(cust));
    navigate("/billing");
  };

  const onSubmit = async (data) => {
    // Here you will call backend later
    const newCustomer = {
      id: String(Date.now()),
      ...data,
    };

    setCustomers((prev) => [...prev, newCustomer]);
    dispatch(setCustomer(newCustomer));
    reset();
    setShowForm(false);
    navigate("/billing");
  };

  return (
    <div className="min-h-screen bg-primary-dark text-cream p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Customers</h1>
          <Button
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "Create New Customer"}
          </Button>
        </div>

        {/* List of customers */}
        <div className="bg-primary rounded-lg border border-light-blue/30 p-3 mb-4">
          <h2 className="text-sm font-semibold mb-2">Existing Customers</h2>
          {customers.length === 0 ? (
            <p className="text-xs text-light-blue">No customers yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center bg-primary-dark/60 border border-light-blue/20 rounded-md px-3 py-2 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-light-blue">
                      {c.phone} · {c.email}
                    </span>
                    <span className="text-light-blue/80">
                      {c.address}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-white text-[11px]"
                    onClick={() => handleSelectCustomer(c)}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* React Hook Form */}
        {showForm && (
          <div className="bg-primary rounded-lg border border-accent/40 p-4 mt-2">
            <h2 className="text-sm font-semibold mb-3">Create New Customer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 text-xs">
              <Input
                placeholder="Name"
                {...register("name", { required: true })}
                className="bg-primary-dark/50 border-light-blue/40 text-cream"
              />
              <Input
                placeholder="Phone"
                {...register("phone")}
                className="bg-primary-dark/50 border-light-blue/40 text-cream"
              />
              <Input
                placeholder="Email"
                type="email"
                {...register("email")}
                className="bg-primary-dark/50 border-light-blue/40 text-cream"
              />
              <Input
                placeholder="Address"
                {...register("address")}
                className="bg-primary-dark/50 border-light-blue/40 text-cream"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 bg-accent hover:bg-accent/90 text-white"
              >
                {isSubmitting ? "Saving..." : "Save Customer"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
