import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  ArrowUp,
  Heart
} from 'lucide-react';
import { CLINIC_CONTACT, CLINIC_INFO, ALL_SERVICES } from '../config/clinicData';
import { ClinicLogo } from './ClinicLogo';

export const Footer: React.FC = React.memo(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a2540] text-slate-300 pt-10 sm:pt-16 pb-8 border-t border-cyan-900/40 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-slate-700/60">
          
          {/* Column 1: Brand & Bio (Spans 4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <ClinicLogo isLight size="lg" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Ganga Dental Clinic provides world-class dental treatments with a compassionate, gentle touch. Modern technology, experienced MDS doctors, and hospital-grade sterility.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a 
                href="#contact" 
                aria-label="Facebook" 
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                aria-label="Instagram" 
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                aria-label="YouTube" 
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                aria-label="LinkedIn" 
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Dental Services</a></li>
              <li><a href="#doctors" className="hover:text-cyan-400 transition-colors">Our Doctors</a></li>
              <li><a href="#before-after" className="hover:text-cyan-400 transition-colors">Before & After</a></li>
              <li><a href="#gallery" className="hover:text-cyan-400 transition-colors">Clinic Gallery</a></li>
              <li><a href="#reviews" className="hover:text-cyan-400 transition-colors">Patient Reviews</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 3: Key Treatments (Spans 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase">
              Treatments
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Root Canal Treatment</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Dental Implants</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Teeth Whitening</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Braces & Aligners</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Pediatric Dentistry</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Smile Makeover</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Emergency Care</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours (Spans 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase">
              Clinic Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{CLINIC_CONTACT.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={CLINIC_CONTACT.telLink} className="hover:text-cyan-400 transition-colors font-semibold">
                  {CLINIC_CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={CLINIC_CONTACT.emailLink} className="hover:text-cyan-400 transition-colors">
                  {CLINIC_CONTACT.email}
                </a>
              </div>
              <div className="flex items-start space-x-2.5 pt-1">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p>{CLINIC_CONTACT.openingHours}</p>
                  <p className="text-slate-400 text-[11px]">{CLINIC_CONTACT.sundayHours}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Ganga Dental Clinic. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Healthy Smiles. Brighter Lives.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-700 text-slate-300 hover:text-white transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
});
