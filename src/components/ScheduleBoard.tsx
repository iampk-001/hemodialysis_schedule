import React from 'react';
import type { BoardState, StaffMap } from '../types';
import { ShiftCell } from './ShiftCell';
import { SHIFTS, ZONES } from '../mockData';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface ScheduleBoardProps {
  boardState: BoardState;
  staffMap: StaffMap;
  currentDate: Date;
}

export const ScheduleBoard: React.FC<ScheduleBoardProps> = ({ boardState, staffMap, currentDate }) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-2 md:p-6 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-w-max transition-colors">
        {/* Header Row */}
        <div 
          className="grid border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 sticky top-0 z-20 transition-colors"
          style={{ gridTemplateColumns: `100px repeat(${daysInMonth.length}, minmax(140px, 1fr))` }}
        >
          <div className="p-3 md:p-4 font-semibold text-sm md:text-base text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-100 dark:bg-gray-800 z-30 transition-colors flex items-center justify-center">
            Shifts
          </div>
          {daysInMonth.map((dayDate) => (
            <div key={dayDate.toISOString()} className="p-2 md:p-4 text-center font-bold text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{format(dayDate, 'EEE')}</div>
              <div className="text-base md:text-lg">{format(dayDate, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Body Rows */}
        <div className="relative">
          {ZONES.map((zone) => (
            <React.Fragment key={zone}>
              <div className="bg-medical-blue/10 dark:bg-medical-blue/20 p-1.5 md:p-2 text-sm md:text-base font-bold text-medical-blue dark:text-teal-400 sticky left-0 z-20 w-max pr-8 md:pr-12 rounded-r-full my-2 transition-colors">
                {zone}
              </div>
              {SHIFTS.map((shift) => (
                <div 
                  key={`${zone}-${shift}`} 
                  className="grid border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  style={{ gridTemplateColumns: `100px repeat(${daysInMonth.length}, minmax(140px, 1fr))` }}
                >
                  <div className="p-2 md:p-4 font-medium text-xs md:text-sm text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky left-0 z-20 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors flex items-center justify-center text-center">
                    {shift}
                  </div>
                  {daysInMonth.map((dayDate) => {
                    const dateStr = format(dayDate, 'yyyy-MM-dd');
                    const slotId = `${dateStr}-${shift}-${zone}`;
                    const slot = boardState[slotId];
                    
                    if (!slot) return <div key={slotId} className="border-r border-gray-100 dark:border-gray-700 transition-colors" />;

                    return (
                      <ShiftCell 
                        key={slotId}
                        slot={slot}
                        staffMap={staffMap}
                        boardState={boardState}
                      />
                    );
                  })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
