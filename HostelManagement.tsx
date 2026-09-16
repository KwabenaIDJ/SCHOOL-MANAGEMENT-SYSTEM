import React, { useState } from 'react';
import { Home, Plus, Users, Bed, Building2 } from 'lucide-react';

interface HostelRoom {
  id: string;
  hostelName: string;
  roomNo: string;
  gender: 'Boys' | 'Girls';
  capacity: number;
  occupied: number;
  feePerTerm: number;
}

export const HostelManagement: React.FC = () => {
  const [rooms, setRooms] = useState<HostelRoom[]>([
    { id: 'rm-1', hostelName: 'Aggrey Boarding House', roomNo: 'Room A-101', gender: 'Boys', capacity: 8, occupied: 6, feePerTerm: 800 },
    { id: 'rm-2', hostelName: 'Aggrey Boarding House', roomNo: 'Room A-102', gender: 'Boys', capacity: 8, occupied: 8, feePerTerm: 800 },
    { id: 'rm-3', hostelName: 'Nkrumah Boarding House', roomNo: 'Room B-201', gender: 'Girls', capacity: 8, occupied: 5, feePerTerm: 850 }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHostelName, setNewHostelName] = useState('Aggrey Boarding House');
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newGender, setNewGender] = useState<'Boys' | 'Girls'>('Boys');
  const [newCapacity, setNewCapacity] = useState(8);
  const [newFee, setNewFee] = useState(800);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNo) return;
    const newRm: HostelRoom = {
      id: `rm-${Date.now()}`,
      hostelName: newHostelName,
      roomNo: newRoomNo,
      gender: newGender,
      capacity: Number(newCapacity),
      occupied: 0,
      feePerTerm: Number(newFee)
    };
    setRooms(prev => [newRm, ...prev]);
    setNewRoomNo('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-teal-900 border border-teal-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-teal-200">
              <Home className="h-3.5 w-3.5 text-teal-300" />
              Specialized Extension Module
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              Boarding House & Hostel Accommodation
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-teal-100">
              Manage boarding house dormitories, room bed allocations, and boarding fees.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hostel Room</span>
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map(rm => (
          <div key={rm.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-black text-teal-800 dark:text-teal-300 uppercase">{rm.hostelName}</span>
              <span className="rounded-md bg-teal-50 text-teal-900 px-2 py-0.5 text-[10px] font-black border border-teal-200 dark:bg-slate-800 dark:text-teal-300">
                GH₵ {rm.feePerTerm} / term
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white font-heading">{rm.roomNo}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                rm.gender === 'Boys' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {rm.gender} Dorm
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-slate-400" /> Occupancy:</span>
              <strong className="text-slate-900 dark:text-white">{rm.occupied} / {rm.capacity} Beds</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">Add Hostel Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Hostel Name</label>
                <input
                  type="text"
                  required
                  value={newHostelName}
                  onChange={e => setNewHostelName(e.target.value)}
                  placeholder="e.g. Aggrey Boarding House"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Room No / Title</label>
                <input
                  type="text"
                  required
                  value={newRoomNo}
                  onChange={e => setNewRoomNo(e.target.value)}
                  placeholder="e.g. Room A-103"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Fee (GH₵)</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={e => setNewFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
