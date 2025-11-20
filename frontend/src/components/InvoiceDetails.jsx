import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvoiceDetails() {
  const { register, handleSubmit, setValue } = useForm();

  const [invoiceNumber, setInvoiceNumber] = useState(1);

  // 🔥 Load saved invoice number OR start from 1
  useEffect(() => {
    const saved = localStorage.getItem("invoiceNumber");
    const next = saved ? Number(saved) + 1 : 1;
    setInvoiceNumber(next);
    setValue("invoiceNumber", next);
  }, [setValue]);

  // 🔥 Auto-fill date and time (editable)
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16); // yyyy-mm-ddThh:mm
    setValue("dateTime", now);
  }, [setValue]);

  const onSubmit = (data) => {
    console.log("Invoice Data:", data);

    // save next invoice number
    localStorage.setItem("invoiceNumber", data.invoiceNumber);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-primary-dark/30 p-4 rounded-lg border border-accent mt-4 
      max-w-lg mx-auto w-full"
    >
      <h2 className="text-xl font-bold text-white mb-4">Invoice Details</h2>

      {/* Row: Invoice No + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white text-sm">Invoice Number</label>
          <Input
            {...register("invoiceNumber")}
            readOnly
            className="bg-primary-dark/40 border-accent text-white"
          />
        </div>

        <div>
          <label className="text-white text-sm">Date & Time</label>
          <Input
            type="datetime-local"
            {...register("dateTime")}
            className="bg-primary-dark/40 border-accent text-white"
          />
        </div>
      </div>
      <Button className="mt-4" variant="outline">
        Save Invoice
      </Button>
    </form>
  );
}
