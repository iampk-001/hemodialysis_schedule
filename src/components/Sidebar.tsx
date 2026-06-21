import type { Staff } from '../types';
import { StaffCard } from './StaffCard';
import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';

interface SidebarProps {
  staffList: Staff[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ staffList, isOpen, onClose }) => {
  // Use Droppable for the sidebar so staff can be dragged back to unassign them
  const { setNodeRef } = useDroppable({
    id: 'sidebar-pool',
  });

  const groupedStaff = staffList.reduce((acc, staff) => {
    if (!acc[staff.role]) acc[staff.role] = [];
    acc[staff.role].push(staff);
    return acc;
  }, {} as Record<string, Staff[]>);

  const roleLabels: Record<string, string> = {
    Nephrologist: 'แพทย์เฉพาะทางโรคไต',
    InChargeRN: 'พยาบาลหัวหน้าเวร',
    RN: 'พยาบาลไตเทียม',
    PN_NA: 'ผู้ช่วยพยาบาล',
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <div 
        ref={setNodeRef}
        className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-73px)] overflow-y-auto p-4 flex flex-col gap-6 transition-transform z-40
          fixed md:relative inset-y-0 left-0 top-[73px] md:top-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">Staff Pool</h2>
          <button onClick={onClose} className="md:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      
      {Object.entries(groupedStaff).map(([role, staff]) => (
        <div key={role} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {roleLabels[role] || role} ({staff.length})
          </h3>
          <div className="flex flex-col gap-2">
            {staff.map(s => (
              <StaffCard key={s.id} draggableId={s.id} staff={s} />
            ))}
          </div>
        </div>
      ))}
      </div>
    </>
  );
};
