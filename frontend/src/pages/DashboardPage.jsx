import React, { useEffect, useState } from "react";
import api from "@/config/api";
import { Users, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
const DashboardPage = () => {
  const [stats, setStats] = useState({
    customers: 0,
    totalBilled: 0,
    recentCustomers: [],
    recentBills: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cust, billed, recentCustomers, recentBills] = await Promise.all([
          api.get("/dashboard/customers/count"),
          api.get("/dashboard/bills/total"),
          api.get("/dashboard/recent-customers"),
          api.get("/dashboard/bills/recent"),
        ]);

        setStats({
          customers: cust.data.totalCustomers,
          totalBilled: billed.data.totalAmount,
          recentCustomers: recentCustomers.data,
          recentBills: recentBills.data,
        });

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }

      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-primary-dark text-cream font-[Poppins]">
      <BackButton/>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Total Customers */}
        <Card className="bg-primary p-5 border-light-blue/20">
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-accent/20 rounded-full">
              <Users className="text-accent" size={26} />
            </div>
            <div>
              <p className="text-sm text-light-blue">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.customers}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Total Billed */}
        <Card className="bg-primary p-5 border-light-blue/20">
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-accent/20 rounded-full">
              <Receipt className="text-accent" size={26} />
            </div>
            <div>
              <p className="text-sm text-light-blue">Total Billed Amount</p>
              <h3 className="text-2xl font-bold">₹ {stats.totalBilled}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder */}
        <Card className="bg-primary p-5 border-light-blue/20">
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-accent/20 rounded-full">
              <TrendingUp className="text-accent" size={26} />
            </div>
            <div>
              <p className="text-sm text-light-blue">Monthly Growth</p>
              <h3 className="text-2xl font-bold">Coming soon</h3>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* RECENT CUSTOMERS */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Recent Customers</h3>

        <div className="bg-primary rounded-lg border border-light-blue/20 p-4">
          {stats.recentCustomers.length === 0 ? (
            <p className="text-light-blue text-center py-4">No customers found.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentCustomers.map((cust) => (
                <div
                  key={cust._id}
                  className="flex justify-between items-center p-3 bg-primary-dark/40 rounded-md border border-light-blue/10"
                >
                  <div>
                    <p className="font-semibold">{cust.name}</p>
                    <p className="text-xs text-light-blue">{cust.phone || "No phone"}</p>
                  </div>

                  <p className="text-sm text-light-blue">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT BILLS */}
      {/* <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Recent Bills</h3>

        <div className="bg-primary rounded-lg border border-light-blue/20 p-4">
          {stats.recentBills.length === 0 ? (
            <p className="text-light-blue text-center py-4">No bills found.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBills.map((bill) => (
                <div
                  key={bill._id}
                  className="flex justify-between items-center p-3 bg-primary-dark/40 rounded-md border border-light-blue/10"
                >
                  <p className="font-semibold">{bill.customerName}</p>
                  <p className="font-bold text-accent">₹ {bill.totalAmount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> */}

    </div>
  );
};

export default DashboardPage;
