import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Users, 
  UserCheck, 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Clock, 
  Check,
  ChevronDown
} from 'lucide-react';
import { CLINIC_INFO, clinicReceptionPhoto } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

interface AboutAndWhyProps {
  onOpenBooking: () => void;
}

export const AboutAndWhySection: React.FC<AboutAndWhyProps> = ({ onOpenBooking }) => {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <section id="about" className="pt-2 pb-6 sm:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section Layout: Clinic Reception Photo and About Ganga Dental Clinic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* 1. Left Card: Clinic Reception Desk Photo */}
          <div className="lg:col-span-5">
            <Interactive3DCard className="h-full">
              <div className="relative h-full min-h-[280px] sm:min-h-[340px] group bg-cyan-50 overflow-hidden">
                <img
                  src={clinicReceptionPhoto}
                  alt="Ganga Dental Clinic Modern Reception Area"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/60 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-cyan-100 border border-white/30 inline-block mb-1">
                    State-Of-The-Art Clinic
                  </span>
                  <p className="text-sm font-semibold text-white">
                    Warm, Welcoming & Modern Environment
                  </p>
                </div>
              </div>
            </Interactive3DCard>
          </div>

          {/* 2. Right Card: About Ganga Dental Clinic */}
          <div className="lg:col-span-7">
            <Interactive3DCard className="h-full">
              <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-[#f0fbfd]">
                <div className="space-y-3.5 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 block">
                    About Ganga Dental Clinic
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight leading-tight">
                    Your Trusted Partner in Dental Health
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    At Ganga Dental Clinic, we believe that a healthy smile brings confidence, happiness and better health. Our team of experienced dentists, modern technology and personalized care ensure the best dental experience for you and your family.
                  </p>

                  {showFullStory && (
                    <div className="pt-2 text-sm text-slate-600 space-y-2 border-t border-cyan-200/60 animate-in fade-in duration-300">
                      <p>
                        From gentle preventative cleanings to complex microscopic root canal treatments and full mouth rehabilitations, we prioritize patient comfort, hospital-grade hygiene, and transparent care at every step.
                      </p>
                      <p className="font-semibold text-cyan-900">
                        Mission: To make gentle, advanced, and reliable oral healthcare accessible to everyone with zero fear and complete compassion.
                      </p>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setShowFullStory(!showFullStory)}
                      className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#005f73] hover:text-[#083e4a] transition-colors group pt-1 cursor-pointer"
                    >
                      <span>{showFullStory ? 'Show Less' : 'Learn More'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 4 Statistics in modern cyan circular pill cards */}
                <div className="grid grid-cols-2 gap-3 pt-6 mt-4 border-t border-cyan-100">
                  {/* 10+ Years of Experience */}
                  <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/80 border border-cyan-100">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100/80 flex items-center justify-center text-cyan-800 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">10+</span>
                      <span className="text-[11px] text-slate-500 font-medium">Years Experience</span>
                    </div>
                  </div>

                  {/* 5K+ Happy Patients */}
                  <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/80 border border-cyan-100">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100/80 flex items-center justify-center text-cyan-800 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">5K+</span>
                      <span className="text-[11px] text-slate-500 font-medium">Happy Patients</span>
                    </div>
                  </div>

                  {/* 8+ Expert Dentists */}
                  <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/80 border border-cyan-100">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100/80 flex items-center justify-center text-cyan-800 shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">8+</span>
                      <span className="text-[11px] text-slate-500 font-medium">Dental Experts</span>
                    </div>
                  </div>

                  {/* 100% Patient Satisfaction */}
                  <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/80 border border-cyan-100">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100/80 flex items-center justify-center text-cyan-800 shrink-0">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">100%</span>
                      <span className="text-[11px] text-slate-500 font-medium">Patient Care</span>
                    </div>
                  </div>
                </div>

              </div>
            </Interactive3DCard>
          </div>

        </div>

      </div>
    </section>
  );
};
