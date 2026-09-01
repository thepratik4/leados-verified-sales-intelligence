'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Plus, Check, Folder } from 'lucide-react';
import { LeadCohortList } from '@/lib/types';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: LeadCohortList[];
  selectedCompanyIds: string[];
  onConfirmAdd: (listId: string, companyIds: string[]) => void;
  onCreateAndAdd: (newListName: string, companyIds: string[]) => void;
}

export default function AddToListModal({
  isOpen,
  onClose,
  lists,
  selectedCompanyIds,
  onConfirmAdd,
  onCreateAndAdd,
}: AddToListModalProps) {
  const [selectedListId, setSelectedListId] = useState<string>(lists[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingNew) {
      if (newListName.trim()) {
        onCreateAndAdd(newListName.trim(), selectedCompanyIds);
        onClose();
      }
    } else {
      if (selectedListId) {
        onConfirmAdd(selectedListId, selectedCompanyIds);
        onClose();
      }
    }
  };

  return (
    <div
      id="add-to-list-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="add-to-list-modal-card"
        className="w-full max-w-md bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#005138] text-white flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-[#A4F3CC]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1a1c1b]">Add to Cohort List</h3>
              <p className="text-[11px] text-[#8A8F98]">
                Adding <span className="font-semibold text-[#1a1c1b]">{selectedCompanyIds.length}</span>{' '}
                lead{selectedCompanyIds.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8A8F98] hover:text-[#1a1c1b]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isCreatingNew ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#1a1c1b]">Choose existing list</label>
              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                {lists.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedListId(l.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedListId === l.id
                        ? 'bg-[#A4F3CC]/20 border-[#005138] text-[#005138]'
                        : 'bg-[#F9F9F7] border-[#E5E5E1] text-[#1a1c1b] hover:bg-[#F4F4F2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-[#005138]" />
                      <div>
                        <p className="text-xs font-bold">{l.name}</p>
                        <p className="text-[10px] text-[#8A8F98]">{l.leadCount} leads</p>
                      </div>
                    </div>
                    {selectedListId === l.id && <Check className="w-4 h-4 text-[#005138]" />}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className="w-full py-2 text-xs font-bold text-[#005138] hover:underline flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create a new list instead</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#1a1c1b]">New List Name</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Q4 Tier-1 Targets"
                autoFocus
                className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#005138] rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-[#8A8F98] hover:underline"
              >
                ← Back to existing lists
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#E5E5E1] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E1] text-xs font-semibold text-[#3F4943] hover:bg-[#F4F4F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs"
            >
              {isCreatingNew ? 'Create & Add' : 'Add to List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
