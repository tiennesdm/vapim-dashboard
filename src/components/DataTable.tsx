import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmptyState from './EmptyState';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  searchable = false,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display.',
  emptyAction,
  rowClassName,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchable && searchQuery && searchKeys.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        })
      );
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchable, searchQuery, searchKeys, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const allSelectedOnPage = paginatedData.length > 0 && paginatedData.every((row) => selectedIds.includes(keyExtractor(row)));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    const pageIds = paginatedData.map((row) => keyExtractor(row));
    if (allSelectedOnPage) {
      onSelectionChange(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const newIds = [...new Set([...selectedIds, ...pageIds])];
      onSelectionChange(newIds);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        icon="package"
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Search bar */}
      {searchable && (
        <div className="mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 pl-9 pr-4 bg-[#181A20] border border-[#3D434F] rounded-md text-[14px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#3D434F50]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1E2128]">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em]',
                    col.sortable && 'cursor-pointer select-none hover:text-[#E8ECF1]',
                    col.width && col.width
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12">
                  <EmptyState
                    icon="search"
                    title="No results"
                    description="No items match your search criteria."
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowId = keyExtractor(row);
                const isSelected = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'h-12 transition-colors',
                      idx % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]',
                      onRowClick && 'cursor-pointer hover:bg-[#353942]',
                      isSelected && 'bg-[#1E3A5F]',
                      rowClassName
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-[13px] text-[#E8ECF1]">
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[13px] text-[#9DA5B4]">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3D434F] text-[#9DA5B4] hover:bg-[#353942] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-medium transition-colors',
                  page === currentPage
                    ? 'bg-[#4488FF] text-white'
                    : 'text-[#9DA5B4] hover:bg-[#353942]'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3D434F] text-[#9DA5B4] hover:bg-[#353942] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#9DA5B4]">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="h-8 px-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
