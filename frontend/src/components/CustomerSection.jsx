import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Save, User } from "lucide-react";
import { selectGrandTotal } from "@/store/billingSlice";

const CustomerSection = ({ onSave }) => {
  const { customer, invoiceNumber, invoiceDate } = useSelector(
    (s) => s.billing
  );
  const grandTotal = useSelector(selectGrandTotal);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave(); // BillingPage will pass save function
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-primary p-2 rounded-lg border border-accent/40 shadow-sm">

      {/* ONE LINE (WRAPS ON MOBILE) */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Left: Customer Info */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-cream">

          <div className="flex items-center gap-1 font-semibold">
            <User size={14} className="text-accent" />
            <span>{customer?.name || "Customer"}</span>
          </div>

          <span className="opacity-80">
            Invoice:{" "}
            <span className="text-light-blue">
              {invoiceNumber || "--"}
            </span>
          </span>

          <span className="opacity-80">
            Date:{" "}
            <span className="text-light-blue">
              {invoiceDate || "--"}
            </span>
          </span>

        
          <span className="font-bold text-green-400">
            Total: ₹{grandTotal}
          </span>
        </div>

        {/* Right: Save Button */}
        <Button
          onClick={handleSave}
          className="bg-accent hover:bg-accent/90 text-white h-7 px-3 text-[10px] flex items-center gap-1"
        >
          <Save size={12} />
          {isSaving ? "Saving..." : "Save / Sync"}
        </Button>
      </div>
    </div>
  );
};

export default CustomerSection;
1