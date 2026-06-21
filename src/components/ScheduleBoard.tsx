import type { BoardState, StaffMap } from '../types';
import { DAYS, SHIFTS, ZONES } from '../mockData';
import { ShiftCell } from './ShiftCell';

interface ScheduleBoardProps {
  boardState: BoardState;
  staffMap: StaffMap;
}

export const ScheduleBoard: React.FC<ScheduleBoardProps> = ({ boardState, staffMap }) => {
  return (
    <div className="flex-1 overflow-auto p-6 bg-white no-scrollbar">
      <div className="min-w-[1200px]">
        {/* Header Row: Days */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 mb-4">
          <div className="font-bold text-gray-500 text-right pr-4 flex items-center justify-end">Shifts</div>
          {DAYS.map(day => (
            <div key={day} className="text-center font-bold text-medical-blue bg-medical-lightBlue py-2 rounded-t-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Rows: Shifts */}
        <div className="flex flex-col gap-6">
          {SHIFTS.map(shift => (
            <div key={shift} className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 items-stretch border-b border-gray-100 pb-6">
              {/* Shift Label */}
              <div className="font-bold text-gray-700 text-right pr-4 pt-2">
                {shift}
              </div>

              {/* Day Columns for the Shift */}
              {DAYS.map(day => (
                <div key={`${day}-${shift}`} className="flex flex-col gap-2">
                  {/* Zones */}
                  {ZONES.map(zone => {
                    const slotId = `${day}-${shift}-${zone}`;
                    const slot = boardState[slotId];
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
