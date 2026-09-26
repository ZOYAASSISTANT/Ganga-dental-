import React, { useState } from 'react';
import { Star, ArrowRight, Calendar, CheckCircle2, Award, Clock, Phone, X } from 'lucide-react';
import { DOCTORS, Doctor, doctorTeamPhoto, CLINIC_CONTACT } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

interface DoctorTeamProps {
  onOpenBooking: (doctorName?: string) => void;
}

export const DoctorTeamSection: React.FC<DoctorTeamProps> = React.memo(({ onOpenBooking }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <section id="doctors" className="py-10 sm:py-16 bg-[#f0fbfd] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Team Banner + Right 4 Doctor Cards (Exact mockup layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Team Showcase (Mockup structure) */}
          <div className="lg:col-span-4">
            <Interactive3DCard className="h-full">
              <div className="h-full flex flex-col justify-between p-5 sm:p-7 bg-white text-left">
                <div>
                  {/* Doctor Team Group Photo */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xs border border-cyan-100 mb-4 sm:mb-5 h-44 sm:h-56 bg-cyan-50">
                    <img
                      src={doctorTeamPhoto}
                      alt="Ganga Dental Clinic Expert Dental Team"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={533}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight leading-tight">
                    Meet Our Expert Doctors
                  </h2>

                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 mt-1">
                    Skilled Professionals, Caring Hearts
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                    Our team of experienced dentists and specialists are committed to providing you with the best dental care using modern techniques and gentle approach.
                  </p>
                </div>

                <div className="pt-5 sm:pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onOpenBooking()}
                    className="w-full py-3 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer min-h-[42px]"
                  >
                    <span>Book With a Specialist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Interactive3DCard>
          </div>

          {/* Right Column: 4 Individual Doctor Cards (Spacious 2 columns on tablet/small laptop, 4 on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {DOCTORS.map((doc) => (
              <Interactive3DCard key={doc.id}>
                <div className="bg-white p-3.5 sm:p-4 h-full flex flex-col justify-between text-center group">
                  <div>
                    {/* Doctor Photo */}
                    <div className="w-22 h-22 sm:w-26 sm:h-26 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-100 shadow-xs mb-3 bg-cyan-50 group-hover:border-cyan-400 transition-colors">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        width={112}
                        height={112}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Doctor Name & Specialization */}
                    <h3 className="font-extrabold text-sm text-[#0a2540] leading-snug">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-cyan-700 mt-0.5">
                      {doc.specialization}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.experience}
                    </p>

                    {/* Star Rating (5 Gold Stars) */}
                    <div className="flex items-center justify-center space-x-0.5 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="w-full py-1.5 rounded-lg text-xs font-semibold text-[#005f73] hover:bg-cyan-50 transition-colors cursor-pointer min-h-[34px] flex items-center justify-center"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking(`Consultation with ${doc.name}`)}
                      className="w-full py-2 rounded-xl bg-cyan-50 hover:bg-[#005f73] text-cyan-800 hover:text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer min-h-[36px]"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Book Appt</span>
                    </button>
                  </div>
                </div>
              </Interactive3DCard>
            ))}
          </div>

        </div>

      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedDoctor(null)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-cyan-100 text-left max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              aria-label="Close doctor profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-200 shrink-0 bg-cyan-50">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-full h-full object-cover object-top" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0a2540]">{selectedDoctor.name}</h3>
                <p className="text-xs font-bold text-cyan-700">{selectedDoctor.specialization}</p>
                <p className="text-xs text-slate-500">{selectedDoctor.qualification}</p>
                <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  <span className="text-[10px] text-slate-400">({selectedDoctor.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-cyan-50/50 p-3.5 sm:p-4 rounded-2xl border border-cyan-100">
              <p className="leading-relaxed">{selectedDoctor.bio}</p>
              <div className="flex items-center space-x-2 text-cyan-900 font-semibold pt-1 border-t border-cyan-100">
                <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Clinic Availability: {selectedDoctor.availableDays}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 min-h-[38px]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const doc = selectedDoctor;
                  setSelectedDoctor(null);
                  onOpenBooking(`Consultation with ${doc.name}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 min-h-[38px]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book With {selectedDoctor.name.split(' ')[1]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
