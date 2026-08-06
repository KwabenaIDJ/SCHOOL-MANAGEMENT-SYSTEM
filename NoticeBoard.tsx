import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Notice } from '../../types';
import { Plus, Pin, Search, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const NoticeBoard: React.FC = () => {
  const { notices, addNotice, deleteNotice } = useSchoolData();
  const { role, currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Academic' as Notice['category'],
    content: '',
    targetRoles: ['admin', 'teacher', 'parent', 'student'] as Notice['targetRoles']
  });

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    addNotice({
      title: newNotice.title,
      category: newNotice.category,
      date: new Date().toISOString().split('T')[0],
      content: newNotice.content,
      author: currentUser.name,
      targetRoles: newNotice.targetRoles,
      isPinned: false
    });

    setIsAddModalOpen(false);
    setNewNotice({ title: '', category: 'Academic', content: '', targetRoles: ['admin', 'teacher', 'parent'] });
  };

  const handleDeleteNotice = (id: string, title: string) => {
    if (window.confirm(`Delete announcement "${title}"?`)) {
      deleteNotice(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Notice Board & Announcements
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Official school news, exam timetables, event reminders, and academic updates.
          </p>
        </div>

        {(role === 'admin' || role === 'teacher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Post New Announcement
          </button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Urgent', 'Academic', 'Event', 'General'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search announcements..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Notice Feed Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`relative rounded-2xl border p-5 shadow-sm transition-all dark:bg-gray-900 ${
                notice.category === 'Urgent'
                  ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20'
                  : 'border-gray-200 bg-white dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      notice.category === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : notice.category === 'Academic'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : notice.category === 'Event'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{notice.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  {notice.isPinned && (
                    <span title="Pinned Announcement">
                      <Pin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </span>
                  )}
                  {(role === 'admin' || role === 'teacher') && (
                    <button
                      onClick={() => handleDeleteNotice(notice.id, notice.title)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
                {notice.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {notice.content}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span>Posted by: <strong className="text-gray-700 dark:text-gray-300">{notice.author}</strong></span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            No announcements posted matching criteria.
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Post New Announcement"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveNotice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. Parent-Teacher Mid-Term Conference"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={newNotice.category}
              onChange={e => setNewNotice({ ...newNotice, category: e.target.value as any })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Urgent">Urgent</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Announcement Message Content *
            </label>
            <textarea
              required
              rows={4}
              value={newNotice.content}
              onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Type announcement details here..."
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
