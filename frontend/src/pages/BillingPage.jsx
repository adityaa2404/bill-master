import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ScrollableBillItems from "@/components/ScrollableBillItems";
import SectionAccordion from '@/components/SectionAccordion';
import CustomerSection from '@/components/CustomerSection';
import { useNavigate } from "react-router-dom";
import { setSelectedCustomer } from "@/store/customerSlice";
import api from "@/config/api";
const BillingPage = () => {

  const [allItems, setAllItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const customer = useSelector((s) => s.customers.selectedCustomer);
  const navigate = useNavigate();

  // Redirect if no customer selected
  useEffect(() => {
    if (customer === undefined) return; 
    if (!customer) navigate("/customer-select");
  }, [customer, navigate]);

  // Fetch items
  useEffect(() => {
  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setAllItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };
  fetchItems();
}, []);

const handleCreateItem = async () => {
  if (!newItemName.trim()) return;

  try {
    const res = await api.post("/items", {
      name: newItemName,
      unit: "Nos",
    });

    setAllItems((prev) => [res.data, ...prev]);
    setNewItemName("");
  } catch (err) {
    console.error("Error adding item:", err);
  }
};


  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uiItems = filteredItems.map((item) => ({
    id: item._id,
    title: item.name,
    unit: item.unit
  }));

  const [activeTab, setActiveTab] = useState("items");

  return (
    <div className="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-primary-dark font-[Poppins] text-cream">

      {/* LEFT PANEL */}
      <div className={`md:flex md:w-1/3 lg:w-1/4 bg-primary p-4 border-r border-light-blue/20 flex-col min-h-0 
        ${activeTab === "items" ? "flex" : "hidden"}`}>

        <h2 className="text-lg font-bold mb-4 text-cream">Items</h2>

        <div className="flex flex-col gap-3 w-full mb-2">

          {/* Add Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Add New Item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateItem()}
              className="h-10 bg-primary-dark/50 border-light-blue/30 text-cream"
            />

            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateItem}
              className="h-10 px-4 border-accent text-accent"
            >
              Add
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search Item"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 bg-primary-dark/50 border-light-blue/30 text-cream"
            />

            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="h-10 px-3 text-light-blue"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="grow overflow-y-auto pr-2">
          <ScrollableBillItems items={uiItems} />
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className={`md:flex md:flex-1 flex-col overflow-hidden 
        ${activeTab === "bill" ? "flex" : "hidden"}`}>

        <div className="px-4 pt-3 pb-1">
          <CustomerSection />
        </div>

        <div className="flex-1 overflow-hidden p-4 pt-0">
          <SectionAccordion />
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-primary-dark border-t border-light-blue/20 flex justify-around items-center z-50">

        <button
          onClick={() => setActiveTab("items")}
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === "items"
              ? "text-accent bg-white/5 border-t-2 border-accent"
              : "text-light-blue"
          }`}
        >
          <Layers size={24} className="mb-1" />
          <span className="text-xs">Items</span>
        </button>

        <button
          onClick={() => setActiveTab("bill")}
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === "bill"
              ? "text-accent bg-white/5 border-t-2 border-accent"
              : "text-light-blue"
          }`}
        >
          <ShoppingCart size={24} className="mb-1" />
          <span className="text-xs">Bill</span>
        </button>

      </div>

    </div>
  );
};

export default BillingPage;
