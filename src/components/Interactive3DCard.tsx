import React, { useState, useEffect, useId } from 'react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'cyan' | 'teal' | 'gold' | 'rose';
}

// Single square perimeter glow configurations (NO double square, same thickness and color)
const GLOW_CONFIGS = {
  cyan: {
    activeBorderClass: 'border-2 border-cyan-400',
    idleBorderClass: 'border border-cyan-100/90',
    activeShadow:
      '0 0 24px 4px rgba(6, 182, 212, 0.65), 0 0 10px 2px rgba(34, 211, 238, 0.85), 0 20px 40px -10px rgba(0, 95, 115, 0.38)',
    idleShadow:
      '0 2px 8px -2px rgba(0, 95, 115, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  teal: {
    activeBorderClass: 'border-2 border-teal-400',
    idleBorderClass: 'border border-teal-100/90',
    activeShadow:
      '0 0 24px 4px rgba(20, 184, 166, 0.65), 0 0 10px 2px rgba(45, 212, 191, 0.85), 0 20px 40px -10px rgba(15, 118, 110, 0.38)',
    idleShadow:
      '0 2px 8px -2px rgba(15, 118, 110, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  gold: {
    activeBorderClass: 'border-2 border-amber-400',
    idleBorderClass: 'border border-amber-100/90',
    activeShadow:
      '0 0 24px 4px rgba(245, 158, 11, 0.65), 0 0 10px 2px rgba(251, 191, 36, 0.85), 0 20px 40px -10px rgba(180, 83, 9, 0.38)',
    idleShadow:
      '0 2px 8px -2px rgba(180, 83, 9, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  rose: {
    activeBorderClass: 'border-2 border-rose-400',
    idleBorderClass: 'border border-rose-100/90',
    activeShadow:
      '0 0 24px 4px rgba(244, 63, 94, 0.65), 0 0 10px 2px rgba(251, 113, 133, 0.85), 0 20px 40px -10px rgba(159, 18, 57, 0.38)',
    idleShadow:
      '0 2px 8px -2px rgba(159, 18, 57, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Global single-active-card manager: notifies only previous and new card (O(1))
let globalActiveCardId: string | null = null;
const cardListenersMap = new Map<string, (active: boolean) => void>();

export function setActiveInteractiveCard(id: string | null) {
  if (globalActiveCardId === id) return;
  const prevId = globalActiveCardId;
  globalActiveCardId = id;

  if (prevId && cardListenersMap.has(prevId)) {
    try {
      cardListenersMap.get(prevId)!(false);
    } catch {
      // ignore
    }
  }
  if (id && cardListenersMap.has(id)) {
    try {
      cardListenersMap.get(id)!(true);
    } catch {
      // ignore
    }
  }
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = React.memo(({
  children,
  className = '',
  onClick,
  variant = 'cyan'
}) => {
  const instanceId = useId();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    cardListenersMap.set(instanceId, setIsActive);
    return () => {
      cardListenersMap.delete(instanceId);
      if (globalActiveCardId === instanceId) {
        globalActiveCardId = null;
      }
    };
  }, [instanceId]);

  // Activate this card and immediately deactivate any other card across the entire app
  const activate = () => {
    if (globalActiveCardId !== instanceId) {
      setActiveInteractiveCard(instanceId);
    }
  };

  // Cursor hover / touch handlers
  const handleMouseEnter = () => {
    activate();
  };

  const handleTouchStart = () => {
    activate();
  };

  const handleClick = () => {
    activate();
    if (onClick) {
      onClick();
    }
  };

  const glowConfig = GLOW_CONFIGS[variant];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className={`relative transition-all duration-300 ease-out ${
        isActive ? 'z-30 will-change-transform' : 'z-10'
      } ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* SINGLE SQUARE CARD: EXACT SAME SQUARE WITH GLOW AND 3D FORWARD POP */}
      <div
        className={`w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ease-out transform-gpu bg-white ${
          isActive
            ? `-translate-y-1.5 sm:-translate-y-3.5 scale-[1.015] sm:scale-[1.03] ${glowConfig.activeBorderClass}`
            : `translate-y-0 scale-100 ${glowConfig.idleBorderClass}`
        }`}
        style={{
          boxShadow: isActive ? glowConfig.activeShadow : glowConfig.idleShadow,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
});
