import React, { useState, useEffect } from "react";
import { FileText, Users, LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/config/api";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔥 Backend wakeup state
  const [backendStatus, setBackendStatus] = useState("checking"); 
  const [time, setTime] = useState(0);

  // 🔥 Wake backend on load
  useEffect(() => {
    let timer = setInterval(() => setTime((t) => t + 1), 1000);

    const wake = async () => {
      try {
        const res = await api.get("/wakeup");

        if (res.status === 200) {
          setBackendStatus("ready");
          clearInterval(timer);
          return;
        }
      } catch (err) {
        setBackendStatus("waking");
        setTimeout(wake, 3000);
      }
    };

    wake();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-primary-dark font-[Poppins] overflow-x-hidden flex flex-col text-cream">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-primary-dark/95 backdrop-blur-md px-6 py-4 w-full shadow-lg border-b border-light-blue/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 text-cream text-xl md:text-2xl font-bold z-50">
            <FileText size={28} className="text-accent" />
            <span>Bill Master</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link to="/" className="text-light-blue hover:text-accent transition-colors">Home</Link>
            <Link to="/dashboard" className="text-light-blue hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/billing" className="text-light-blue hover:text-accent transition-colors">Billing</Link>
            <Link to="/customers" className="text-light-blue hover:text-accent transition-colors">Customers</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to="/billing"
              className="text-sm bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded-md transition shadow-lg shadow-accent/20"
            >
              Go to App
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-cream focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        <div className={`
          absolute top-full left-0 w-full bg-primary border-b border-light-blue/10 shadow-2xl flex flex-col items-center gap-6 py-8 transition-all duration-300 ease-in-out md:hidden
          ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible"}
        `}>
          {["Home", "Dashboard", "Billing", "Customers"].map((item) => (
            <Link 
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
              className="text-lg text-cream hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          
          <Link 
            to="/billing"
            className="mt-2 bg-accent text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg w-3/4 text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Go to App
          </Link>
        </div>
      </nav>

      {/* 🔥 BACKEND WAKEUP PANEL */}
      {(backendStatus === "checking" || backendStatus === "waking") && (
        <div className="w-full bg-primary border-b border-light-blue/10 py-4 text-center animate-pulse">
          <div className="text-lg font-semibold">
            Waking up backend server…
          </div>
          <div className="text-light-blue/70 mt-1">
            This may take 20–50 seconds.......
          </div>
          <div className="text-accent mt-1">
            Time: {time}s
          </div>
        </div>
      )}

      {/* READY PANEL */}
      {backendStatus === "ready" && (
        <div className="w-full bg-green-600/20 border-b border-green-400 text-center py-4">
          <div className="text-green-400 font-semibold text-lg">
            ✔ Backend is Running !!! You can start using the app.
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-primary-dark text-center px-6 py-16 md:py-24 flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-cream">
          Welcome to <span className="text-accent">Bill Master</span>
        </h1>

        <p className="text-lg md:text-2xl mb-6 text-light-blue">
          Simplify Your Billing Process
        </p>

        <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10 text-cream/70">
          Manage invoices, track payments, and keep your customers happy with
          our modern billing management system.
        </p>

        <div>
          <Link to="/billing">
            <button className="bg-accent text-white px-8 py-3 rounded-lg text-lg font-bold shadow-xl hover:shadow-accent/40 hover:-translate-y-1 transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 py-16 md:py-20 bg-primary">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cream mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Card 1 */}
          <div className="bg-primary-dark/50 rounded-xl p-8 shadow-lg border border-light-blue/10 text-center hover:border-accent/50 transition group">
            <div className="w-16 h-16 bg-primary-dark rounded-full mx-auto flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform shadow-md">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-cream mb-3">
              Easy Billing
            </h3>
            <p className="text-light-blue">Quickly create and manage bills with ease.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-primary-dark/50 rounded-xl p-8 shadow-lg border border-light-blue/10 text-center hover:border-accent/50 transition group">
            <div className="w-16 h-16 bg-primary-dark rounded-full mx-auto flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform shadow-md">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-cream mb-3">
              Customer Management
            </h3>
            <p className="text-light-blue">Track customer data and billing records.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-primary-dark/50 rounded-xl p-8 shadow-lg border border-light-blue/10 text-center hover:border-accent/50 transition group">
            <div className="w-16 h-16 bg-primary-dark rounded-full mx-auto flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform shadow-md">
              <LayoutDashboard size={32} />
            </div>
            <h3 className="text-xl font-bold text-cream mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-light-blue">View insights and monitor billing trends.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
