import React from "react";
import { FileText, Users, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden">

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

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-primary-dark to-primary text-white text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold mb-1">
          Welcome to <span className="text-accent">Bill Master</span>
        </h1>

        <p className="text-2xl mb-6 text-light-blue">
          Simplify Your Billing Process
        </p>

        <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-10 text-white/80">
          Manage invoices, track payments, and keep your customers happy with
          our modern billing management system.
        </p>

        <button className="bg-accent text-white px-8 py-3 rounded-lg text-lg font-bold shadow hover:opacity-90 transition">
          Get Started
        </button>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Card 1 */}
          <div className="bg-white rounded-xl p-8 shadow text-center hover:shadow-lg transition border border-light-blue/40">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center mb-6">
              <FileText size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">
              Easy Billing
            </h3>
            <p className="text-gray-600">Quickly create and manage bills with ease.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-8 shadow text-center hover:shadow-lg transition border border-light-blue/40">
            <div className="w-20 h-20 bg-light-blue rounded-full mx-auto flex items-center justify-center mb-6">
              <Users size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">
              Customer Management
            </h3>
            <p className="text-gray-600">Track customer data and billing records.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-8 shadow text-center hover:shadow-lg transition border border-light-blue/40">
            <div className="w-20 h-20 bg-accent rounded-full mx-auto flex items-center justify-center mb-6">
              <LayoutDashboard size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">View insights and monitor billing trends.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
