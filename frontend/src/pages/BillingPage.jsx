import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ScrollableBillItems from "@/components/ScrollableBillItems"
import SectionAccordion from '@/components/SectionAccordion'

// Initial Dummy Data
const INITIAL_ITEMS = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
}));

const BillingPage = () => {
  // --- STATE ---
  const [allItems, setAllItems] = useState(INITIAL_ITEMS);
  
  // Input State
  const [newItemName, setNewItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- ACTIONS ---

  // 1. Create New Item
  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      id: Date.now(), 
      title: newItemName.trim()
    };
    
    setAllItems((prev) => [newItem, ...prev]); // Add to top
    setNewItemName(""); // Clear input
  };

  // 2. Search (Filtering is done in render)
  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Main Layout: h-dvh handles mobile browser bars better than h-screen
    <div className="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-background">

      {/* LEFT SIDE (Items Panel) 
          Mobile: h-1/2 (50%) - Standard Tailwind class, safer than h-[45%]
          Desktop: h-full, flex-1
      */}
      <div className="flex-none h-1/2 md:h-full md:flex-1 md:max-w-xs bg-linear-to-r from-primary to-primary-dark p-3 md:p-6 border-b md:border-b-0 md:border-r flex flex-col min-h-0 z-10 relative shadow-md md:shadow-none">
        
        <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-white shrink-0">Items</h2>

        {/* --- INPUTS AREA --- */}
        <div className='flex flex-col gap-2 w-full border p-2 md:p-3 rounded-lg border-accent mt-1 md:mt-2 shrink-0'>
          
          {/* Add New Item */}
          <div className="flex gap-2">
            <Input 
              placeholder="Add New Item" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
              className="h-8 md:h-9 text-xs md:text-sm bg-primary-dark/40 border-accent"
            />
            <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCreateItem}
                className="h-8 md:h-9 border-accent text-accent hover:bg-accent hover:text-white px-2 md:px-4"
            >
                Add
            </Button>
          </div>

          {/* Search Item */}
          <div className="flex gap-2">
            <Input 
              placeholder="Search Item" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 md:h-9 text-xs md:text-sm bg-primary-dark/40 border-accent"
            />
            <Button 
                size="sm" 
                variant="outline" 
                // Optional: Clear search on click
                onClick={() => setSearchQuery("")}
                className="h-8 md:h-9 border-accent text-accent hover:bg-accent hover:text-white px-2 md:px-4"
            >
                Clear
            </Button>
          </div>

        </div>

        {/* List Header */}
        <h3 className='mt-2 md:mt-6 text-xs md:text-base text-white/80 font-bold shrink-0'>
            {searchQuery ? `Search: "${searchQuery}"` : "ALL ITEMS"}
        </h3>

        {/* Scrollable List */}
        <div className="grow overflow-y-auto mt-2 min-h-0">
          <ScrollableBillItems items={filteredItems} />
        </div>
      </div>

      {/* RIGHT SIDE (Bill/Sections) 
          Mobile: h-1/2 (50%) - Takes bottom half
          Desktop: flex-1, h-full
      */}
      <div className="flex-none h-1/2 md:h-full md:flex-1 p-3 md:p-6 bg-linear-to-r from-primary-dark to-primary flex flex-col min-h-0 overflow-hidden">
        
        <div className='shrink-0'>
           <h1 className="text-lg md:text-2xl font-bold text-white">All Sections</h1>
        </div>

        <Separator className="my-2 md:my-4 bg-accent/40 shrink-0" />

        {/* Section Accordion Wrapper */}
        <div className="flex-1 overflow-hidden min-h-0 pb-1">
           <SectionAccordion />
        </div>

      </div>

    </div>
  )
}

export default BillingPage