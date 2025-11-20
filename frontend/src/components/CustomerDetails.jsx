import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CustomerDetails() {
  const { register, handleSubmit, setValue } = useForm();
  const [suggestions, setSuggestions] = useState([]);
  const [isExisting, setIsExisting] = useState(false);

  const searchCustomer = async (query) => {
    if (!query) return setSuggestions([]);

    const mock = [
      { id: 1, name: "Aditya", phone: "99999", email: "adi@test.com" },
      { id: 2, name: "Rahul", phone: "88888", email: "rahul@test.com" },
    ];

    const filtered = mock.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const onSelect = (c) => {
    setValue("name", c.name);
    setValue("phone", c.phone);
    setValue("email", c.email);
    setIsExisting(true);
    setSuggestions([]);
  };

  const onSubmit = (data) => {
    console.log(isExisting ? "Existing:" : "New:", data);
  };

  return (
    <div className="bg-primary-dark/30 p-4 rounded-lg border border-accent mt-4 
     max-w-lg mx-auto w-full">

  <h2 className="text-xl font-bold text-white mb-4">Customer Details</h2>

  {/* Row: Name + Phone */}
  <div className="grid grid-cols-2 gap-4">
    <Input placeholder="Customer Name" />
    <Input placeholder="Phone" />
  </div>

  {/* Email full-width */}
  <div className="mt-4">
    <Input placeholder="Address" />
  </div>

  <Button className="mt-4" variant="outline">
    Save Customer
  </Button>
</div>

  );
}
