import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { mockAPIs } from '@/lib/data';
import type { API } from '@/lib/data';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Star,
  Users,
  Layers,
  LayoutGrid,
  List,
  ArrowRight,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const categories = [
  { label: 'All APIs', icon: <LayoutGrid className="w-4 h-4" /> },
  { label: 'Financial Services', icon: <Star className="w-4 h-4" /> },
  { label: 'Identity', icon: <Users className="w-4 h-4" /> },
  { label: 'Retail', icon: <Layers className="w-4 h-4" /> },
  { label: 'Communications', icon: <Layers className="w-4 h-4" /> },
  { label: 'Logistics', icon: <Layers className="w-4 h-4" /> },
  { label: 'Media', icon: <Layers className="w-4 h-4" /> },
];

const typeOptions = ['REST', 'GRAPHQL', 'WEBSOCKET', 'WEBHOOK', 'GRPC', 'SOAP'];
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Name A-Z'];
const ratingOptions = ['Any', '4+', '3+', '2+'];

const categoryColorMap: Record<string, string> = {
  'Financial Services': '#3B82F6',
  'Identity': '#8B5CF6',
  'Retail': '#10B981',
  'Communications': '#F59E0B',
  'Logistics': '#14B8A6',
  'Media': '#EC4899',
  'Data & Analytics': '#6366F1',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function useQueryState() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Most Popular');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState('Any');
  const [activeCategory, setActiveCategory] = useState('All APIs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isFiltered =
    query !== '' ||
    selectedTypes.length > 0 ||
    minRating !== 'Any' ||
    activeCategory !== 'All APIs';

  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedTypes([]);
    setMinRating('Any');
    setActiveCategory('All APIs');
  }, []);

  return {
    query,
    setQuery,
    sort,
    setSort,
    selectedTypes,
    setSelectedTypes,
    minRating,
    setMinRating,
    activeCategory,
    setActiveCategory,
    viewMode,
    setViewMode,
    isFiltered,
    clearFilters,
  };
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const fill = i < fullStars ? 1 : i === fullStars ? partial : 0;
    stars.push(
      <div key={i} className="relative inline-block">
        <Star
          size={size}
          className="text-[#3D434F]"
          fill="#3D434F"
          strokeWidth={0}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <Star
            size={size}
            className="text-[#F59E0B]"
            fill="#F59E0B"
            strokeWidth={0}
          />
        </div>
      </div>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/* ------------------------------------------------------------------ */
/*  Card Component                                                    */
/* ------------------------------------------------------------------ */

function APICard({ api, index }: { api: API; index: number }) {
  const categoryColor =
    categoryColorMap[api.categories[0]] || '#4488FF';
  const visibleTags = api.tags.slice(0, 3);
  const hiddenTagCount = api.tags.length - 3;

  return (
    <Link
      to={`/devportal/apis/${api.id}`}
      className={cn(
        'group block bg-[#2B2F38] border border-[#3D434F] rounded-[10px] overflow-hidden',
        'transition-all duration-250 hover:border-[#10B98140] hover:-translate-y-[3px]',
        'hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Category strip */}
      <div className="h-1 w-full" style={{ backgroundColor: categoryColor }} />

      <div className="p-4">
        {/* Top row: Type badge + Star rating */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className="text-[11px] font-semibold bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F]"
          >
            {api.type}
          </Badge>
          <div className="flex items-center gap-1.5">
            <StarRating rating={api.rating} size={14} />
            <span className="text-[12px] text-[#9DA5B4]">
              ({api.subscribers})
            </span>
          </div>
        </div>

        {/* API name */}
        <h3 className="text-[16px] font-bold text-[#E8ECF1] truncate mb-1">
          {api.name}
        </h3>

        {/* Version */}
        <Badge
          variant="outline"
          className="text-[11px] bg-[#4488FF20] text-[#4488FF] border-[#4488FF40] mb-1 mr-2"
        >
          {api.version}
        </Badge>

        {/* Provider */}
        <span className="text-[12px] text-[#6B7280]">
          by {api.provider}
        </span>

        {/* Description */}
        <p className="text-[13px] text-[#9DA5B4] line-clamp-2 mt-2 min-h-[2.6em]">
          {api.description}
        </p>

        {/* Tags row */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-[#9DA5B4] bg-[#3D434F40] px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className="text-[11px] text-[#6B7280] bg-[#3D434F40] px-2 py-0.5 rounded">
                +{hiddenTagCount}
              </span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#3D434F50]">
          <div className="flex items-center gap-1.5 text-[13px] text-[#9DA5B4]">
            <Users size={14} />
            <span>{api.subscribers}</span>
          </div>
          <span className="text-[13px] text-[#10B981] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Details
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  List View Row                                                     */
/* ------------------------------------------------------------------ */

function APIListRow({ api }: { api: API }) {
  return (
    <Link
      to={`/devportal/apis/${api.id}`}
      className="flex items-center gap-4 px-4 py-3 border-b border-[#3D434F50] hover:bg-[#353942] transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#E8ECF1] truncate">
            {api.name}
          </span>
          <Badge
            variant="outline"
            className="text-[11px] bg-[#4488FF20] text-[#4488FF] border-[#4488FF40]"
          >
            {api.version}
          </Badge>
        </div>
      </div>
      <Badge
        variant="outline"
        className="text-[11px] bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F] w-20 justify-center"
      >
        {api.type}
      </Badge>
      <span className="text-[13px] text-[#9DA5B4] w-32 truncate">
        {api.categories[0] || 'General'}
      </span>
      <div className="w-24">
        <StarRating rating={api.rating} size={12} />
      </div>
      <span className="text-[13px] text-[#9DA5B4] w-20 text-right">
        {api.subscribers}
      </span>
      <span className="text-[13px] text-[#4488FF] flex items-center gap-1">
        View Details
        <ArrowRight size={12} />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function Catalog() {
  const filters = useQueryState();

  /* ---- derived data ---- */
  const publicAPIs = useMemo(
    () => mockAPIs.filter((a) => a.visibility === 'PUBLIC'),
    []
  );

  const filtered = useMemo(() => {
    let result = [...publicAPIs];

    // Category
    if (filters.activeCategory !== 'All APIs') {
      result = result.filter((a) =>
        a.categories.includes(filters.activeCategory)
      );
    }

    // Search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (filters.selectedTypes.length > 0) {
      result = result.filter((a) =>
        filters.selectedTypes.includes(a.type)
      );
    }

    // Rating filter
    if (filters.minRating !== 'Any') {
      const min = parseInt(filters.minRating);
      result = result.filter((a) => a.rating >= min);
    }

    // Sort
    switch (filters.sort) {
      case 'Most Popular':
        result.sort((a, b) => b.subscribers - a.subscribers);
        break;
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
      case 'Name A-Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [
    publicAPIs,
    filters.activeCategory,
    filters.query,
    filters.selectedTypes,
    filters.minRating,
    filters.sort,
  ]);

  /* ---- category counts ---- */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All APIs': publicAPIs.length };
    categories.slice(1).forEach((cat) => {
      counts[cat.label] = publicAPIs.filter((a) =>
        a.categories.includes(cat.label)
      ).length;
    });
    return counts;
  }, [publicAPIs]);

  /* ---- stats ---- */
  const stats = useMemo(() => {
    const totalAPIs = publicAPIs.length;
    const totalSubs = publicAPIs.reduce((s, a) => s + a.subscribers, 0);
    const avgRating =
      totalAPIs > 0
        ? (
            publicAPIs.reduce((s, a) => s + a.rating, 0) / totalAPIs
          ).toFixed(1)
        : '0';
    return { totalAPIs, totalSubs, avgRating };
  }, [publicAPIs]);

  /* ---- toggle type filter ---- */
  const toggleType = (type: string) => {
    filters.setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Layout>
      {/* ========== Hero Banner ========== */}
      <div className="relative mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--bg-main)' }}>
        <div
          className="absolute inset-0"
          style={{ background: 'var(--brand-mesh)' }}
        />
        <div className="relative px-6 py-8 min-h-[160px] flex flex-col justify-center">
          <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight mb-2">
            Discover & Subscribe to APIs
          </h1>
          <p className="text-[14px] text-[#9DA5B4] max-w-[600px] mb-4">
            Explore our collection of production-ready APIs. Subscribe and
            start building in minutes.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#E8ECF1]">
              <Layers size={16} className="text-[#10B981]" />
              <span>{stats.totalAPIs} APIs</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#E8ECF1]">
              <Users size={16} className="text-[#3B82F6]" />
              <span>{stats.totalSubs.toLocaleString()} Subscribers</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#E8ECF1]">
              <Star size={16} className="text-[#F59E0B]" />
              <span>{stats.avgRating} avg rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Filter Bar ========== */}
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-[#3D434F50]">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search APIs by name, tags, or category..."
            value={filters.query}
            onChange={(e) => filters.setQuery(e.target.value)}
            className="pl-9 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30]"
          />
        </div>

        {/* Sort */}
        <Select value={filters.sort} onValueChange={filters.setSort}>
          <SelectTrigger className="w-[160px] h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
            {sortOptions.map((o) => (
              <SelectItem key={o} value={o} className="text-[13px]">
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type filter chips */}
        <div className="flex items-center gap-1.5">
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all',
                filters.selectedTypes.includes(type)
                  ? 'bg-[#10B98120] text-[#10B981] border-[#10B98140]'
                  : 'bg-[#181A20] text-[#9DA5B4] border-[#3D434F] hover:bg-[#353942]'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <Select value={filters.minRating} onValueChange={filters.setMinRating}>
          <SelectTrigger className="w-[120px] h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1]">
            <SelectValue placeholder="Min rating" />
          </SelectTrigger>
          <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
            {ratingOptions.map((o) => (
              <SelectItem key={o} value={o} className="text-[13px]">
                {o === 'Any' ? 'Any rating' : `${o} stars`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => filters.setViewMode('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              filters.viewMode === 'grid'
                ? 'bg-[#10B98120] text-[#10B981]'
                : 'text-[#6B7280] hover:bg-[#353942] hover:text-[#E8ECF1]'
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => filters.setViewMode('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              filters.viewMode === 'list'
                ? 'bg-[#10B98120] text-[#10B981]'
                : 'text-[#6B7280] hover:bg-[#353942] hover:text-[#E8ECF1]'
            )}
          >
            <List size={16} />
          </button>
        </div>

        {/* Clear all */}
        {filters.isFiltered && (
          <button
            onClick={filters.clearFilters}
            className="flex items-center gap-1 text-[12px] text-[#EF4444] hover:underline"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* ========== Category Tabs ========== */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const count = categoryCounts[cat.label] ?? 0;
          const isActive = filters.activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => filters.setActiveCategory(cat.label)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-medium whitespace-nowrap border transition-all',
                isActive
                  ? 'bg-[#10B98120] text-[#10B981] border-[#10B98140]'
                  : 'bg-transparent text-[#9DA5B4] border-transparent hover:bg-[#353942]'
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.5 rounded',
                  isActive
                    ? 'bg-[#10B98130] text-[#10B981]'
                    : 'bg-[#3D434F] text-[#9DA5B4]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========== Results Count ========== */}
      <div className="text-[13px] text-[#9DA5B4] mb-4">
        {filtered.length} API{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* ========== API Grid ========== */}
      {filters.viewMode === 'grid' ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          }}
        >
          {filtered.map((api, idx) => (
            <APICard key={api.id} api={api} index={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1E2128] rounded-lg border border-[#3D434F] overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-[#1A1D23] text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-wider border-b border-[#3D434F]">
            <span className="flex-1">Name</span>
            <span className="w-20 text-center">Type</span>
            <span className="w-32">Category</span>
            <span className="w-24">Rating</span>
            <span className="w-20 text-right">Subs</span>
            <span className="w-24">Actions</span>
          </div>
          {filtered.map((api) => (
            <APIListRow key={api.id} api={api} />
          ))}
        </div>
      )}

      {/* ========== Empty States ========== */}
      {filtered.length === 0 && filters.query && (
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="/empty-state-search.svg"
            alt="No results"
            className="w-[200px] h-[160px] mb-4 opacity-60"
          />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-1">
            No APIs match your search
          </h3>
          <p className="text-[13px] text-[#9DA5B4] mb-4">
            Try different keywords or clear filters
          </p>
          <button
            onClick={filters.clearFilters}
            className="text-[13px] text-[#4488FF] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {filtered.length === 0 && !filters.query && filters.isFiltered && (
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="/empty-state-apis.svg"
            alt="No APIs"
            className="w-[240px] h-[180px] mb-4 opacity-60"
          />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-1">
            No APIs in this category yet
          </h3>
          <p className="text-[13px] text-[#9DA5B4]">
            Check back soon for new APIs
          </p>
        </div>
      )}
    </Layout>
  );
}
