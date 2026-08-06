import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  actions?: (row: T) => React.ReactNode;
  title?: string;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFields,
  actions,
  title,
  exportFileName = 'export-data'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter(item => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some(field => {
          const val = item[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      }
      return Object.values(item).some(
        val => val !== undefined && val !== null && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchFields]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginated data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T, sortable?: boolean) => {
    if (!sortable || !key) return;
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = sortedData.map(row =>
      columns
        .map(c => {
          const val = c.accessorKey ? row[c.accessorKey] : '';
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Top Header bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {title && (
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 transition-colors"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.accessorKey, col.sortable)}
                  className={`px-4 py-3 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && col.accessorKey && (
                      <span className="text-gray-400">
                        {sortColumn === col.accessorKey ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 font-medium">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  No records found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row">
        <div>
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {sortedData.length}
          </span>{' '}
          entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
