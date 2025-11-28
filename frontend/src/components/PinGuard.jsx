import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const CORRECT_PIN = import.meta.env.VITE_APP_PIN || "2404";

const PinGuard = ({ children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleChange = (value) => {
    setPin(value);
    if (value.length === 4) {
      if (value === CORRECT_PIN) {
        setUnlocked(true);
      } else {
        setError("Incorrect PIN");
        setPin("");
        setTimeout(() => setError(""), 1200);
      }
    }
  };

  // Once unlocked → fully show content
  if (unlocked) return children;

  return (
    <div className="relative">
      {/* OVERLAY */}
      <div className="
        fixed inset-0 z-9999
        flex items-center justify-center 
        bg-black/50 backdrop-blur-sm
      ">
        <div className="
          w-[90%] max-w-md
          bg-[#2f4663]
          rounded-2xl border border-white/10 shadow-2xl
          p-8 text-center
        ">
          <h2 className="text-3xl font-bold text-accent mb-6 tracking-wide">
            Enter PIN
          </h2>

          {/* OTP INPUT */}
          <div className="flex justify-center mb-4">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={handleChange}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm mb-2">{error}</p>
          )}

          <p className="text-light-blue text-xs opacity-70">
            Access restricted — enter the 4-digit PIN.
          </p>
        </div>
      </div>

      {/* BLURRED BACKGROUND CONTENT */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
};

export default PinGuard;
