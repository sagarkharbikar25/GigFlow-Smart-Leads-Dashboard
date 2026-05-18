import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, createLead, updateLead, deleteLead, exportLeadsCSV } from '../api/leads';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { ILead } from '../types';

// Subcomponents import
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import LeadsTable from '../components/LeadsTable';
import LeadModal from '../components/LeadModal';
import LeadDetailsModal from '../components/LeadDetailsModal';

import { Plus, ChevronLeft, ChevronRight, AlertOctagon, Inbox, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // ==========================================
  // 🎛️ Filter & Pagination States (URL Params)
  // ==========================================
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const source = searchParams.get('source') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    }, { replace: true });
  };

  const setSearch = (val: string) => updateFilter('search', val);
  const setStatus = (val: string) => updateFilter('status', val);
  const setSource = (val: string) => updateFilter('source', val);
  const setSort = (val: string) => updateFilter('sort', val);
  const setPage = (val: number | ((p: number) => number)) => {
    setSearchParams((prev) => {
      const newPage = typeof val === 'function' ? val(page) : val;
      prev.set('page', newPage.toString());
      return prev;
    }, { replace: true });
  };

  // Debounce search state (updates 400ms after user stops typing)
  const debouncedSearch = useDebounce(search, 400);

  // ==========================================
  // 🔲 Dialog & Modal States
  // ==========================================
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<ILead | null>(null);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeDetailsLead, setActiveDetailsLead] = useState<ILead | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  // ==========================================
  // 🔌 TanStack Query Hook (Data Fetcher)
  // ==========================================
  const {
    data: responseEnvelope,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['leads', debouncedSearch, status, source, sort, page],
    queryFn: () => getLeads({
      search: debouncedSearch,
      status,
      source,
      sort,
      page,
      limit: 10,
    }),
  });

  // Extract variables safely from standard response envelope
  const leads = (responseEnvelope?.data as any)?.leads || [];
  const metadata = responseEnvelope?.metadata;
  
  const stats = (responseEnvelope?.data as any)?.stats || {
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
    total: 0,
  };

  // ==========================================
  // ⚡ Mutation Hooks (CRUD triggers)
  // ==========================================

  // Mutation: Create or Edit Lead Record
  const leadMutation = useMutation({
    mutationFn: async (values: any) => {
      if (activeLead) {
        return await updateLead(activeLead._id, values);
      } else {
        return await createLead(values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModalOpen(false);
    },
  });

  // Mutation: Delete Lead Record (Admin Only)
  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      await deleteLead(leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  // ==========================================
  // 🧮 Interactive Action Handlers
  // ==========================================

  // Triggers Lead Form in Create Mode
  const handleAddLeadClick = () => {
    setActiveLead(null);
    setModalOpen(true);
  };

  // Triggers Lead Form in Edit Mode
  const handleEditClick = (lead: ILead) => {
    setActiveLead(lead);
    setModalOpen(true);
  };

  // Triggers Lead Detail Inspector Modal
  const handleViewDetailsClick = (lead: ILead) => {
    setActiveDetailsLead(lead);
    setDetailsModalOpen(true);
  };

  // Triggers Delete Action (with alert warning)
  const handleDeleteClick = async (lead: ILead) => {
    if (window.confirm(`Are you absolutely sure you want to delete lead: "${lead.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(lead._id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete lead.');
      }
    }
  };

  // Reset Filters to Baseline
  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setSource('');
    setSort('latest');
    setPage(1);
  };

  // Modal Submit (Form Callback)
  const handleModalSubmit = async (values: any) => {
    await leadMutation.mutateAsync(values);
  };

  // CSV Export Stream Callback
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await exportLeadsCSV({
        search: debouncedSearch,
        status,
        source,
        sort,
      });
    } catch (err: any) {
      alert('Failed to download CSV leads stream.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Dashboard Headline & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Leads Pipeline
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Monitor acquisition channels, filter conversions, and manage sales territories.
          </p>
        </div>

        {/* Add Lead Trigger button */}
        <button
          onClick={handleAddLeadClick}
          className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-2xl transition-all shadow-glow-primary/20 space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Metrics Panel Grid */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Filter toolbar */}
      <FilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        status={status}
        setStatus={(val) => { setStatus(val); setPage(1); }}
        source={source}
        setSource={(val) => { setSource(val); setPage(1); }}
        sort={sort}
        setSort={(val) => { setSort(val); setPage(1); }}
        onClearFilters={handleClearFilters}
        onExportCSV={handleExportCSV}
        isExporting={isExporting}
      />

      {/* ==========================================
         📉 Main Database Table / Viewport Rendering
         ========================================== */}
      {isError ? (
        /* Error Recovery State Card */
        <div className="glass-panel rounded-3xl p-8 text-center max-w-xl mx-auto shadow-premium border-brand-danger/30">
          <div className="inline-flex p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-2xl text-brand-danger mb-4 shadow-glow-secondary">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Failed to Sync Leads Pipeline</h3>
          <p className="text-brand-muted text-sm mb-6">
            {error?.message || 'An unexpected connection error occurred between the server and database.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-brand-border hover:bg-brand-border/80 border border-brand-border text-white font-semibold rounded-xl transition-all inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : !isLoading && leads.length === 0 ? (
        /* Dynamic Empty Search/Filter State Panel */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto shadow-premium">
          <div className="inline-flex p-4 bg-brand-border/40 border border-brand-border rounded-2xl text-brand-muted mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Leads Match Your Filters</h3>
          <p className="text-brand-muted text-sm mb-6">
            We couldn't find any matching records. Try typing another search or resetting your Status/Source filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 text-brand-primary font-semibold rounded-xl transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Dynamic Grid & Pagination layout */
        <div className="glass-panel rounded-3xl shadow-premium relative overflow-hidden">
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            currentUser={currentUser}
            onViewDetails={handleViewDetailsClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          {/* Table Footer: Pagination controls */}
          {metadata && metadata.totalPages > 0 && (
            <div className="h-16 border-t border-brand-border/50 px-6 flex items-center justify-between bg-brand-surface/20 flex-wrap gap-2">
              <span className="text-xs md:text-sm text-brand-muted font-medium">
                Showing page <strong className="text-white">{metadata.page}</strong> of{' '}
                <strong className="text-white">{metadata.totalPages}</strong> (
                <strong className="text-white">{metadata.totalRecords}</strong> total records)
              </span>

              <div className="inline-flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!metadata.hasPrevPage || isLoading}
                  className="p-1.5 bg-brand-border/50 hover:bg-brand-border border border-brand-border text-white rounded-lg transition-all disabled:opacity-40 disabled:pointer-events-none"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, metadata.totalPages))}
                  disabled={!metadata.hasNextPage || isLoading}
                  className="p-1.5 bg-brand-border/50 hover:bg-brand-border border border-brand-border text-white rounded-lg transition-all disabled:opacity-40 disabled:pointer-events-none"
                  title="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
         🔲 Dialog Modal Injection Portals
         ========================================== */}

      {/* Add / Edit Lead Form Modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={activeLead}
        onSubmit={handleModalSubmit}
      />

      {/* View Lead Details Inspection Modal */}
      <LeadDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setActiveDetailsLead(null);
        }}
        lead={activeDetailsLead}
      />
    </div>
  );
};

export default Dashboard;
