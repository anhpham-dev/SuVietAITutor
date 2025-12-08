import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-6 py-3 text-sm font-display font-medium tracking-wide transition-all duration-300
        rounded-t-lg border-t border-x shrink-0
        ${
          isActive
            ? 'glass-panel border-b-0 text-history-red border-history-gold/30 shadow-[0_-2px_6px_-1px_rgba(42,33,28,0.02)] z-10'
            : 'bg-white/30 text-history-wood/60 border-transparent hover:bg-white/50 hover:text-history-dark'
        }
      `}
    >
      <span className={`transition-transform duration-300 ${isActive ? 'scale-105 text-history-red opacity-100' : 'opacity-70'}`}>
        {icon}
      </span>
      {label}
      {isActive && (
        <span className="absolute top-0 left-0 w-full h-[2px] bg-history-red rounded-t-lg opacity-80"></span>
      )}
      {/* Visual blending for active tab */}
      {isActive && (
        <span className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-white z-20"></span>
      )}
    </button>
  );
};