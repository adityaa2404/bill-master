import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const CustomerModal = ({ open, onSelectCustomer, onCreateCustomer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-999">
      <Card className="w-full max-w-md bg-primary text-cream border border-accent/40 shadow-xl">

        <CardHeader>
          <CardTitle>Select Customer</CardTitle>
          <CardDescription className="text-light-blue">
            Choose an existing customer or create a new one.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">

          {/* Example customer */}
          <Button
            className="w-full bg-primary-dark border border-light-blue/40 hover:bg-primary/80 text-cream"
            onClick={() =>
              onSelectCustomer({
                name: "Test User",
                phone: "9999999999",
                address: "Pune",
              })
            }
          >
            Test User (Demo)
          </Button>

        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white"
            onClick={onCreateCustomer}
          >
            Create New Customer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomerModal;
