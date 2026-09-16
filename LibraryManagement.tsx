import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Library, BookOpen, Plus, Search, CheckCircle2, UserCheck, CreditCard } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
}

export const LibraryManagement: React.FC = () => {
  const { students } = useSchoolData();

  const [books, setBooks] = useState<BookItem[]>([
    { id: 'bk-1', title: 'GES Integrated Science for JHS', author: 'Prof. K. Agyeman', category: 'Science', copies: 25, available: 18 },
    { id: 'bk-2', title: 'Cockcrow Literature in English', author: 'GES Publications', category: 'English', copies: 30, available: 22 },
    { id: 'bk-3', title: 'Core Mathematics for Basic Schools', author: 'Dr. E. Mensah', category: 'Mathematics', copies: 20, available: 12 },
    { id: 'bk-4', title: 'Our World Our People (OWOP) Primary 6', author: 'B. Appiah', category: 'Social Studies', copies: 15, available: 15 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Science');
  const [newCopies, setNewCopies] = useState(10);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newBk: BookItem = {
      id: `bk-${Date.now()}`,
      title: newTitle,
      author: newAuthor || 'Unknown Author',
      category: newCategory,
      copies: Number(newCopies),
      available: Number(newCopies)
    };
    setBooks(prev => [newBk, ...prev]);
    setNewTitle('');
    setNewAuthor('');
    setIsAddBookModalOpen(false);
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-blue-900 border border-blue-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-blue-200">
              <Library className="h-3.5 w-3.5 text-blue-300" />
              Specialized Extension Module
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              School Library Management & Book Catalog
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Manage school textbook inventory, issue books to students, and track library cards.
            </p>
          </div>

          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">{books.length}</div>
          <div className="text-xs font-bold text-slate-500">Total Book Titles</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 font-heading">
            {books.reduce((sum, b) => sum + b.copies, 0)}
          </div>
          <div className="text-xs font-bold text-slate-500">Total Copies Stocked</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
            {books.reduce((sum, b) => sum + b.available, 0)}
          </div>
          <div className="text-xs font-bold text-slate-500">Available Books</div>
        </div>
      </div>

      {/* Book Catalog Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Book Inventory List</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white py-1 pl-8 pr-3 text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Book Title</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredBooks.map(bk => (
              <tr key={bk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>{bk.title}</span>
                </td>
                <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300">{bk.author}</td>
                <td className="p-3.5">
                  <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-300">
                    {bk.category}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">{bk.copies}</td>
                <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{bk.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">Add New Library Book</h3>
            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Core Mathematics JHS 2"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Author</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="Author name"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="ICT">ICT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newCopies}
                    onChange={e => setNewCopies(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
