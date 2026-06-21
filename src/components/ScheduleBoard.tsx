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
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-max">
        {/* Header Row */}
        <div 
          className="grid border-b border-gray-200 bg-gray-100 sticky top-0 z-20"
          style={{ gridTemplateColumns: `120px repeat(${daysInMonth.length}, minmax(160px, 1fr))` }}
        >
          <div className="p-4 font-semibold text-gray-600 border-r border-gray-200 sticky left-0 bg-gray-100 z-30">
            Shifts
          </div>
          {daysInMonth.map((dayDate) => (
            <div key={dayDate.toISOString()} className="p-4 text-center font-bold text-gray-800 border-r border-gray-200">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{format(dayDate, 'EEE')}</div>
              <div className="text-lg">{format(dayDate, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Body Rows */}
        <div className="relative">
          {ZONES.map((zone) => (
            <React.Fragment key={zone}>
              <div className="bg-medical-blue/10 p-2 font-bold text-medical-blue sticky left-0 z-20 w-max pr-12 rounded-r-full my-2">
                {zone}
              </div>
              {SHIFTS.map((shift) => (
                <div 
                  key={`${zone}-${shift}`} 
                  className="grid border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  style={{ gridTemplateColumns: `120px repeat(${daysInMonth.length}, minmax(160px, 1fr))` }}
                >
                  <div className="p-4 font-medium text-sm text-gray-700 border-r border-gray-200 bg-white sticky left-0 z-20 group-hover:bg-gray-50 transition-colors flex items-center">
                    {shift}
                  </div>
                  {daysInMonth.map((dayDate) => {
                    const dateStr = format(dayDate, 'yyyy-MM-dd');
                    const slotId = `${dateStr}-${shift}-${zone}`;
                    const slot = boardState[slotId];
                    
                    if (!slot) return <div key={slotId} className="border-r border-gray-100" />;

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
