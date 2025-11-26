import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Item, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import {
  assignItem,
  fetchStructure,
  fetchCustomerRates,
  setSaving,  
} from "@/store/sectionsSlice";

/**
 * items = master items from DB (itemsSlice.list)
 * shape: { _id, name, unit, defaultQty, ... }
 */
export default function ScrollableBillItems({ items = [] }) {
  const dispatch = useDispatch();
  const selectedCustomer = useSelector((s) => s.customers.selectedCustomer);

  // 🔥 Load customer-specific saved rates whenever customer changes
  React.useEffect(() => {
    if (selectedCustomer?._id) {
      dispatch(fetchCustomerRates(selectedCustomer._id));
    }
  }, [selectedCustomer, dispatch]);

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
            <BillItem key={item._id || item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function BillItem({ item }) {
  const dispatch = useDispatch();

  const selectedCustomer = useSelector((s) => s.customers.selectedCustomer);
  const activeSection = useSelector((s) => s.sections.activeSection);
  const activeSub = useSelector((s) => s.sections.activeSub);
  const sections = useSelector((s) => s.sections.structure);

    const customerRates = useSelector((s) => s.sections.customerRates);

  const id = item._id || item.id; // <—— IMPORTANT

  const [qty, setQty] = React.useState(item.defaultQty || 0);

  const [rate, setRate] = React.useState(
    customerRates[id] ?? item.defaultRate ?? ""
  );

  React.useEffect(() => {
    if (customerRates[id] !== undefined) {
      setRate(customerRates[id]);
    }
  }, [customerRates, id]);


  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 0 ? q - 1 : 0));

  const handleAdd = () => {
    if (!selectedCustomer?._id) {
      alert("Please select a customer first.");
      return;
    }

    if (activeSection === null || activeSection === undefined) {
      alert("Please select a section on the right first.");
      return;
    }

    if (!qty || !rate) {
      alert("Please enter a valid Rate and Quantity.");
      return;
    }

    const sec = sections[activeSection];
    if (!sec) {
      alert("Selected section is invalid.");
      return;
    }

    let subsectionId = null;
    if (
      activeSub !== null &&
      activeSub !== undefined &&
      Array.isArray(sec.subsections) &&
      sec.subsections[activeSub]
    ) {
      subsectionId = sec.subsections[activeSub].subsectionId;
    }

    const payload = {
      customerId: selectedCustomer._id,
      sectionId: sec.sectionId,
      subsectionId,
      itemId: item._id || item.id,
      quantity: Number(qty),
      rate: Number(rate),
      notes: "",
    };

    // dispatch(assignItem(payload)).then(() => {
    //   dispatch(fetchStructure(selectedCustomer._id));

    //   // 🔥 VERY IMPORTANT: reload updated rate memory
    //   dispatch(fetchCustomerRates(selectedCustomer._id));
    // });
    dispatch(setSaving(true));

  dispatch(assignItem(payload)).then(() => {
    dispatch(fetchStructure(selectedCustomer._id)).then(() => {
      dispatch(setSaving(false)); // 🔥 AUTOSAVE DONE
    });
  });

    setQty(item.defaultQty || 0);
  };

  return (
    <Item
      variant="outline"
      className="border-accent px-2 py-2 rounded-lg flex flex-col items-start gap-2 w-full shrink-0"
    >
      <ItemTitle className="text-base font-semibold text-light-blue truncate w-full">
        {item.name || item.title}
      </ItemTitle>

      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        <Input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-16 h-8 text-xs bg-background border-accent text-center px-1 py-0"
        />

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
            className="w-10 h-full border-0 text-center text-xs px-0 py-0"
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

        <Button onClick={handleAdd} size="sm" className="h-8 px-3 text-xs">
          Add
        </Button>
      </div>
    </Item>
  );
}
