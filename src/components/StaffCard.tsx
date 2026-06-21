import { useDraggable } from '@dnd-kit/core';
import type { Staff } from '../types';
import { AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StaffCardProps {
  staff: Staff;
  draggableId: string; // Must be unique across all rendered cards
  hasFatigueWarning?: boolean;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, draggableId, hasFatigueWarning = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    data: { staff },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const roleColors: Record<Staff['role'], string> = {
    Nephrologist: 'bg-role-nephrologist text-white',
    InChargeRN: 'bg-role-inCharge text-white',
    RN: 'bg-role-rn text-white',
    PN_NA: 'bg-role-pn text-white',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative p-2 rounded-md text-sm font-medium shadow-sm cursor-grab active:cursor-grabbing transition-transform group flex justify-between items-center",
        roleColors[staff.role],
        isDragging && "opacity-50 scale-105 z-50 shadow-lg ring-2 ring-medical-teal"
      )}
      title={`${staff.role} | Total Week Hours: ${staff.totalHours}h`}
    >
      <span className="truncate">{staff.name}</span>
      
      {hasFatigueWarning && (
        <span title="พักผ่อนไม่พอ (Back-to-back shift)"><AlertCircle className="w-4 h-4 text-red-300 ml-1 animate-pulse" /></span>
      )}
      
      <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
        Total: {staff.totalHours} hrs
      </div>
    </div>
  );
};
