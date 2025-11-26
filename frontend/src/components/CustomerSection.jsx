// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Save, User, Printer } from "lucide-react";
// import { selectGrandTotal } from "@/store/sectionsSlice";

// const CustomerSection = () => {
//   const customer = useSelector((s) => s.customers.selectedCustomer);

//   const invoiceNumber = useSelector((s) => s.billing.invoiceNumber);
//   const invoiceDate = useSelector((s) => s.billing.invoiceDate);

//   const grandTotal = useSelector(selectGrandTotal);

//   const [isSaving, setIsSaving] = useState(false);
//   const [lastBillId, setLastBillId] = useState(null);

//   // -----------------------------
//   //  SAVE (CREATE BILL IN MONGO)
//   // -----------------------------
//   const handleSave = async () => {
//     if (!customer?._id) {
//       alert("Select customer first!");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/bills", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerId: customer._id,
//         }),
//       });

//       const data = await res.json();

//       if (data.billId) {
//         setLastBillId(data.billId);
//         alert("Bill Saved ✔");
//       } else {
//         alert("Failed to save bill");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // -----------------------------
//   //  PRINT PDF OF THE SAVED BILL
//   // -----------------------------
//   const handlePrint = async () => {
//     if (!lastBillId) {
//       alert("❗ Save bill first before printing!");
//       return;
//     }

//     const res = await fetch(
//       `http://localhost:8000/api/bills/print/${lastBillId}`,
//       { method: "GET" }
//     );

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `Bill-${lastBillId}.pdf`;
//     a.click();
//   };

//   return (
//     <div className="bg-primary p-2 rounded-lg border border-accent/40 shadow-sm">
//       <div className="flex flex-wrap items-center justify-between gap-3">

//         {/* Customer Info */}
//         <div className="flex flex-wrap items-center gap-4 text-[13px] text-cream">
//           <div className="flex items-center gap-1 font-semibold">
//             <User size={14} className="text-accent" />
//             <span>{customer?.name || "Select Customer"}</span>
//           </div>

//           <span className="opacity-80">
//             Invoice: <span className="text-light-blue">{invoiceNumber || "--"}</span>
//           </span>

//           <span className="opacity-80">
//             Date: <span className="text-light-blue">{invoiceDate || "--"}</span>
//           </span>

//           <span className="font-bold text-green-400">
//             Total: ₹{grandTotal}
//           </span>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-2">

//           {/* Print Button */}
//           <Button
//             onClick={handlePrint}
//             className="bg-[#444] hover:bg-[#555] text-white h-7 px-3 text-[10px] flex items-center gap-1"
//           >
//             <Printer size={12} />
//             Print Bill
//           </Button>

//           {/* Save Button */}
//           <Button
//             onClick={handleSave}
//             className="bg-accent hover:bg-accent/90 text-white h-7 px-3 text-[10px] flex items-center gap-1"
//           >
//             <Save size={12} />
//             {isSaving ? "Saving..." : "Save / Sync"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerSection;
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Save, User, Printer } from "lucide-react";
import { selectGrandTotal } from "@/store/sectionsSlice";

const CustomerSection = ({ onSave, onPrint }) => {
  const customer = useSelector((s) => s.customers.selectedCustomer);

  const invoiceNumber = useSelector((s) => s.billing.invoiceNumber);
  const invoiceDate = useSelector((s) => s.billing.invoiceDate);

  const grandTotal = useSelector(selectGrandTotal);

  const structure = useSelector((s) => s.sections.structure);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    const billJSON = {
      customer,
      invoiceNumber,
      invoiceDate,
      grandTotal,
      sections: structure,
    };

    console.log("🖨 PRINT BILL JSON:", billJSON);

    if (onPrint) onPrint(billJSON);

    alert("Bill JSON printed in console!");
  };

  return (
    <div className="bg-primary p-2 rounded-lg border border-accent/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Customer Info */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-cream">
          <div className="flex items-center gap-1 font-semibold">
            <User size={14} className="text-accent" />
            <span>{customer?.name || "Select Customer"}</span>
          </div>

          <span className="opacity-80">
            Invoice: <span className="text-light-blue">{invoiceNumber || "--"}</span>
          </span>

          <span className="opacity-80">
            Date: <span className="text-light-blue">{invoiceDate || "--"}</span>
          </span>

          <span className="font-bold text-green-400">
            Total: ₹{grandTotal}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">

          {/* Print Button */}
          <Button
            onClick={handlePrint}
            className="bg-[#444] hover:bg-[#555] text-white h-7 px-3 text-[10px] flex items-center gap-1"
          >
            <Printer size={12} />
            Print Bill
          </Button>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="bg-accent hover:bg-accent/90 text-white h-7 px-3 text-[10px] flex items-center gap-1"
          >
            <Save size={12} />
            {isSaving ? "Saving..." : "Save / Sync"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;
