import React, { useState } from 'react';
import type { Staff, Role } from '../types';
import { X, Plus, Edit2, Save, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface StaffManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  onAddStaff: (staff: Omit<Staff, 'id'>) => void;
  onUpdateStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => void;
}

export const StaffManagerModal: React.FC<StaffManagerModalProps> = ({
  isOpen, onClose, staffList, onAddStaff, onUpdateStaff, onDeleteStaff
}) => {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Role>('RN');
  const [newDaysOff, setNewDaysOff] = useState<string[]>([]);
  const [newDateInput, setNewDateInput] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDaysOff, setEditDaysOff] = useState<string[]>([]);
  const [editDateInput, setEditDateInput] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddStaff({ name: newName, role: newRole, totalHours: 40, daysOff: newDaysOff });
    setNewName('');
    setNewDaysOff([]);
    setNewDateInput('');
  };

  const startEdit = (staff: Staff) => {
    setEditingId(staff.id);
    setEditName(staff.name);
    setEditDaysOff(staff.daysOff || []);
    setEditDateInput('');
  };

  const saveEdit = (staff: Staff) => {
    if (editName.trim()) {
      onUpdateStaff({ ...staff, name: editName, daysOff: editDaysOff });
    }
    setEditingId(null);
  };

  const addDate = (dateStr: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (dateStr && !current.includes(dateStr)) {
      setter([...current, dateStr].sort());
    }
  };

  const removeDate = (dateStr: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(current.filter(d => d !== dateStr));
  };

  const renderDateChip = (d: string, onRemove?: () => void) => {
    try {
      const formatted = format(parseISO(d), 'MMM d');
      return (
        <span key={d} className="bg-medical-blue/10 text-medical-blue text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 border border-medical-blue/20">
          {formatted}
          {onRemove && (
            <button onClick={onRemove} className="hover:text-red-500 rounded-full hover:bg-medical-blue/20 p-0.5">
              <X className="w-2 h-2" />
            </button>
          )}
        </span>
      );
    } catch {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-colors">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Manage Staff</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Dr. Smith" 
                className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="w-48">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Role</label>
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm"
              >
                <option value="Nephrologist">Nephrologist (แพทย์)</option>
                <option value="InChargeRN">In-charge RN (พยาบาลหัวหน้า)</option>
                <option value="RN">RN (พยาบาลไตเทียม)</option>
                <option value="PN_NA">PN/NA (ผู้ช่วยพยาบาล)</option>
              </select>
            </div>
            <div className="w-48">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Add Day Off</label>
              <div className="flex gap-1">
                <input 
                  type="date"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-2 text-sm"
                />
                <button 
                  onClick={() => { addDate(newDateInput, newDaysOff, setNewDaysOff); setNewDateInput(''); }}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 rounded border dark:border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button 
              onClick={handleAdd}
              className="bg-medical-teal hover:bg-teal-700 text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-medium h-[38px]"
            >
              <Plus className="w-4 h-4" /> Add Staff
            </button>
          </div>
          
          {newDaysOff.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-500 font-medium">Days Off:</span>
              <div className="flex gap-1 flex-wrap">
                {newDaysOff.map(d => renderDateChip(d, () => removeDate(d, newDaysOff, setNewDaysOff)))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 rounded-tl font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Days Off</th>
                <th className="p-3 rounded-tr text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => (
                <tr key={staff.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-3">
                    {editingId === staff.id ? (
                      <input 
                        autoFocus
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 w-full"
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(staff)}
                      />
                    ) : (
                      <span className="font-medium text-gray-800 dark:text-gray-200">{staff.name}</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{staff.role}</td>
                  <td className="p-3">
                    {editingId === staff.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <input 
                            type="date"
                            value={editDateInput}
                            onChange={(e) => setEditDateInput(e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                          />
                          <button 
                            onClick={() => { addDate(editDateInput, editDaysOff, setEditDaysOff); setEditDateInput(''); }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex gap-1 flex-wrap max-w-[200px]">
                          {editDaysOff.map(d => renderDateChip(d, () => removeDate(d, editDaysOff, setEditDaysOff)))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {(staff.daysOff || []).length > 0 
                          ? (staff.daysOff || []).map(d => renderDateChip(d))
                          : <span className="text-gray-400 italic text-xs">None</span>
                        }
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {editingId === staff.id ? (
                      <button onClick={() => saveEdit(staff)} className="text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded flex items-center gap-1 ml-auto text-xs font-medium">
                        <Save className="w-3 h-3" /> Save
                      </button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(staff)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteStaff(staff.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
