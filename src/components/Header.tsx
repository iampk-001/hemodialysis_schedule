import { Wand2, Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Moon, Sun, Menu } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAutoAssign: () => void;
  isSimulating: boolean;
  onManageStaff: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onAutoAssign, isSimulating, onManageStaff, isDarkMode, toggleDarkMode, toggleMobileSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggleMobileSidebar} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="bg-medical-teal p-1.5 md:p-2 rounded-lg hidden sm:block">
          <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-medical-blue dark:text-teal-400">Hemodialysis Center Schedule</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly View</p>
        </div>
        
        <div className="flex items-center gap-1 md:gap-4 border border-gray-200 dark:border-gray-600 rounded-lg p-1 bg-gray-50 dark:bg-gray-700 md:ml-6">
          <button onClick={onPrevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-1 md:gap-2 px-1 md:px-2">
            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-medical-blue dark:text-teal-400 hidden sm:block" />
            <span className="font-semibold text-gray-700 dark:text-gray-200 min-w-[100px] md:min-w-[120px] text-center text-sm md:text-base">
              {format(currentDate, 'MMM yyyy')}
            </span>
          </div>
          <button onClick={onNextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors mr-2"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={onManageStaff}
          className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all border border-gray-300 dark:border-gray-600"
          title="Manage Staff"
        >
          <Users className="w-5 h-5" />
          <span className="hidden md:inline">Manage Staff</span>
        </button>

        <button
          onClick={onAutoAssign}
          disabled={isSimulating}
          className="bg-medical-teal hover:bg-teal-700 disabled:opacity-50 text-white px-3 py-2 md:px-6 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          title="Auto-Assign Shifts"
        >
          <Wand2 className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{isSimulating ? 'Assigning...' : 'Auto-Assign'}</span>
        </button>
      </div>
    </header>
  );
};
