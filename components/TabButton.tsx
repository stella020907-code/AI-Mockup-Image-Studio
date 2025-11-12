import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-400
        ${
          isActive
            ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
            : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;
