import React from 'react';
import { Search, Download, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { LeadStatus, LeadSource } from '../types';

interface IFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  source: string;
  setSource: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
  isExporting: boolean;
}

export const FilterBar: React.FC<IFilterBarProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  sort,
  setSort,
  onClearFilters,
  onExportCSV,
  isExporting,
}) => {
  const hasActiveFilters = !!(search || status || source || sort !== 'latest');

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 mb-6 shadow-premium hover-glow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Real-Time Debounced Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-2.5 bg-brand-dark/50 border border-brand-border rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
            placeholder="Search leads by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right Side: Filters, Sorting and CSV triggers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select: Status */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              className="w-full px-3 py-2.5 bg-brand-dark/50 border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-primary appearance-none cursor-pointer transition-all"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="new">🆕 New</option>
              <option value="contacted">📞 Contacted</option>
              <option value="qualified">💎 Qualified</option>
              <option value="lost">❌ Lost</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Select: Source */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              className="w-full px-3 py-2.5 bg-brand-dark/50 border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-primary appearance-none cursor-pointer transition-all"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="website">🕸️ Website</option>
              <option value="instagram">📸 Instagram</option>
              <option value="referral">🤝 Referral</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Select: Sort Order */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              className="w-full px-3 py-2.5 bg-brand-dark/50 border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-primary appearance-none cursor-pointer transition-all"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">⏳ Latest First</option>
              <option value="oldest">⌛ Oldest First</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Clear Filters Button (Shows conditionally) */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="p-2.5 bg-brand-border/40 hover:bg-brand-border/80 border border-brand-border text-brand-text rounded-xl transition-all flex items-center justify-center space-x-1.5 text-sm font-semibold"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Export to CSV Trigger */}
          <button
            onClick={onExportCSV}
            disabled={isExporting}
            className="px-4 py-2.5 bg-brand-success/15 hover:bg-brand-success/25 border border-brand-success/30 text-brand-success font-semibold rounded-xl transition-all text-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-brand-success border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
