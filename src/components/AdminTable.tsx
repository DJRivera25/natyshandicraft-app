import React from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function AdminTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error,
  emptyMessage = 'No data found.',
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mr-3" />
        <span className="text-gray-600 text-sm">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-red-600 font-semibold mb-2">Error</span>
        <span className="text-gray-600 text-sm">{error}</span>
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200/60 bg-white shadow">
      <table className="min-w-full divide-y divide-amber-100">
        <thead className="bg-amber-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`px-4 py-3 text-left text-xs font-semibold text-amber-900 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {data.map((row, i) => (
            <tr
              key={(row._id as string) || i}
              className="hover:bg-amber-50 transition-colors group"
            >
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className={`px-4 py-3 text-sm text-gray-800 whitespace-nowrap ${col.className || ''}`}
                >
                  {col.render
                    ? col.render(row)
                    : (row[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
