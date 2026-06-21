export type Role = 'Nephrologist' | 'InChargeRN' | 'RN' | 'PN_NA';

export interface Staff {
  id: string;
  name: string;
  role: Role;
  totalHours: number;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'OnCall';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type ZoneType = 'Zone A' | 'Zone B' | 'Isolation';

export interface ShiftSlot {
  id: string; // e.g., 'Mon-Morning-Zone A'
  day: DayOfWeek;
  shift: ShiftType;
  zone: ZoneType;
  staffIds: string[];
}

export interface BoardState {
  [slotId: string]: ShiftSlot;
}

// Staff mapped by their IDs for quick lookup
export interface StaffMap {
  [id: string]: Staff;
}
