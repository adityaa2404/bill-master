import React, { useState } from "react";
import { FileText, Users, LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden flex flex-col">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-900 px-6 py-4 w-full shadow-md border-b border-white/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 text-white text-xl md:text-2xl font-bold z-50">
            <FileText size={28} className="text-blue-400" />
            <span>Bill Master</span>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <Link to="/" className="text-blue-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-blue-300 transition-colors">
              Dashboard
            </Link>
            <Link to="/billing" className="hover:text-blue-300 transition-colors">
              Billing
            </Link>
            <Link to="/customers" className="hover:text-blue-300 transition-colors">
              Customers
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
             <Link to="/billing" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md transition">
                Go to App
             </Link>
          </div>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden text-white focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {/* This overlays the content when menu is open */}
        <div className={`
          absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-xl flex flex-col items-center gap-6 py-8 transition-all duration-300 ease-in-out md:hidden
          ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible"}
        `}>
            <Link 
              to="/" 
              className="text-lg text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-lg text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/billing" 
              className="text-lg text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Billing
            </Link>
            <Link 
              to="/customers" 
              className="text-lg text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Customers
            </Link>
            
            <Link 
              to="/billing" 
              className="mt-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg w-3/4 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
               Go to App
            </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-slate-900 to-slate-800 text-white text-center px-6 py-16 md:py-24 flex-1 flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Welcome to <span className="text-blue-400">Bill Master</span>
        </h1>

        <p className="text-lg md:text-2xl mb-6 text-blue-200">
          Simplify Your Billing Process
        </p>

        <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10 text-white/70">
          Manage invoices, track payments, and keep your customers happy with
          our modern billing management system.
        </p>

        <div>
          <Link to="/billing">
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-blue-600 transition transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 py-16 md:py-20 bg-slate-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Card 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-xl transition border border-slate-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-6 text-blue-600">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Easy Billing
            </h3>
            <p className="text-slate-500">Quickly create and manage bills with ease.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-xl transition border border-slate-200">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-6 text-indigo-600">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Customer Management
            </h3>
            <p className="text-slate-500">Track customer data and billing records.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-xl transition border border-slate-200">
             <div className="w-16 h-16 bg-teal-100 rounded-full mx-auto flex items-center justify-center mb-6 text-teal-600">
              <LayoutDashboard size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-slate-500">View insights and monitor billing trends.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;