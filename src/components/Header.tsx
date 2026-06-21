import React from 'react';
import { Wand2, Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAutoAssign: () => void;
  isSimulating: boolean;
  onManageStaff: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onAutoAssign, isSimulating, onManageStaff }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-medical-teal p-2 rounded-lg">
          <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-medical-blue">Hemodialysis Center Schedule</h1>
          <p className="text-sm text-gray-500">Monthly View</p>
        </div>
        
        <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-1 bg-gray-50 ml-6">
          <button onClick={onPrevMonth} className="p-1 hover:bg-gray-200 rounded">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 px-2">
            <CalendarIcon className="w-5 h-5 text-medical-blue" />
            <span className="font-semibold text-gray-700 min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>
          <button onClick={onNextMonth} className="p-1 hover:bg-gray-200 rounded">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onManageStaff}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border border-gray-300"
        >
          <Users className="w-5 h-5" />
          Manage Staff
        </button>

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
      </div>
    </header>
  );
};
