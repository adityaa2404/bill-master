// src/pages/Customers.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { setSelectedCustomer, fetchCustomers, createCustomer } from "@/store/customerSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Customers = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load customers from Redux
  const customers = useSelector((s) => s.customers.list);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Load backend customers on page load
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // If URL ?new=true → auto open form
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);

  // Select customer → save in redux → go to billing
  const handleSelectCustomer = (cust) => {
    dispatch(setSelectedCustomer(cust));
    navigate("/billing");
  };

  // Submit new customer → save to DB
  const onSubmit = async (data) => {
    try {
      const action = await dispatch(createCustomer(data));
      const newCustomer = action.payload; // backend returned object with _id

      dispatch(setSelectedCustomer(newCustomer)); 
      reset();
      setShowForm(false);
      navigate("/billing");
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark text-cream p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Customers</h1>
          <Button
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "Create New Customer"}
          </Button>
        </div>

        {/* CUSTOMER LIST */}
        <div className="bg-primary rounded-lg border border-light-blue/30 p-3 mb-4">
          <h2 className="text-sm font-semibold mb-2">Existing Customers</h2>

          {customers.length === 0 ? (
            <p className="text-xs text-light-blue">No customers found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {customers.map((c) => (
                <div
                  key={c._id}
                  className="flex justify-between items-center bg-primary-dark/60 border border-light-blue/20 rounded-md px-3 py-2 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-light-blue">
                      {c.phone || "--"}
                    </span>
                    <span className="text-light-blue/80">
                      {c.address || "--"}
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

        {/* NEW CUSTOMER FORM */}
        {showForm && (
          <div className="bg-primary rounded-lg border border-accent/40 p-4 mt-2">
            <h2 className="text-sm font-semibold mb-3">Create New Customer</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 text-xs">
              <Input
                placeholder="Name"
                {...register("name", { required: true })}
                className="bg-primary-dark/50 border-light-blue/40"
              />

              <Input
                placeholder="Phone"
                {...register("phone")}
                className="bg-primary-dark/50 border-light-blue/40"
              />

              <Input
                placeholder="Address"
                {...register("address")}
                className="bg-primary-dark/50 border-light-blue/40"
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
