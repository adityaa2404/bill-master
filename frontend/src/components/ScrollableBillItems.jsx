import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Item, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { assignItem, fetchStructure } from "@/store/sectionsSlice";

/**
 * items = master items from DB (itemsSlice.list)
 * shape: { _id, name, unit, defaultQty, ... }
 */
export default function ScrollableBillItems({ items = [] }) {
  return (
    <div className="h-full w-full flex flex-col bg-primary-dark/20 border border-accent/50 rounded-md p-3 overflow-hidden">
      <h3 className="text-lg font-semibold text-cream mb-4 shrink-0">
        Bill Items
      </h3>

      <div
        className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-accent/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-accent/40"
      >
        {items.length === 0 ? (
          <p className="text-white/50 text-sm text-center mt-10">
            No items found.
          </p>
        ) : (
          items.map((item) => (
            <BillItem
              // key must be stable → use Mongo _id
              key={item._id || item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BillItem({ item }) {
  const dispatch = useDispatch();

  const selectedCustomer = useSelector((s) => s.customers.selectedCustomer);
  const activeSection = useSelector((s) => s.sections.activeSection); // index
  const activeSub = useSelector((s) => s.sections.activeSub);         // index or null
  const sections = useSelector((s) => s.sections.structure);          // array from backend

  const [qty, setQty] = React.useState(item.defaultQty || 0);
  const [rate, setRate] = React.useState(""); // stays even after Add

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 0 ? q - 1 : 0));

  const handleAdd = () => {
    // 1. must have a customer
    if (!selectedCustomer?._id) {
      alert("Please select a customer first.");
      return;
    }

    // 2. must have a section (index can be 0 → only null/undefined is invalid)
    if (activeSection === null || activeSection === undefined) {
      alert("Please select a section on the right first.");
      return;
    }

    // 3. qty & rate must be valid
    if (!qty || !rate) {
      alert("Please enter a valid Rate and Quantity.");
      return;
    }

    const sec = sections[activeSection];
    if (!sec) {
      alert("Selected section is invalid.");
      return;
    }

    // 4. resolve subsectionId (or null for global item)
    let subsectionId = null;
    if (
      activeSub !== null &&
      activeSub !== undefined &&
      Array.isArray(sec.subsections) &&
      sec.subsections[activeSub]
    ) {
      subsectionId = sec.subsections[activeSub].subsectionId;
    }

    // 5. send correct payload to backend
    const payload = {
      customerId: selectedCustomer._id,
      sectionId: sec.sectionId,                // from /structure/full
      subsectionId,                            // null = global item in section
      itemId: item._id || item.id,            // master item ID
      quantity: Number(qty),
      rate: Number(rate),
      notes: "",
    };

    dispatch(assignItem(payload)).then(() => {
      // refetch full structure so right panel + totals update
      dispatch(fetchStructure(selectedCustomer._id));
    });

    // reset only QTY – keep rate as user liked
    setQty(item.defaultQty || 0);
    // setRate(rate);  // do NOT clear
  };

  return (
    <Item
      variant="outline"
      className="border-accent px-2 py-2 rounded-lg flex flex-col items-start gap-2 w-full shrink-0"
    >
      {/* NAME – from items collection */}
      <ItemTitle className="text-base font-semibold text-light-blue truncate w-full">
        {item.name || item.title}
      </ItemTitle>

      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        {/* Rate input */}
        <Input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-16 h-8 text-xs bg-background border-accent text-center px-1 py-0 leading-none placeholder:leading-normal"
        />

        {/* Qty control */}
        <div className="flex items-center border border-accent rounded-md bg-background h-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-8 rounded-none rounded-l-md hover:bg-accent/20 text-accent"
            onClick={dec}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
            className="w-10 h-full border-0 text-center text-xs px-0 py-0 leading-none focus-visible:ring-0
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-full w-8 rounded-none rounded-r-md hover:bg-accent/20 text-accent"
            onClick={inc}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Add button */}
        <Button onClick={handleAdd} size="sm" className="h-8 px-3 text-xs">
          Add
        </Button>
      </div>
    </Item>
  );
}
