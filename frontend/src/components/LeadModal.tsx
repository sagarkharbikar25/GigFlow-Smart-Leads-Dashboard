import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ILead } from '../types';
import { X, User, Mail, Link, AlertCircle } from 'lucide-react';

// Form validation schema using Zod
const leadFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Lead name is required')
    .min(2, 'Lead name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Lead email is required')
    .email('Please provide a valid lead email address'),
  source: z.enum(['website', 'instagram', 'referral'], {
    errorMap: () => ({ message: "Source must be 'website', 'instagram', or 'referral'" }),
  }),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface ILeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ILead | null; // If null = Create mode, else Edit mode
  onSubmit: (values: LeadFormValues) => Promise<void>;
}

export const LeadModal: React.FC<ILeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSubmit,
}) => {
  const isEditMode = !!lead;
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
  });

  // Reset/populate form values when modal opens or lead changes
  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      if (lead) {
        reset({
          name: lead.name,
          email: lead.email,
          source: lead.source,
          status: lead.status,
        });
      } else {
        reset({
          name: '',
          email: '',
          source: 'website',
          status: 'new',
        });
      }
    }
  }, [isOpen, lead, reset]);

  const handleFormSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await onSubmit(data);
      onClose();
    } catch (error: any) {
      setApiError(error.message || 'An error occurred. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card Panel */}
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-premium hover-glow z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? 'Modify Lead Details' : 'Create New Lead Record'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 bg-brand-dark/50 border border-brand-border rounded-xl text-brand-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local Error Callout */}
        {apiError && (
          <div className="mb-6 p-4 bg-brand-danger/10 border border-brand-danger/30 rounded-xl flex items-start space-x-3 text-brand-danger text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-muted mb-2">Lead Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input
                type="text"
                className={`w-full pl-12 pr-4 py-3 bg-brand-dark/50 border ${
                  errors.name ? 'border-brand-danger' : 'border-brand-border'
                } rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`}
                placeholder="E.g., David Miller"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-brand-danger font-semibold">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-muted mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input
                type="email"
                className={`w-full pl-12 pr-4 py-3 bg-brand-dark/50 border ${
                  errors.email ? 'border-brand-danger' : 'border-brand-border'
                } rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`}
                placeholder="E.g., david@company.com"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-brand-danger font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Source Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-muted mb-2">Acquisition Source</label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <select
                className="w-full pl-12 pr-4 py-3 bg-brand-dark/50 border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer transition-all"
                {...register('source')}
              >
                <option value="website" className="bg-brand-surface">Website Form</option>
                <option value="instagram" className="bg-brand-surface">Instagram DM</option>
                <option value="referral" className="bg-brand-surface">Word of Mouth / Referral</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Field (Only visible or editable in EDIT mode to prevent setting weird status during creation) */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-semibold text-brand-muted mb-2">Sales Stage Status</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-brand-dark/50 border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer transition-all"
                  {...register('status')}
                >
                  <option value="new" className="bg-brand-surface">🆕 New Lead</option>
                  <option value="contacted" className="bg-brand-surface">📞 In Contact</option>
                  <option value="qualified" className="bg-brand-surface">💎 Qualified</option>
                  <option value="lost" className="bg-brand-surface">❌ Lost</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex space-x-3 pt-4 border-t border-brand-border/60">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-brand-dark/50 hover:bg-brand-border/50 border border-brand-border text-white font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Create Lead'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
