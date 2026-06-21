import React from 'react';
import { Wand2, Calendar as CalendarIcon } from 'lucide-react';

interface HeaderProps {
  onAutoAssign: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAutoAssign, isSimulating }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-medical-teal p-2 rounded-lg">
          <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-medical-blue">Hemodialysis Center Schedule</h1>
          <p className="text-sm text-gray-500">Staff Scheduling System • June 2026 (Week 4)</p>
        </div>
      </div>

      <button
        onClick={onAutoAssign}
        disabled={isSimulating}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all ${
          isSimulating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-medical-blue hover:bg-medical-teal shadow-md hover:shadow-lg active:scale-95'
        }`}
      >
        <Wand2 className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} />
        {isSimulating ? 'Simulating Schedule...' : 'Auto-Assign Shifts'}
      </button>
    </header>
  );
};
