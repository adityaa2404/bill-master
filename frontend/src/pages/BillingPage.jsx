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
    // Main Layout: h-[100dvh] to fit screen exactly
    <div className="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-background">

      {/* LEFT SIDE (Items Panel) */}
      <div className="flex-none h-[40%] md:h-full md:flex-1 md:max-w-xs bg-linear-to-r from-primary to-primary-dark p-4 md:p-6 border-b md:border-b-0 md:border-r flex flex-col min-h-0">
        
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-white shrink-0">Items</h2>

        {/* --- INPUTS AREA --- */}
        <div className='flex flex-col gap-2 w-full border p-3 rounded-lg border-accent mt-2 shrink-0'>
          
          {/* Add New Item */}
          <div className="flex gap-2">
            <Input 
              placeholder="Add New Item" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
              className="h-9 text-sm bg-primary-dark/40 border-accent"
            />
            <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCreateItem}
                className="h-9 border-accent text-accent hover:bg-accent hover:text-white"
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
              className="h-9 text-sm bg-primary-dark/40 border-accent"
            />
            <Button 
                size="sm" 
                variant="outline" 
                // Optional: Clear search on click
                onClick={() => setSearchQuery("")}
                className="h-9 border-accent text-accent hover:bg-accent hover:text-white"
            >
                Clear
            </Button>
          </div>

        </div>

        {/* List Header */}
        <h3 className='mt-3 md:mt-6 text-sm md:text-base text-white/80 font-bold shrink-0'>
            {searchQuery ? `Search: "${searchQuery}"` : "ALL ITEMS"}
        </h3>

        {/* Scrollable List */}
        <div className="grow overflow-y-auto mt-2 min-h-0">
          <ScrollableBillItems items={filteredItems} />
        </div>
      </div>

      {/* RIGHT SIDE (Bill/Sections) */}
      <div className="flex-1 h-[60%] md:h-full p-4 md:p-6 bg-linear-to-r from-primary-dark to-primary flex flex-col min-h-0 overflow-hidden">
        
        <div className='shrink-0'>
           <h1 className="text-xl md:text-2xl font-bold text-white">All Sections</h1>
        </div>

        <Separator className="my-2 md:my-4 bg-accent/40 shrink-0" />

        {/* Section Accordion Wrapper */}
        <div className="flex-1 overflow-hidden min-h-0">
           <SectionAccordion />
        </div>

      </div>

    </div>
  )
}

export default BillingPage