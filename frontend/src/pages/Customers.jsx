import React from 'react'

const Customers = () => {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-primary px-6 py-4 w-full">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-3 text-white text-2xl font-bold">
            <FileText size={32} className="text-accent" />
            <span>Bill Master</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 text-white">
            <Link to="/" className="text-light-blue hover:text-accent">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-accent">
              Dashboard
            </Link>
            <Link to="/billing" className="hover:text-accent">
              Billing
            </Link>
            <Link to="/customers" className="hover:text-accent">
              Customers
            </Link>
          </div>
        </div>
      </nav>

      <h2 className="text-2xl font-bold">Customers</h2>
      <p>Customer list will go here.</p>
    </div>
  );
};

export default Customers;
