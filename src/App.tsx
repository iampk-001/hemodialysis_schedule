import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScheduleBoard } from './components/ScheduleBoard';
import { generateEmptyBoard, mockStaffList, initialStaffMap } from './mockData';
import type { BoardState, Staff } from './types';
import { StaffCard } from './components/StaffCard';

function App() {
  const [boardState, setBoardState] = useState<BoardState>(generateEmptyBoard());
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStaff, setActiveStaff] = useState<Staff | null>(null);

  const handleAutoAssign = () => {
    setIsSimulating(true);
    // Simulate loading for 1.5 seconds
    setTimeout(() => {
      const newBoard = generateEmptyBoard();
      const inChargeIds = mockStaffList.filter(s => s.role === 'InChargeRN').map(s => s.id);
      const rnIds = mockStaffList.filter(s => s.role === 'RN').map(s => s.id);
      const pnIds = mockStaffList.filter(s => s.role === 'PN_NA').map(s => s.id);
      const mdIds = mockStaffList.filter(s => s.role === 'Nephrologist').map(s => s.id);

      // Super simple mock auto-assign algorithm
      Object.keys(newBoard).forEach((slotId) => {
        const slot = newBoard[slotId];
        // Assign 1 In-charge to Zone A morning/afternoon randomly to pass/fail skill mix
        if (slot.zone === 'Zone A' && (slot.shift === 'Morning' || slot.shift === 'Afternoon')) {
          if (Math.random() > 0.2) slot.staffIds.push(inChargeIds[Math.floor(Math.random() * inChargeIds.length)]);
        }
        // Assign some RNs
        slot.staffIds.push(rnIds[Math.floor(Math.random() * rnIds.length)]);
        if (slot.zone === 'Zone A') {
          slot.staffIds.push(rnIds[Math.floor(Math.random() * rnIds.length)]);
          slot.staffIds.push(rnIds[Math.floor(Math.random() * rnIds.length)]); // try to pass ratio
        }
        // Assign PN
        if (Math.random() > 0.5) slot.staffIds.push(pnIds[Math.floor(Math.random() * pnIds.length)]);
        
        // Random MD for morning shift
        if (slot.shift === 'Morning' && Math.random() > 0.8) {
          slot.staffIds.push(mdIds[Math.floor(Math.random() * mdIds.length)]);
        }

        // Deduplicate
        slot.staffIds = Array.from(new Set(slot.staffIds));
      });

      setBoardState(newBoard);
      setIsSimulating(false);
    }, 1500);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const staff = active.data.current?.staff as Staff;
    if (staff) {
      setActiveStaff(staff);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStaff(null);

    if (!over) return;

    const staffId = active.id as string;
    const overId = over.id as string; // either a slotId or 'sidebar-pool'

    setBoardState((prevBoard) => {
      const newBoard = { ...prevBoard };

      // Remove staff from all existing slots first (since a staff can only be in one place at a time conceptually, but in our scheduling maybe they work multiple slots. For this prototype, let's say they can be dragged to a slot. If dragged FROM pool TO slot -> add to slot. If dragged FROM slot TO slot -> remove from old, add to new. If dragged FROM slot TO pool -> remove from slot.)
      // Wait, if they can work multiple shifts in a week, we shouldn't remove them from other shifts unless it's the exact same shift.
      // But we don't have a specific instance ID for the dragged item, we only have staffId.
      // Let's implement: Dragging a staff card assigns them to the new slot. 
      // If they were already in that slot, don't do anything. 
      // To "move", maybe we allow removing them by dragging them back to the sidebar?
      // Since they can work multiple shifts, dragging from Sidebar just ADDS them. 
      // Dragging from a Slot to Sidebar REMOVES them.
      // Dragging from Slot A to Slot B REMOVES from Slot A, ADDS to Slot B.
      // But how do we know where they came from? dnd-kit doesn't natively track "source container" unless we build it in. 
      // Actually, since we render StaffCards with id=`${slot.id}-${staff.id}` in ShiftCell, and id=`${staff.id}` in Sidebar.
      
      const draggedFromSlotId = active.id.toString().includes('-') ? active.id.toString().substring(0, active.id.toString().lastIndexOf('-')) : null;
      const actualStaffId = active.id.toString().includes('-') ? active.id.toString().split('-').pop() : staffId;

      if (!actualStaffId) return prevBoard;

      // If dragged from a slot, remove them from that old slot
      if (draggedFromSlotId && newBoard[draggedFromSlotId]) {
        newBoard[draggedFromSlotId] = {
          ...newBoard[draggedFromSlotId],
          staffIds: newBoard[draggedFromSlotId].staffIds.filter(id => id !== actualStaffId),
        };
      }

      // If dropped onto a slot, add them to the new slot
      if (overId !== 'sidebar-pool' && newBoard[overId]) {
        // Prevent duplicate
        if (!newBoard[overId].staffIds.includes(actualStaffId)) {
          newBoard[overId] = {
            ...newBoard[overId],
            staffIds: [...newBoard[overId].staffIds, actualStaffId],
          };
        }
      }

      return newBoard;
    });
  };

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onAutoAssign={handleAutoAssign} isSimulating={isSimulating} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar staffList={mockStaffList} />
          <ScheduleBoard boardState={boardState} staffMap={initialStaffMap} />
        </div>
      </div>

      <DragOverlay>
        {activeStaff ? <StaffCard staff={activeStaff} draggableId="overlay" /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
