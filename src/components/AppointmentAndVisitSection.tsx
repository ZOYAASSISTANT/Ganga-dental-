import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Navigation,
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { CLINIC_CONTACT, DOCTORS, ALL_SERVICES, FAQS } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

interface AppointmentAndVisitProps {
  initialService?: string;
  initialDoctor?: string;
  highlightTrigger?: number;
}

export const AppointmentAndVisitSection: React.FC<AppointmentAndVisitProps> = React.memo(({
  initialService = '',
  initialDoctor = '',
  highlightTrigger = 0
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    if (initialService) setSelectedService(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialDoctor) setSelectedDoctor(initialDoctor);
  }, [initialDoctor]);

  // Glow card and open keyboard when highlightTrigger changes
  useEffect(() => {
    if (highlightTrigger && highlightTrigger > 0) {
      setIsGlowing(true);
      const focusTimer = setTimeout(() => {
        fullNameInputRef.current?.focus();
      }, 450);
      const glowTimer = setTimeout(() => {
        setIsGlowing(false);
      }, 4500);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(glowTimer);
      };
    }
  }, [highlightTrigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const formattedDate = date ? date : 'Earliest Available Date';

    // Construct ultra-professional, structured WhatsApp appointment slip
    const appointmentDetails = 
`🦷 *GANGA DENTAL CLINIC — APPOINTMENT REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 *Clinic:* Ganga Dental Clinic, New Delhi
📍 *Address:* B-12 Green Park, New Delhi – 110016
📞 *Reception Helpline:* ${CLINIC_CONTACT.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *PATIENT APPOINTMENT DETAILS:*
• *Patient Name:* ${fullName.trim()}
• *Mobile Number:* ${phone.trim()}
• *Email ID:* ${email.trim() || 'Not Provided'}
• *Treatment Selected:* ${selectedService || 'General Dental Consultation'}
• *Preferred Specialist:* ${selectedDoctor || 'Any Specialist Dentist'}
• *Preferred Date:* ${formattedDate}
• *Preferred Time Slot:* ${timeSlot}
• *Concern / Notes:* ${message.trim() || 'Routine Dental Checkup & Smile Consultation'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *Status:* Priority Website Booking Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Dear Ganga Dental Reception Team, please confirm my appointment schedule. Thank you!_`;

    const waUrl = CLINIC_CONTACT.getWhatsAppUrl(appointmentDetails);
    
    setSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 700);
  };

  return (
    <section id="contact" className="py-10 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Grid Matching Reference Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Card 1: Visit Our Clinic (Left Column, spans 4 cols) */}
          <div className="lg:col-span-4">
            <Interactive3DCard variant="teal">
              <div className="p-5 sm:p-7 bg-[#f0fbfd] flex flex-col justify-between h-full text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a2540] mb-3 sm:mb-4 tracking-tight">
                    Visit Our Clinic
                  </h3>

                  <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-slate-700">
                    {/* Clinic Name & Address */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">Ganga Dental Clinic</h4>
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                          {CLINIC_CONTACT.address}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block leading-none">Phone</span>
                        <a href={CLINIC_CONTACT.telLink} className="font-bold text-cyan-900 hover:text-cyan-950">
                          {CLINIC_CONTACT.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block leading-none">Email</span>
                        <a href={CLINIC_CONTACT.emailLink} className="font-bold text-cyan-900 hover:text-cyan-950">
                          {CLINIC_CONTACT.email}
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="text-[11px] text-slate-400 block leading-none">Working Hours</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{CLINIC_CONTACT.openingHours}</p>
                        <p className="text-slate-500 mt-0.5">{CLINIC_CONTACT.sundayHours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Preview Container with Directions link */}
                <div className="mt-5 sm:mt-6 pt-4 border-t border-cyan-200/60">
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-cyan-200 bg-slate-200 mb-3">
                    <iframe
                      title="Ganga Dental Clinic Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.679234857874!2d77.199464!3d28.556272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26d03d3c8a9%3A0x6d9a17409c9fa9cb!2sGreen%20Park%2C%20New%20Delhi%2C%20Delhi%20110016!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      className="w-full h-full border-0"
                      loading="lazy"
                      width="400"
                      height="128"
                    />
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Green+Park+New+Delhi+Dental+Clinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs cursor-pointer min-h-[40px]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Get Driving Directions</span>
                  </a>
                </div>
              </div>
            </Interactive3DCard>
          </div>

          {/* Card 2: Book an Appointment (Center Column, spans 4 cols) */}
          <div id="booking" className="lg:col-span-4 scroll-mt-24">
            <div className={`rounded-3xl transition-all duration-500 ${
              isGlowing 
                ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-white shadow-[0_0_45px_rgba(6,182,212,0.85)] scale-[1.01]' 
                : ''
            }`}>
              <Interactive3DCard variant="cyan">
                <div className="p-5 sm:p-7 bg-[#f0fbfd] text-left h-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a2540] tracking-tight">
                      Book an Appointment
                    </h3>
                    {isGlowing && (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-black animate-pulse">
                        <Sparkles className="w-3 h-3 text-cyan-200" />
                        <span>Ready to Book</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Schedule your visit with our specialist dentists.
                  </p>

                  {submitted ? (
                    <div className="py-10 sm:py-12 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                      <h4 className="text-base font-bold text-slate-900">Appointment Request Received!</h4>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        Connecting to Ganga Dental Clinic WhatsApp ({CLINIC_CONTACT.phone}) to confirm your preferred time slot.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-4 py-2.5 rounded-xl bg-cyan-100 text-cyan-900 font-bold text-xs cursor-pointer min-h-[40px]"
                      >
                        Book Another Slot
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <input
                          ref={fullNameInputRef}
                          type="text"
                          required
                          placeholder="Full Name *"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-slate-800 text-xs sm:text-sm min-h-[42px] transition-all duration-300 ${
                            isGlowing 
                              ? 'border-cyan-500 ring-2 ring-cyan-400 bg-cyan-50/40 shadow-sm' 
                              : 'border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                          }`}
                        />
                      </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 text-xs sm:text-sm min-h-[42px]"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 text-xs sm:text-sm min-h-[42px]"
                      />
                    </div>

                    {/* Preferred Doctor Prompt & Quick Selection Chips */}
                    <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                      isGlowing && !selectedDoctor 
                        ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-300 shadow-sm' 
                        : 'bg-white/80 border-cyan-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#005f73]" />
                          <span>Preferred Doctor / Specialist *</span>
                        </label>
                        {selectedDoctor ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                            Selected: {selectedDoctor.split(' ')[1] || selectedDoctor}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-full border border-cyan-300 animate-pulse">
                            Please select a specialist
                          </span>
                        )}
                      </div>

                      {/* Interactive Doctor Chips for 1-Tap Selection */}
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        {DOCTORS.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedDoctor(d.name)}
                            className={`p-1.5 rounded-xl text-left text-[11px] font-bold transition-all border cursor-pointer flex flex-col ${
                              selectedDoctor === d.name
                                ? 'bg-[#005f73] text-white border-[#005f73] shadow-xs scale-[1.02]'
                                : 'bg-white hover:bg-cyan-50/80 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span className="truncate">{d.name}</span>
                            <span className={`text-[9px] font-medium truncate ${
                              selectedDoctor === d.name ? 'text-cyan-200' : 'text-slate-500'
                            }`}>
                              {d.specialization.split(' ')[0]} ({d.experience})
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Dropdown for More Options including 'Any Available Specialist' */}
                      <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 font-medium text-xs min-h-[38px]"
                      >
                        <option value="">-- Choose or Change Preferred Doctor --</option>
                        {DOCTORS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} – {d.specialization} ({d.experience})
                          </option>
                        ))}
                        <option value="Any Specialist Dentist">Any Available Specialist (First Available Slot)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Select Service */}
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 font-medium text-xs sm:text-sm min-h-[42px]"
                      >
                        <option value="">Select Service / Treatment</option>
                        {ALL_SERVICES.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 text-xs sm:text-sm min-h-[42px]"
                      />
                    </div>

                    <div>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 text-xs sm:text-sm min-h-[42px]"
                      >
                        <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                        <option value="01:00 PM">01:00 PM - 02:00 PM</option>
                        <option value="04:30 PM">04:30 PM - 05:30 PM</option>
                        <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                        <option value="07:00 PM">07:00 PM - 08:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Brief description of dental concern or tooth pain..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 resize-none text-xs sm:text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer min-h-[44px]"
                    >
                      <Calendar className="w-4 h-4 text-cyan-200" />
                      <span>Confirm & Book Appointment</span>
                    </button>
                  </form>
                )}
              </div>
            </Interactive3DCard>
            </div>
          </div>

          {/* Card 3: Frequently Asked Questions (Right Column, spans 4 cols) */}
          <div id="faq" className="lg:col-span-4">
            <Interactive3DCard variant="teal">
              <div className="p-5 sm:p-7 bg-[#f0fbfd] flex flex-col justify-between h-full text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a2540] mb-3 sm:mb-4 tracking-tight">
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {FAQS.slice(0, 5).map((faq, index) => {
                      const isOpen = expandedFaq === index;
                      return (
                        <div
                          key={index}
                          className="rounded-2xl bg-white border border-cyan-100/80 overflow-hidden shadow-2xs"
                        >
                          <button
                            onClick={() => setExpandedFaq(isOpen ? null : index)}
                            className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-cyan-900 transition-colors cursor-pointer min-h-[44px]"
                          >
                            <span className="pr-2">{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-cyan-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-3.5 pb-3 text-slate-600 leading-relaxed text-[11px] sm:text-xs border-t border-cyan-50 pt-2 animate-in fade-in duration-200">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-cyan-200/60">
                  <a
                    href={CLINIC_CONTACT.telLink}
                    className="text-xs font-semibold text-cyan-900 hover:text-cyan-950 flex items-center justify-center space-x-1.5 cursor-pointer py-1"
                  >
                    <span>Have more questions? Call {CLINIC_CONTACT.phone}</span>
                  </a>
                </div>
              </div>
            </Interactive3DCard>
          </div>

        </div>

      </div>
    </section>
  );
});
