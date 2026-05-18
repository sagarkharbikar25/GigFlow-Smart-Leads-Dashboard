export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';

// Authorized User Interface
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// User Metadata inside Lead population
export interface ILeadCreator {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Lead Document Interface
export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: ILeadCreator;
  createdAt: string;
  updatedAt: string;
}

// Global Auth State
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Backend Pagination Metadata structure
export interface IPaginationMetadata {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Standard API response envelope
export interface IApiResponseEnvelope<T> {
  status: string;
  results?: number;
  metadata?: IPaginationMetadata;
  data: T;
}

// Paginated response shorthand (used by leads.ts service)
export interface PaginatedResponse<T> {
  status: string;
  results?: number;
  metadata?: IPaginationMetadata;
  data: {
    leads: T[];
    stats: {
      new: number;
      contacted: number;
      qualified: number;
      lost: number;
      total: number;
    };
  };
}

// Lead filter/query params interface
export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
