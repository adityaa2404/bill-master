import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Item, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/billingSlice"; 

export default function ScrollableBillItems({ items = [] }) {
  return (
    // CONTAINER: Fixed height, flex column
    <div className="h-full w-full flex flex-col bg-primary-dark/20 border border-accent/50 rounded-md p-3 overflow-hidden">
      
      <h3 className="text-lg font-semibold text-cream mb-4 shrink-0">Bill Items</h3>
      
      {/* LIST: Custom Scrollbar Styling */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-accent/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-accent/40"
      >
        {items.length === 0 ? (
            <p className="text-white/50 text-sm text-center mt-10">No items found.</p>
        ) : (
            items.map((item) => (
              <BillItem key={item.id} item={item} />
            ))
        )}
      </div>
    </div>
  );
}

function BillItem({ item }) {
  const dispatch = useDispatch();
  const activeSection = useSelector((s) => s.billing.activeSection);

  const [qty, setQty] = React.useState(0); 
  const [rate, setRate] = React.useState("");

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 0 ? q - 1 : 0));

  const handleAdd = () => {
    if (activeSection === null) {
      alert("Please select a section in the right panel first.");
      return;
    }
    if (qty === 0 || !rate) {
      alert("Please enter a valid Rate and Quantity.");
      return;
    }

    dispatch(addItem({
      name: item.title,
      qty: Number(qty),
      rate: Number(rate)
    }));

    setQty(0); 
  };

  return (
    <Item variant="outline" className="border-accent px-2 py-2 rounded-lg flex flex-col items-start gap-2 w-full shrink-0">
      <ItemTitle className="text-base font-semibold text-light-blue truncate w-full">
        {item.title}
      </ItemTitle>

      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        
        {/* Rate Input */}
        <Input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-16 h-8 text-xs bg-background border-accent text-center px-1 py-0 leading-none placeholder:leading-normal"
        />

        {/* Qty Control */}
        <div className="flex items-center border border-accent rounded-md bg-background h-8">
          <Button variant="ghost" size="icon" className="h-full w-8 rounded-none rounded-l-md hover:bg-accent/20 text-accent" onClick={dec}>
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
            className="w-10 h-full border-0 text-center text-xs px-0 py-0 leading-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          
          <Button variant="ghost" size="icon" className="h-full w-8 rounded-none rounded-r-md hover:bg-accent/20 text-accent" onClick={inc}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button onClick={handleAdd} size="sm" className="h-8 px-3 text-xs">Add</Button>
      </div>
    </Item>
  );
}