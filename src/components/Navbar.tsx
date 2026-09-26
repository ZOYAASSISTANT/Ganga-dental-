import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  Calendar, 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin,
  ChevronRight
} from 'lucide-react';
import { CLINIC_CONTACT } from '../config/clinicData';
import { ClinicLogo } from './ClinicLogo';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 25;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Services', href: '#services' },
    { label: 'About & Why Us', href: '#why-choose-us' },
    { label: 'Specialized Care', href: '#specialized-treatments' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-200">
      {/* 1. Very Top Info Bar (matches reference mockup) */}
      <div className="hidden lg:block bg-gradient-to-r from-[#eaf8fa] via-[#e2f6f9] to-[#ebfbfd] border-b border-cyan-100 text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-600 font-medium">
          
          {/* Left: Phone & Address */}
          <div className="flex items-center space-x-6">
            <a 
              href={CLINIC_CONTACT.telLink} 
              className="flex items-center space-x-1.5 text-cyan-800 hover:text-cyan-950 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-600" />
              <span>{CLINIC_CONTACT.phone}</span>
            </a>
            <span className="text-cyan-200">|</span>
            <div className="flex items-center space-x-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>{CLINIC_CONTACT.shortAddress}</span>
            </div>
          </div>

          {/* Right: Hours & Socials */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>{CLINIC_CONTACT.openingHours}</span>
            </div>
            <span className="text-cyan-200">|</span>
            <div className="flex items-center space-x-3 text-cyan-700">
              <a href="#contact" aria-label="Facebook" className="hover:text-cyan-900 transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#contact" aria-label="Instagram" className="hover:text-cyan-900 transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#contact" aria-label="YouTube" className="hover:text-cyan-900 transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#contact" aria-label="LinkedIn" className="hover:text-cyan-900 transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className={`w-full bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
        isScrolled ? 'shadow-md shadow-cyan-950/5 border-b border-cyan-100/70' : 'border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-0.5 sm:p-1 shrink-0">
            <ClinicLogo size="md" />
          </a>

          {/* Desktop Navigation Links (>= 1024px) */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`py-2 px-1 relative group transition-colors ${
                  link.active ? 'text-[#005f73]' : 'hover:text-[#005f73] text-slate-700'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#005f73] rounded-full transition-all duration-200 ${
                  link.active ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}
          </div>

          {/* Right Action Buttons (Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Phone button */}
            <a
              href={CLINIC_CONTACT.telLink}
              className="p-2.5 rounded-xl text-cyan-800 hover:bg-cyan-50 border border-cyan-100 transition-all flex items-center space-x-2 text-sm font-semibold"
              title="Call Clinic"
            >
              <Phone className="w-4 h-4 text-cyan-600" />
              <span>{CLINIC_CONTACT.phone}</span>
            </a>

            {/* Prominent Book Appointment Button */}
            <button
              id="nav-book-appointment-btn"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-sm font-semibold shadow-md shadow-cyan-900/10 hover:shadow-cyan-900/20 transition-all flex items-center space-x-2 active:scale-98"
            >
              <Calendar className="w-4 h-4 text-cyan-200" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile & Tablet Action + Menu Toggle (< 1024px) */}
          <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2">
            <a
              href={CLINIC_CONTACT.telLink}
              className="hidden sm:flex p-2 rounded-xl text-cyan-800 hover:bg-cyan-50 border border-cyan-100 transition-all items-center space-x-1.5 text-xs font-semibold"
              title="Call Clinic"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden md:inline">{CLINIC_CONTACT.phone}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-xs active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-200 hidden sm:inline" />
              <span>Book</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cyan-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[82vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-800 font-medium hover:bg-cyan-50 hover:text-cyan-800 flex items-center justify-between text-sm"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href={CLINIC_CONTACT.telLink}
                className="w-full py-2.5 rounded-xl border border-cyan-200 text-cyan-800 font-semibold text-sm flex items-center justify-center space-x-2 bg-cyan-50/50"
              >
                <Phone className="w-4 h-4" />
                <span>Call {CLINIC_CONTACT.phone}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-[#005f73] text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cyan-200" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
