import React from 'react';
import { ILead } from '../types';
import { X, Calendar, Mail } from 'lucide-react';

interface ILeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ILead | null;
}

export const LeadDetailsModal: React.FC<ILeadDetailsModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  if (!isOpen || !lead) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'new': return '🆕';
      case 'contacted': return '📞';
      case 'qualified': return '💎';
      case 'lost': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal card */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 shadow-premium hover-glow z-10 animate-fade-in relative">
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-brand-dark/50 border border-brand-border rounded-xl text-brand-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 border-b border-brand-border/60 pb-3">
          Lead Record Details
        </h3>

        {/* Lead Profile Cards Details */}
        <div className="space-y-5">
          {/* Section: Core Info */}
          <div>
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-1">
              Lead Identity
            </span>
            <div className="flex items-center space-x-3 bg-brand-dark/40 border border-brand-border/50 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-white truncate">{lead.name}</p>
                <div className="flex items-center space-x-1 text-xs text-brand-muted mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Status & Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-dark/40 border border-brand-border/50 rounded-2xl p-4">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Sales Stage
              </span>
              <span className="text-sm font-bold text-white block mt-1">
                {getStatusEmoji(lead.status)} <span className="uppercase">{lead.status}</span>
              </span>
            </div>
            <div className="bg-brand-dark/40 border border-brand-border/50 rounded-2xl p-4">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Lead Source
              </span>
              <span className="text-sm font-bold text-white block mt-1 uppercase">
                {lead.source === 'website' ? '🕸️ Web Form' : lead.source === 'instagram' ? '📸 Instagram' : '🤝 Referral'}
              </span>
            </div>
          </div>

          {/* Section: Creation Dates */}
          <div className="bg-brand-dark/40 border border-brand-border/50 rounded-2xl p-4">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-2">
              Timeline Tracking
            </span>
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <Calendar className="w-4 h-4 text-brand-muted" />
              <span>Created: {formatDate(lead.createdAt)}</span>
            </div>
          </div>

          {/* Section: Owner */}
          <div className="bg-brand-dark/40 border border-brand-border/50 rounded-2xl p-4">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-2">
              Territory Operations
            </span>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary font-bold text-sm">
                {lead.createdBy?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{lead.createdBy?.name || 'System'}</p>
                <p className="text-xs text-brand-muted truncate">
                  Role: <span className="uppercase">{lead.createdBy?.role || 'Unassigned'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-brand-border/50 hover:bg-brand-border border border-brand-border text-white font-semibold rounded-xl transition-all"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
