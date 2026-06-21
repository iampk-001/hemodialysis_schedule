import type { BoardState, StaffMap, DayOfWeek, ShiftType } from '../types';
import { DAYS } from '../mockData';

export const checkSkillMix = (board: BoardState, day: DayOfWeek, shift: ShiftType, staffMap: StaffMap): boolean => {
  // Rule 1: Every Morning and Afternoon shift MUST have at least ONE "In-charge RN".
  if (shift !== 'Morning' && shift !== 'Afternoon') return true; // Rule doesn't apply
  
  const zones = ['Zone A', 'Zone B', 'Isolation'];
  let hasInCharge = false;

  for (const zone of zones) {
    const slotId = `${day}-${shift}-${zone}`;
    const slot = board[slotId];
    if (slot) {
      for (const staffId of slot.staffIds) {
        if (staffMap[staffId]?.role === 'InChargeRN') {
          hasInCharge = true;
          break;
        }
      }
    }
  }
  
  return hasInCharge;
};

export const checkRatio = (board: BoardState, day: DayOfWeek, shift: ShiftType, zone: string, staffMap: StaffMap): boolean => {
  // Rule 2: If the number of assigned RNs in a zone is too low (simulate a rule of 1 RN per 4 beds)
  // Let's assume Zone A has 12 beds (requires 3 RNs), Zone B has 8 beds (requires 2 RNs), Isolation has 4 beds (requires 1 RN)
  const slotId = `${day}-${shift}-${zone}`;
  const slot = board[slotId];
  if (!slot) return true;

  let rnCount = 0;
  for (const staffId of slot.staffIds) {
    const role = staffMap[staffId]?.role;
    if (role === 'RN' || role === 'InChargeRN') {
      rnCount++;
    }
  }

  if (zone === 'Zone A' && rnCount < 3) return false;
  if (zone === 'Zone B' && rnCount < 2) return false;
  if (zone === 'Isolation' && rnCount < 1) return false;

  return true;
};

export const checkFatigue = (staffId: string, day: DayOfWeek, shift: ShiftType, board: BoardState): boolean => {
  // Rule 3: Assigned to a Night Shift and the immediately following Morning Shift
  // If the current slot is Morning, check if they worked Night the previous day.
  // If the current slot is Night, check if they are working Morning the next day.
  
  const dayIndex = DAYS.indexOf(day);
  
  const checkWorkedShift = (d: DayOfWeek, s: ShiftType) => {
    const zones = ['Zone A', 'Zone B', 'Isolation'];
    for (const zone of zones) {
      const slot = board[`${d}-${s}-${zone}`];
      if (slot && slot.staffIds.includes(staffId)) {
        return true;
      }
    }
    return false;
  };

  if (shift === 'Morning') {
    if (dayIndex > 0) {
      const prevDay = DAYS[dayIndex - 1];
      if (checkWorkedShift(prevDay, 'Night')) return true; // Fatigue!
    }
  } else if (shift === 'Night') {
    if (dayIndex < DAYS.length - 1) {
      const nextDay = DAYS[dayIndex + 1];
      if (checkWorkedShift(nextDay, 'Morning')) return true; // Fatigue!
    }
  }

  return false;
};
