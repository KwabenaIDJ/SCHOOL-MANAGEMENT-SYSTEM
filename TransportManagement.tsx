import React, { useState } from 'react';
import { Bus, Plus, Search, MapPin, User, ShieldCheck } from 'lucide-react';

interface TransportRoute {
  id: string;
  routeName: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  farePerTerm: number;
}

export const TransportManagement: React.FC = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>([
    { id: 'tr-1', routeName: 'Route 1: East Legon - Madina - School', vehicleNo: 'GE-4892-22', driverName: 'Uncle Kwame', driverPhone: '024 411 2233', farePerTerm: 450 },
    { id: 'tr-2', routeName: 'Route 2: Spintex - Baatsona - School', vehicleNo: 'GT-9012-23', driverName: 'Uncle Kofi', driverPhone: '020 889 7766', farePerTerm: 500 },
    { id: 'tr-3', routeName: 'Route 3: Adenta - Dodowa Road - School', vehicleNo: 'GW-3410-21', driverName: 'Uncle Kweku', driverPhone: '055 334 1122', farePerTerm: 480 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newVehicleNo, setNewVehicleNo] = useState('');
  const [newDriverName, setNewDriverName] = useState('');
  const [newFare, setNewFare] = useState(450);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName) return;
    const newTr: TransportRoute = {
      id: `tr-${Date.now()}`,
      routeName: newRouteName,
      vehicleNo: newVehicleNo || 'GE-1000-24',
      driverName: newDriverName || 'Driver Staff',
      driverPhone: '055 835 8342',
      farePerTerm: Number(newFare)
    };
    setRoutes(prev => [newTr, ...prev]);
    setNewRouteName('');
    setIsAddModalOpen(false);
  };

  const filteredRoutes = routes.filter(r =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-indigo-900 border border-indigo-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-indigo-200">
              <Bus className="h-3.5 w-3.5 text-indigo-300" />
              Specialized Extension Module
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              School Bus Transport & Route Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100">
              Manage school bus fleets, driver assignments, pickup routes, and student transport fees.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Bus Route</span>
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRoutes.map(rt => (
          <div key={rt.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs">
                <Bus className="h-4 w-4" />
                <span>{rt.vehicleNo}</span>
              </div>
              <span className="rounded-md bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-black border border-emerald-200">
                GH₵ {rt.farePerTerm} / term
              </span>
            </div>

            <h4 className="text-sm font-black text-slate-900 dark:text-white font-heading">{rt.routeName}</h4>
            
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" /> Driver: <strong>{rt.driverName}</strong></p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> Phone: <strong>{rt.driverPhone}</strong></p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">Add Transport Route</h3>
            <form onSubmit={handleAddRoute} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Route Name & Stops</label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={e => setNewRouteName(e.target.value)}
                  placeholder="e.g. Route 4: Tema - Sakumono - School"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Vehicle Plate No</label>
                  <input
                    type="text"
                    value={newVehicleNo}
                    onChange={e => setNewVehicleNo(e.target.value)}
                    placeholder="GE-1234-23"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Fare (GH₵ / Term)</label>
                  <input
                    type="number"
                    value={newFare}
                    onChange={e => setNewFare(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={newDriverName}
                  onChange={e => setNewDriverName(e.target.value)}
                  placeholder="Uncle Kwame"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
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
                  className="rounded-xl bg-indigo-700 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-800"
                >
                  Add Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
