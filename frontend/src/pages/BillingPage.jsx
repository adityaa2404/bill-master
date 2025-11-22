// import React, { useState } from 'react'
// import { Separator } from "@/components/ui/separator"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Layers, ShoppingCart } from "lucide-react" // Mobile Tab Icons
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from 'react'
// import ScrollableBillItems from "@/components/ScrollableBillItems"
// import SectionAccordion from '@/components/SectionAccordion'
// import CustomerSection from '@/components/CustomerSection'
// import CustomerModal from '@/components/CustomerModal';
// import { useNavigate } from "react-router-dom";
  

// const BillingPage = () => {
//   const [allItems, setAllItems] = useState([]);
//   const [newItemName, setNewItemName] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showCustomerModal, setShowCustomerModal] = useState(true);

// const dispatch = useDispatch();
// const customer = useSelector((s) => s.billing.customer);
// const navigate = useNavigate();
// const handleSelectCustomer = (cust) => {
//   dispatch(setCustomer(cust));

//   setShowCustomerModal(false);
// };


//   useEffect(() => {
//     if (!customer || !customer.name) {
//       navigate("/customer-select");
//     }
//   }, [customer, navigate]);

// const handleCreateCustomer = () => {
//   alert("Open Create Customer Form here");
// };

//   // MOBILE STATE: Tabs
//   const [activeTab, setActiveTab] = useState("items");

//   const handleCreateItem = () => {
//     if (!newItemName.trim()) return;
//     const newItem = {
//       id: Date.now(), 
//       title: newItemName.trim()
//     };
//     setAllItems((prev) => [newItem, ...prev]); 
//     setNewItemName(""); 
//   };

//   const filteredItems = allItems.filter(item => 
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

// useEffect(() => {
//   const fetchItems = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/items");
//       setAllItems(res.data);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//     }
//   };

//   fetchItems();
// }, []);

//   return (
//     // LAYOUT: Fixed to viewport height
//     <div className="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-primary-dark font-[Poppins] text-cream relative">


//       {/* <CustomerModal
//     open={showCustomerModal}
//     onSelectCustomer={handleSelectCustomer}
//     onCreateCustomer={handleCreateCustomer}
//   /> */}
//       {/* =========================================
//           LEFT SIDE (Items Panel) 
//           Mobile: Only visible if tab is 'items'
//           Desktop: Always visible
//       ========================================= */}
//       <div className={`
//           md:flex md:w-1/3 lg:w-1/4 bg-primary p-4 md:p-6 border-r border-light-blue/20 flex-col min-h-0 z-10 shadow-xl
//           ${activeTab === 'items' ? 'flex w-full h-full' : 'hidden'}
//       `}>
        
//         <h2 className="text-lg md:text-xl font-bold mb-4 text-cream shrink-0 tracking-wide">Items</h2>

//         {/* --- INPUTS --- */}
//         <div className='flex flex-col gap-3 w-full shrink-0 mb-2'>
          
//           {/* Add Item */}
//           <div className="flex gap-2">
//             <Input 
//               placeholder="Add New Item" 
//               value={newItemName}
//               onChange={(e) => setNewItemName(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
//               className="h-10 text-sm bg-primary-dark/50 border-light-blue/30 text-cream placeholder:text-light-blue/50 focus-visible:ring-accent focus-visible:border-accent"
//             />
//             <Button 
//                 size="sm" 
//                 variant="outline" 
//                 onClick={handleCreateItem}
//                 className="h-10 px-4 border-accent text-accent hover:bg-accent hover:text-white"
//             >
//                 Add
//             </Button>
//           </div>

//           {/* Search Item */}
//           <div className="flex gap-2">
//             <Input 
//               placeholder="Search Item" 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="h-10 text-sm bg-primary-dark/50 border-light-blue/30 text-cream placeholder:text-light-blue/50 focus-visible:ring-accent focus-visible:border-accent"
//             />
//             {searchQuery && (
//               <Button 
//                   size="sm" 
//                   variant="ghost" 
//                   onClick={() => setSearchQuery("")}
//                   className="h-10 px-3 text-light-blue hover:text-white hover:bg-white/10"
//               >
//                   Clear
//               </Button>
//             )}
//           </div>

//         </div>

//         <div className='mt-4 mb-2 flex justify-between items-end shrink-0'>
//             <span className='text-xs font-medium text-light-blue uppercase tracking-wider'>
//                 {searchQuery ? "Search Results" : "All Items"}
//             </span>
//             <span className='text-xs text-light-blue/70'>{filteredItems.length} items</span>
//         </div>

//         {/* List - Added padding bottom for mobile nav */}
//         <div className="grow overflow-y-auto min-h-0 -mr-2 pr-2 pb-20 md:pb-0">
//           <ScrollableBillItems items={filteredItems} />
//         </div>
//       </div>


//       {/* =========================================
//           RIGHT SIDE (Bill/Sections) 
//           Mobile: Only visible if tab is 'bill'
//           Desktop: Always visible
//       ========================================= */}
//       <div className={`
//           md:flex md:flex-1 bg-primary-dark flex-col min-h-0 overflow-hidden
//           ${activeTab === 'bill' ? 'flex w-full h-full' : 'hidden'}
//       `}>
        
//         <div className="px-4 md:px-6 pt-3 pb-1">
//   <CustomerSection />
// </div>

