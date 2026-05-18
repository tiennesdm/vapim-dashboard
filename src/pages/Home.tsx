import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  Plus,
  UploadCloud,
  Search,
  X,
  List,
  LayoutGrid,
  Star,
  Users,
  MoreHorizontal,
  Trash2,
  Pencil,
  Code2,
  ExternalLink,
} from 'lucide-react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { mockAPIs, formatRelativeTime } from '@/lib/data';
import type { API } from '@/lib/data';
import { cn } from '@/lib/utils';

type ViewMode = 'table' | 'grid';
type SortOption = 'name-asc' | 'name-desc' | 'created-new' | 'created-old' | 'updated-new';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('updated-new');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allStatusOptions = ['CREATED', 'PUBLISHED', 'DEPRECATED', 'RETIRED', 'BLOCKED'];
  const allTypeOptions = ['REST', 'GRAPHQL', 'WEBSOCKET', 'WEBHOOK', 'GRPC', 'SOAP'];

  const filteredAPIs = useMemo(() => {
    let result = [...mockAPIs];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (api) =>
          api.name.toLowerCase().includes(q) ||
          api.context.toLowerCase().includes(q) ||
          api.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((api) => api.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((api) => api.type === typeFilter);
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'created-new':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'created-old':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'updated-new':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return result;
  }, [searchQuery, statusFilter, typeFilter, sortBy]);

  const hasActiveFilters = searchQuery || statusFilter || typeFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAPIs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAPIs.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const typeBadgeColors: Record<string, string> = {
    REST: '#3B82F6',
    GRAPHQL: '#8B5CF6',
    WEBSOCKET: '#10B981',
    WEBHOOK: '#F59E0B',
    GRPC: '#EC4899',
    SOAP: '#6B7280',
  };

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        title="APIs"
        description="Manage and publish your API products"
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-9 px-4 border border-[#3D434F] rounded-md text-[13px] font-medium text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50] transition-colors">
              <UploadCloud className="w-4 h-4" />
              Import OpenAPI
            </button>
            <Link
              to="/publisher/apis/create"
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#4488FF] rounded-md text-[13px] font-medium text-white hover:bg-[#5A9AFF] active:bg-[#3366CC] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create API
            </Link>
          </>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-4 border-b border-[#3D434F50]">
        {/* Search */}
        <div className="relative w-full sm:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search by name, context, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-[#181A20] border border-[#3D434F] rounded-md text-[14px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E8ECF1]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
        >
          <option value="">All Status</option>
          {allStatusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
        >
          <option value="">All Types</option>
          {allTypeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="h-9 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="created-new">Created (newest)</option>
          <option value="created-old">Created (oldest)</option>
          <option value="updated-new">Last Updated</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center border border-[#3D434F] rounded-md overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'h-9 px-3 flex items-center justify-center transition-colors',
              viewMode === 'table' ? 'bg-[#1E3A5F] text-[#4488FF]' : 'text-[#9DA5B4] hover:bg-[#353942]'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'h-9 px-3 flex items-center justify-center transition-colors',
              viewMode === 'grid' ? 'bg-[#1E3A5F] text-[#4488FF]' : 'text-[#9DA5B4] hover:bg-[#353942]'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[13px] text-[#4488FF] hover:text-[#5A9AFF] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 mt-4 px-4 py-2 bg-[#1E3A5F] border border-[#4488FF40] rounded-md animate-fade-in-up">
          <span className="text-[13px] font-medium text-[#4488FF]">{selectedIds.length} selected</span>
          <div className="h-4 w-px bg-[#4488FF40]" />
          <select className="h-7 px-2 bg-[#181A20] border border-[#3D434F] rounded text-[12px] text-[#E8ECF1] focus:outline-none">
            <option>Change Status</option>
            <option>Publish</option>
            <option>Deprecate</option>
            <option>Retire</option>
            <option>Block</option>
          </select>
          <button className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#EF4444] rounded text-[12px] font-medium text-white hover:bg-[#DC2626] transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          <button className="ml-auto text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors" onClick={() => setSelectedIds([])}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="mt-4">
        {filteredAPIs.length === 0 ? (
          <EmptyState
            icon="package"
            title="No APIs found"
            description="Get started by creating your first API or importing an OpenAPI specification."
            action={
              <Link
                to="/publisher/apis/create"
                className="inline-flex items-center gap-2 h-9 px-4 bg-[#4488FF] rounded-md text-[13px] font-medium text-white hover:bg-[#5A9AFF] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create API
              </Link>
            }
          />
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-x-auto rounded-lg border border-[#3D434F50]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1E2128]">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredAPIs.length && filteredAPIs.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
                    />
                  </th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em]">API Name</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-24">Type</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-28">Status</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-28">Visibility</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-28 hidden lg:table-cell">Rating</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-28 hidden md:table-cell">Subscribers</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-36 hidden sm:table-cell">Last Updated</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAPIs.map((api, idx) => (
                  <TableRow
                    key={api.id}
                    api={api}
                    idx={idx}
                    isSelected={selectedIds.includes(api.id)}
                    onSelect={() => toggleSelect(api.id)}
                    typeBadgeColors={typeBadgeColors}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAPIs.map((api) => (
              <APICard key={api.id} api={api} typeBadgeColors={typeBadgeColors} />
            ))}
          </div>
        )}

        {/* Footer */}
        {filteredAPIs.length > 0 && (
          <div className="flex items-center justify-between mt-4 pb-4">
            <p className="text-[13px] text-[#9DA5B4]">
              Showing {filteredAPIs.length} of {mockAPIs.length} APIs
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ===== Sub-components =====

function TableRow({
  api,
  idx,
  isSelected,
  onSelect,
  typeBadgeColors,
}: {
  api: API;
  idx: number;
  isSelected: boolean;
  onSelect: () => void;
  typeBadgeColors: Record<string, string>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr
      className={cn(
        'h-16 transition-colors border-b border-[#3D434F50]',
        idx % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]',
        'hover:bg-[#353942] cursor-pointer'
      )}
    >
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
        />
      </td>
      <td className="px-4 py-3">
        <Link to={`/publisher/apis/${api.id}`} className="block">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#E8ECF1]">{api.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#4488FF20] text-[#4488FF] rounded font-medium">{api.version}</span>
          </div>
          <span className="text-[12px] text-[#6B7280] font-mono">{api.context}</span>
        </Link>
      </td>
      <td className="px-4 py-3">
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded"
          style={{
            color: typeBadgeColors[api.type] || '#6B7280',
            backgroundColor: `${typeBadgeColors[api.type]}20` || '#6B728020',
          }}
        >
          {api.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={api.status} />
      </td>
      <td className="px-4 py-3">
        <VisibilityBadge visibility={api.visibility} />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1">
          {api.rating > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-[13px] text-[#E8ECF1]">{api.rating}</span>
            </>
          ) : (
            <span className="text-[13px] text-[#6B7280]">-</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1">
          <span className="text-[13px] text-[#E8ECF1]">{api.subscribers}</span>
          <Users className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-[#9DA5B4] hidden sm:table-cell">
        {formatRelativeTime(api.updatedAt)}
      </td>
      <td className="px-4 py-3 relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-10 w-44 bg-[#2E333D] border border-[#3D434F] rounded-lg shadow-lg z-20 py-1">
              <Link
                to={`/publisher/apis/${api.id}`}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#E8ECF1] hover:bg-[#353942] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Link>
              <Link
                to={`/publisher/apis/${api.id}/design`}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#E8ECF1] hover:bg-[#353942] transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" /> Design
              </Link>
              <Link
                to={`/devportal/apis/${api.id}`}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#E8ECF1] hover:bg-[#353942] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View in Portal
              </Link>
              <div className="border-t border-[#3D434F] my-1" />
              <button className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#EF4444] hover:bg-[#353942] transition-colors w-full">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

function APICard({
  api,
  typeBadgeColors,
}: {
  api: API;
  typeBadgeColors: Record<string, string>;
}) {
  return (
    <Link
      to={`/publisher/apis/${api.id}`}
      className="block bg-[#2B2F38] border border-[#3D434F] rounded-lg p-4 hover:border-[#4488FF40] hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded"
          style={{
            color: typeBadgeColors[api.type] || '#6B7280',
            backgroundColor: `${typeBadgeColors[api.type]}20` || '#6B728020',
          }}
        >
          {api.type}
        </span>
        <StatusBadge status={api.status} />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1]">{api.name}</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-[#4488FF20] text-[#4488FF] rounded font-medium">{api.version}</span>
      </div>
      <p className="text-[12px] text-[#6B7280] font-mono mb-2">{api.context}</p>
      <p className="text-[13px] text-[#9DA5B4] line-clamp-2 mb-3">{api.description}</p>

      {/* Tags */}
      {api.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {api.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[12px] px-2 py-0.5 rounded bg-[#3D434F40] text-[#9DA5B4]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#3D434F50]">
        <div className="flex items-center gap-1">
          {api.rating > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-[12px] text-[#E8ECF1]">{api.rating}</span>
            </>
          ) : (
            <span className="text-[12px] text-[#6B7280]">No rating</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[#6B7280]">
          <Users className="w-3.5 h-3.5" />
          <span className="text-[12px]">{api.subscribers}</span>
        </div>
      </div>
    </Link>
  );
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const colors: Record<string, { color: string; bg: string }> = {
    PUBLIC: { color: '#10B981', bg: '#10B98120' },
    PRIVATE: { color: '#6B7280', bg: '#6B728020' },
    RESTRICTED: { color: '#F59E0B', bg: '#F59E0B20' },
  };
  const config = colors[visibility] || colors.PRIVATE;

  return (
    <span
      className="text-[11px] font-semibold px-2 py-1 rounded"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {visibility}
    </span>
  );
}
