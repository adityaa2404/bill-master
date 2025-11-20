import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const InputButton = ({ placeholder, btnText, onClick }) => {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        className="flex-1"
      />

      <Button
        type="button"
        variant="secondary"
        onClick={onClick}
      >
        {btnText}
      </Button>
    </div>
  );
};

export default InputButton;
