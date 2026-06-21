import type { Staff, StaffMap, BoardState, DayOfWeek, ShiftType, ZoneType } from './types';

export const mockStaffList: Staff[] = [
  { id: 's1', name: 'Dr. Somchai', role: 'Nephrologist', totalHours: 40 },
  { id: 's2', name: 'Dr. Ploy', role: 'Nephrologist', totalHours: 32 },
  { id: 's3', name: 'RN. Araya', role: 'InChargeRN', totalHours: 48 },
  { id: 's4', name: 'RN. Siriporn', role: 'InChargeRN', totalHours: 40 },
  { id: 's5', name: 'RN. Nattapong', role: 'RN', totalHours: 40 },
  { id: 's6', name: 'RN. Chanya', role: 'RN', totalHours: 36 },
  { id: 's7', name: 'RN. Kanya', role: 'RN', totalHours: 40 },
  { id: 's8', name: 'RN. Wut', role: 'RN', totalHours: 40 },
  { id: 's9', name: 'RN. Pim', role: 'RN', totalHours: 40 },
  { id: 's10', name: 'RN. Jirat', role: 'RN', totalHours: 32 },
  { id: 's11', name: 'PN. Somsri', role: 'PN_NA', totalHours: 48 },
  { id: 's12', name: 'PN. Mana', role: 'PN_NA', totalHours: 40 },
  { id: 's13', name: 'PN. Vipa', role: 'PN_NA', totalHours: 40 },
];

export const initialStaffMap: StaffMap = mockStaffList.reduce((acc, staff) => {
  acc[staff.id] = staff;
  return acc;
}, {} as StaffMap);

export const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const SHIFTS: ShiftType[] = ['Morning', 'Afternoon', 'Night', 'OnCall'];
export const ZONES: ZoneType[] = ['Zone A', 'Zone B', 'Isolation'];

export const generateEmptyBoard = (): BoardState => {
  const board: BoardState = {};
  DAYS.forEach(day => {
    SHIFTS.forEach(shift => {
      ZONES.forEach(zone => {
        const id = `${day}-${shift}-${zone}`;
        board[id] = { id, day, shift, zone, staffIds: [] };
      });
    });
  });
  return board;
};
