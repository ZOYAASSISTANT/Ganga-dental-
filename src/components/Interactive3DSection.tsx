import React from 'react';

interface Interactive3DSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  intensity?: 'standard' | 'vibrant' | 'footer';
  belowFold?: boolean;
}

export const Interactive3DSection: React.FC<Interactive3DSectionProps> = React.memo(({
  children,
  id,
  className = '',
  belowFold = false
}) => {
  return (
    <section
      id={id}
      className={`relative my-2 sm:my-4 transition-colors ${belowFold ? 'cv-auto' : ''} ${className}`}
    >
      {children}
    </section>
  );
});

