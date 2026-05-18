import React from 'react';
import { ILead, IUser } from '../types';
import { Eye, Edit2, Trash2, ShieldAlert, Lock, UserCheck } from 'lucide-react';

interface ILeadsTableProps {
  leads: ILead[];
  isLoading: boolean;
  currentUser: IUser | null;
  onViewDetails: (lead: ILead) => void;
  onEdit: (lead: ILead) => void;
  onDelete: (lead: ILead) => void;
}

export const LeadsTable: React.FC<ILeadsTableProps> = ({
  leads,
  isLoading,
  currentUser,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  
  // Format dates cleanly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Maps lead status to modern color classes
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary';
      case 'contacted':
        return 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning';
      case 'qualified':
        return 'bg-brand-success/10 border-brand-success/30 text-brand-success';
      case 'lost':
        return 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger';
      default:
        return 'bg-brand-border/40 border-brand-border text-brand-muted';
    }
  };

  // Maps lead source to user-friendly text
  const formatSource = (source: string) => {
    switch (source) {
      case 'website':
        return '🕸️ Website';
      case 'instagram':
        return '📸 Instagram';
      case 'referral':
        return '🤝 Referral';
      default:
        return source;
    }
  };

  // Loading skeleton rows
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border/60 text-brand-muted text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Lead</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Source</th>
              <th className="py-4 px-6">Created</th>
              <th className="py-4 px-6">Owner</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-brand-border/30 animate-pulse h-16">
                <td className="py-4 px-6">
                  <div className="h-4 bg-brand-border rounded w-40 mb-2"></div>
                  <div className="h-3 bg-brand-border rounded w-28"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-6 bg-brand-border rounded-full w-20"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-5 bg-brand-border rounded-lg w-24"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 bg-brand-border rounded w-20"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 bg-brand-border rounded w-24"></div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="inline-flex space-x-2 justify-end w-full">
                    <div className="w-8 h-8 rounded-lg bg-brand-border"></div>
                    <div className="w-8 h-8 rounded-lg bg-brand-border"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-brand-border/60 text-brand-muted text-xs font-semibold uppercase tracking-wider bg-brand-surface/40">
            <th className="py-4 px-6">Lead Details</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Source</th>
            <th className="py-4 px-6">Created Date</th>
            <th className="py-4 px-6">Territory Owner</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border/20">
          {leads.map((lead) => {
            // RBAC evaluation: Can user edit this lead?
            // Admins can edit anything; Sales users can only edit leads they created.
            const canEdit =
              currentUser?.role === 'admin' ||
              lead.createdBy?._id === currentUser?.id;

            return (
              <tr 
                key={lead._id} 
                className="hover:bg-brand-surface/20 transition-all text-sm duration-150"
              >
                {/* Lead Name & Email */}
                <td className="py-4 px-6">
                  <div className="font-semibold text-white truncate max-w-[180px]">{lead.name}</div>
                  <div className="text-xs text-brand-muted truncate max-w-[180px] mt-0.5">{lead.email}</div>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusBadgeClass(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>

                {/* Source Pill */}
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium text-brand-text bg-brand-border/40 border border-brand-border/60">
                    {formatSource(lead.source)}
                  </span>
                </td>

                {/* Created Date */}
                <td className="py-4 px-6 text-brand-muted font-medium">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Lead Creator */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2 text-brand-text">
                    <UserCheck className="w-3.5 h-3.5 text-brand-muted" />
                    <span className="truncate max-w-[120px] font-medium">
                      {lead.createdBy?.name || 'Unassigned'}
                    </span>
                  </div>
                </td>

                {/* Actions Block */}
                <td className="py-4 px-6 text-right">
                  <div className="inline-flex items-center space-x-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => onViewDetails(lead)}
                      className="p-1.5 bg-brand-border/30 hover:bg-brand-border/80 border border-brand-border text-brand-muted hover:text-white rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button (Conditionally Restricted based on ownership) */}
                    {canEdit ? (
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 bg-brand-primary/10 hover:bg-brand-primary/30 border border-brand-primary/30 text-brand-primary rounded-lg transition-all"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="p-1.5 bg-brand-dark/20 border border-brand-border text-brand-muted cursor-not-allowed rounded-lg opacity-40"
                        title="Locked: Created by another user"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Button (Visible ONLY to Admins) */}
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => onDelete(lead)}
                        className="p-1.5 bg-brand-danger/10 hover:bg-brand-danger/30 border border-brand-danger/30 text-brand-danger rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
