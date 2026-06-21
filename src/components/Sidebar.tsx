import type { Staff } from '../types';
import { StaffCard } from './StaffCard';
import { useDroppable } from '@dnd-kit/core';

interface SidebarProps {
  staffList: Staff[];
}

export const Sidebar: React.FC<SidebarProps> = ({ staffList }) => {
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
    <div 
      ref={setNodeRef}
      className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto p-4 flex flex-col gap-6"
    >
      <h2 className="text-lg font-bold text-gray-700 border-b pb-2">Staff Pool</h2>
      
      {Object.entries(groupedStaff).map(([role, staff]) => (
        <div key={role} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
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
  );
};
