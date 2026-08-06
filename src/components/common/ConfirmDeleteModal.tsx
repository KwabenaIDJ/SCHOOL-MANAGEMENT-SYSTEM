import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'record'
}) => {
  const [confirmInput, setConfirmInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmInput('');
    }
  }, [isOpen]);

  const isConfirmed = confirmInput.trim().toLowerCase() === 'delete';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmed) {
      onConfirm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Confirmation`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-950/30">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-rose-950 dark:text-rose-200">
              Warning: Permanent Deletion
            </h4>
            <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
              Are you sure you want to permanently delete <strong className="font-extrabold text-rose-950 dark:text-white">"{itemName}"</strong>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            To prevent accidental deletion, type <span className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-rose-600 dark:bg-slate-800 dark:text-rose-400 font-black">delete</span> below to confirm:
          </label>
          <input
            type="text"
            autoFocus
            value={confirmInput}
            onChange={e => setConfirmInput(e.target.value)}
            placeholder="Type 'delete' to enable confirm button"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-2.5 font-mono text-xs font-bold text-slate-900 focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isConfirmed}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Permanently Delete
          </button>
        </div>
      </form>
    </Modal>
  );
};
