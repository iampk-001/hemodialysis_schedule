import { useDroppable } from '@dnd-kit/core';
import type { ShiftSlot, StaffMap, BoardState } from '../types';
import { StaffCard } from './StaffCard';
import { AlertTriangle, UserX } from 'lucide-react';
import { checkSkillMix, checkRatio, checkFatigue } from '../utils/rules';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ShiftCellProps {
  slot: ShiftSlot;
  staffMap: StaffMap;
  boardState: BoardState;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({ slot, staffMap, boardState }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
    data: { slot },
  });

  const staffInSlot = slot.staffIds.map(id => staffMap[id]).filter(Boolean);

  // Validate rules
  const skillMixOk = checkSkillMix(boardState, slot.date, slot.shift, staffMap);
  const ratioOk = checkRatio(boardState, slot.date, slot.shift, slot.zone, staffMap);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[100px] border-r border-gray-100 dark:border-gray-700 p-2 flex flex-col gap-2 transition-colors",
        isOver && "bg-medical-lightBlue dark:bg-medical-blue/20 border-medical-teal border-dashed border-2",
        !ratioOk && "bg-red-50 dark:bg-red-900/10"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-bold text-gray-600">{slot.zone}</span>
        <div className="flex gap-1">
          {(!skillMixOk && (slot.shift === 'Morning' || slot.shift === 'Afternoon')) && (
            <span title="Missing In-charge RN"><AlertTriangle className="w-4 h-4 text-yellow-500" /></span>
          )}
          {!ratioOk && (
            <div className="flex items-center text-red-500 text-xs font-bold gap-1" title="พยาบาลไม่พอ (Ratio Alert)">
              <UserX className="w-4 h-4" /> Ratio
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {staffInSlot.map(staff => (
          <StaffCard 
            key={`${slot.id}-${staff.id}`} 
            draggableId={`${slot.id}-${staff.id}`}
            staff={staff} 
            hasFatigueWarning={checkFatigue(staff.id, slot.date, slot.shift, boardState)} 
          />
        ))}
      </div>
    </div>
  );
};