//         <div className="flex-1 overflow-hidden min-h-0 p-4 md:p-6 pt-0 pb-20 md:pb-6">
//            <SectionAccordion />
//         </div>

//       </div>


//       {/* =========================================
//           MOBILE BOTTOM NAVIGATION BAR 
//       ========================================= */}
//       <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-primary-dark border-t border-light-blue/20 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        
//         <button 
//             onClick={() => setActiveTab("items")}
//             className={`flex flex-col items-center justify-center w-1/2 h-full transition-all duration-200
//                 ${activeTab === "items" ? "text-accent bg-white/5 border-t-2 border-accent" : "text-light-blue/70 hover:text-cream"}
//             `}
//         >
//             <Layers size={24} className="mb-1" />
//             <span className="text-xs font-medium">Items</span>
//         </button>

//         <button 
//             onClick={() => setActiveTab("bill")}
//             className={`flex flex-col items-center justify-center w-1/2 h-full transition-all duration-200
//                 ${activeTab === "bill" ? "text-accent bg-white/5 border-t-2 border-accent" : "text-light-blue/70 hover:text-cream"}
//             `}
//         >
//             <ShoppingCart size={24} className="mb-1" />
//             <span className="text-xs font-medium">Bill</span>
//         </button>

//       </div>

//     </div>
//   )
// }

// export default BillingPage


import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ScrollableBillItems from "@/components/ScrollableBillItems";
import SectionAccordion from '@/components/SectionAccordion';
import CustomerSection from '@/components/CustomerSection';
import { useNavigate } from "react-router-dom";

const BillingPage = () => {

  // ✔ DB Items State
  const [allItems, setAllItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(true);

  const dispatch = useDispatch();
  const customer = useSelector((s) => s.billing.customer);
  const navigate = useNavigate();

  const handleSelectCustomer = (cust) => {
    dispatch(setCustomer(cust));
    setShowCustomerModal(false);
  };

  // ✔ Fetch Customer On Page Load
  useEffect(() => {
    if (!customer || !customer.name) {
      navigate("/customer-select");
    }
  }, [customer, navigate]);

  const handleCreateCustomer = () => {
    alert("Open Create Customer Form here");
  };

  // ✔ Mobile Tab
  const [activeTab, setActiveTab] = useState("items");

  // ✔ Fetch Items from Backend (AXIOS)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/items");
        setAllItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  // ✔ Add item to backend (global items)
  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const res = await axios.post("http://localhost:8000/api/items", {
        name: newItemName,
        unit: "Nos"
      });

      setAllItems((prev) => [res.data, ...prev]);
      setNewItemName("");
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // ✔ Filter Items (DB uses item.name)
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✔ Convert to UI format (ScrollableBillItems expects id + title)
  const uiItems = filteredItems.map((item) => ({
    id: item._id,
    title: item.name,
    unit: item.unit
  }));

  return (
    <div className="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-primary-dark font-[Poppins] text-cream relative">

      {/* ================= LEFT PANEL (Items) ================= */}
      <div
        className={`md:flex md:w-1/3 lg:w-1/4 bg-primary p-4 md:p-6 border-r border-light-blue/20 flex-col min-h-0 z-10 shadow-xl
          ${activeTab === 'items' ? 'flex w-full h-full' : 'hidden'}`}
      >
        <h2 className="text-lg md:text-xl font-bold mb-4 text-cream">Items</h2>

        {/* ----- Add + Search ----- */}
        <div className="flex flex-col gap-3 w-full mb-2">

          {/* Add Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Add New Item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateItem()}
              className="h-10 text-sm bg-primary-dark/50 border-light-blue/30 text-cream"
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
              className="h-10 text-sm bg-primary-dark/50 border-light-blue/30 text-cream"
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

        {/* Header */}
        <div className="mt-4 mb-2 flex justify-between items-end">
          <span className="text-xs font-medium text-light-blue uppercase">
            {searchQuery ? "Search Results" : "All Items"}
          </span>
          <span className="text-xs text-light-blue/70">{uiItems.length} items</span>
        </div>

        {/* Scrollable Item List */}
        <div className="grow overflow-y-auto min-h-0 -mr-2 pr-2 pb-20 md:pb-0">
          <ScrollableBillItems items={uiItems} />
        </div>
      </div>

      {/* ================= RIGHT PANEL (Sections + Bill) ================= */}
      <div
        className={`md:flex md:flex-1 bg-primary-dark flex-col min-h-0 overflow-hidden
          ${activeTab === 'bill' ? 'flex w-full h-full' : 'hidden'}`}
      >
        <div className="px-4 md:px-6 pt-3 pb-1">
          <CustomerSection />
        </div>

        <div className="flex-1 overflow-hidden min-h-0 p-4 md:p-6 pt-0 pb-20 md:pb-6">
          <SectionAccordion />
        </div>
      </div>

      {/* ================= MOBILE NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-primary-dark border-t border-light-blue/20 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("items")}
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === "items" ? "text-accent bg-white/5 border-t-2 border-accent" : "text-light-blue"
          }`}
        >
          <Layers size={24} className="mb-1" />
          <span className="text-xs font-medium">Items</span>
        </button>

        <button
          onClick={() => setActiveTab("bill")}
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === "bill" ? "text-accent bg-white/5 border-t-2 border-accent" : "text-light-blue"
          }`}
        >
          <ShoppingCart size={24} className="mb-1" />
          <span className="text-xs font-medium">Bill</span>
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
