import type { Staff, StaffMap, BoardState, ShiftType, ZoneType } from './types';
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';

export const mockStaffList: Staff[] = [
  { id: 's1', name: 'Dr. Somchai', role: 'Nephrologist', totalHours: 40, daysOff: [] },
  { id: 's2', name: 'Dr. Ploy', role: 'Nephrologist', totalHours: 32, daysOff: ['2026-06-15'] },
  { id: 's3', name: 'RN. Araya', role: 'InChargeRN', totalHours: 48, daysOff: [] },
  { id: 's4', name: 'RN. Siriporn', role: 'InChargeRN', totalHours: 40, daysOff: ['2026-06-12'] },
  { id: 's5', name: 'RN. Nattapong', role: 'RN', totalHours: 40, daysOff: [] },
  { id: 's6', name: 'RN. Chanya', role: 'RN', totalHours: 36, daysOff: ['2026-06-20', '2026-06-21'] },
  { id: 's7', name: 'RN. Kanya', role: 'RN', totalHours: 40, daysOff: [] },
  { id: 's8', name: 'RN. Wut', role: 'RN', totalHours: 40, daysOff: [] },
  { id: 's9', name: 'RN. Pim', role: 'RN', totalHours: 40, daysOff: [] },
  { id: 's10', name: 'RN. Jirat', role: 'RN', totalHours: 32, daysOff: [] },
  { id: 's11', name: 'PN. Somsri', role: 'PN_NA', totalHours: 48, daysOff: [] },
  { id: 's12', name: 'PN. Mana', role: 'PN_NA', totalHours: 40, daysOff: ['2026-06-05'] },
  { id: 's13', name: 'PN. Vipa', role: 'PN_NA', totalHours: 40, daysOff: [] },
];

export const initialStaffMap: StaffMap = mockStaffList.reduce((acc, staff) => {
  acc[staff.id] = staff;
  return acc;
}, {} as StaffMap);

export const SHIFTS: ShiftType[] = ['Morning', 'Afternoon', 'Night', 'OnCall'];
export const ZONES: ZoneType[] = ['Zone A', 'Zone B', 'Isolation'];

export const generateEmptyBoard = (monthDate: Date): BoardState => {
  const board: BoardState = {};
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate)
  });

  daysInMonth.forEach(dayDate => {
    const dateStr = format(dayDate, 'yyyy-MM-dd');
    SHIFTS.forEach(shift => {
      ZONES.forEach(zone => {
        const id = `${dateStr}-${shift}-${zone}`;
        board[id] = { id, date: dateStr, shift, zone, staffIds: [] };
      });
    });
  });
  
  return board;
};
