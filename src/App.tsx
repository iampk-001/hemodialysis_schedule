import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScheduleBoard } from './components/ScheduleBoard';
import { generateEmptyBoard, mockStaffList } from './mockData';
import type { BoardState, Staff, StaffMap } from './types';
import { StaffCard } from './components/StaffCard';
import { StaffManagerModal } from './components/StaffManagerModal';
import { addMonths, subMonths } from 'date-fns';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-06-01T00:00:00'));

  const [staffList, setStaffList] = useState<Staff[]>(mockStaffList);
  const staffMap = useMemo(() => {
    return staffList.reduce((acc, staff) => {
      acc[staff.id] = staff;
      return acc;
    }, {} as StaffMap);
  }, [staffList]);
  
  const [boardState, setBoardState] = useState<BoardState>(generateEmptyBoard(currentDate));
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStaff, setActiveStaff] = useState<Staff | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const handleAddStaff = (newStaff: Omit<Staff, 'id'>) => {
    const id = `s${Date.now()}`;
    setStaffList([...staffList, { ...newStaff, id }]);
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaffList(staffList.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
    // Also remove them from the board
    setBoardState(prev => {
      const newBoard = { ...prev };
      Object.keys(newBoard).forEach(slotId => {
        if (newBoard[slotId].staffIds.includes(id)) {
          newBoard[slotId] = {
            ...newBoard[slotId],
            staffIds: newBoard[slotId].staffIds.filter(sId => sId !== id)
          };
        }
      });
      return newBoard;
    });
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setBoardState(generateEmptyBoard(newDate));
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setBoardState(generateEmptyBoard(newDate));
  };

  const handleAutoAssign = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const newBoard = generateEmptyBoard(currentDate);
      const inChargeIds = staffList.filter(s => s.role === 'InChargeRN').map(s => s.id);
      const rnIds = staffList.filter(s => s.role === 'RN').map(s => s.id);
      const pnIds = staffList.filter(s => s.role === 'PN_NA').map(s => s.id);
      const mdIds = staffList.filter(s => s.role === 'Nephrologist').map(s => s.id);

      // Super simple mock auto-assign algorithm
      Object.keys(newBoard).forEach((slotId) => {
        const slot = newBoard[slotId];
        
        // Filter available staff based on daysOff
        const availableInCharge = inChargeIds.filter(id => !(staffMap[id]?.daysOff || []).includes(slot.date));
        const availableRn = rnIds.filter(id => !(staffMap[id]?.daysOff || []).includes(slot.date));
        const availablePn = pnIds.filter(id => !(staffMap[id]?.daysOff || []).includes(slot.date));
        const availableMd = mdIds.filter(id => !(staffMap[id]?.daysOff || []).includes(slot.date));

        // Assign 1 In-charge to Zone A morning/afternoon randomly to pass/fail skill mix
        if (slot.zone === 'Zone A' && (slot.shift === 'Morning' || slot.shift === 'Afternoon')) {
          if (Math.random() > 0.2 && availableInCharge.length > 0) {
            slot.staffIds.push(availableInCharge[Math.floor(Math.random() * availableInCharge.length)]);
          }
        }
        // Assign some RNs
        if (availableRn.length > 0) {
          slot.staffIds.push(availableRn[Math.floor(Math.random() * availableRn.length)]);
        }
        if (slot.zone === 'Zone A' && availableRn.length > 0) {
          slot.staffIds.push(availableRn[Math.floor(Math.random() * availableRn.length)]);
          slot.staffIds.push(availableRn[Math.floor(Math.random() * availableRn.length)]); // try to pass ratio
        }
        // Assign PN
        if (Math.random() > 0.5 && availablePn.length > 0) {
          slot.staffIds.push(availablePn[Math.floor(Math.random() * availablePn.length)]);
        }
        
        // Random MD for morning shift
        if (slot.shift === 'Morning' && Math.random() > 0.8 && availableMd.length > 0) {
          slot.staffIds.push(availableMd[Math.floor(Math.random() * availableMd.length)]);
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
        <Header 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onAutoAssign={handleAutoAssign} 
          isSimulating={isSimulating} 
          onManageStaff={() => setIsManagerOpen(true)}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar staffList={staffList} />
          <ScheduleBoard boardState={boardState} staffMap={staffMap} currentDate={currentDate} />
        </div>
      </div>

      <StaffManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        staffList={staffList}
        onAddStaff={handleAddStaff}
        onUpdateStaff={handleUpdateStaff}
        onDeleteStaff={handleDeleteStaff}
      />

      <DragOverlay>
        {activeStaff ? <StaffCard staff={activeStaff} draggableId="overlay" /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
