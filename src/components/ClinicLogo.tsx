import React from 'react';

interface ClinicLogoProps {
  className?: string;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({ 
  className = '', 
  isLight = false,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-7 h-7 sm:w-9 sm:h-9';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[10px] sm:text-[11px]' : 'text-[9px] sm:text-[10px]';

  return (
    <div className={`flex items-center space-x-2 sm:space-x-2.5 select-none ${className}`}>
      {/* Clean Modern Outline Tooth Icon */}
      <div className={`relative ${iconSize} flex items-center justify-center shrink-0`}>
        <svg 
          viewBox="0 0 40 44" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-cyan-600 drop-shadow-xs"
        >
          <path 
            d="M20 3C12.5 3 6 8.5 6 16C6 21 8.5 25.5 11 30.5C13.2 35 15 41 17 41C19 41 19.5 35 20 31.5C20.5 35 21 41 23 41C25 41 26.8 35 29 30.5C31.5 25.5 34 21 34 16C34 8.5 27.5 3 20 3Z" 
            stroke="currentColor" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill={isLight ? "rgba(255,255,255,0.15)" : "rgba(6,182,212,0.08)"}
          />
          {/* Subtle inner sparkle / curve */}
          <path 
            d="M13 13C15 9.5 19 8.5 22 10" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight ${titleSize} ${isLight ? 'text-white' : 'text-[#0a2540]'}`}>
          Ganga
        </span>
        <span className={`font-semibold uppercase tracking-widest ${subtitleSize} ${isLight ? 'text-cyan-200' : 'text-cyan-700'}`}>
          Dental Clinic
        </span>
      </div>
    </div>
  );
};
