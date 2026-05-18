import { api } from './index';
import { ILead, PaginatedResponse, LeadFilters } from '../types';

export const getLeads = async (filters: LeadFilters): Promise<PaginatedResponse<ILead>> => {
  const response = await api.get('/leads', { params: filters });
  return response.data;
};

export const createLead = async (data: any): Promise<ILead> => {
  const response = await api.post('/leads', data);
  return response.data.data.lead;
};

export const updateLead = async (id: string, data: any): Promise<ILead> => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data.data.lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsCSV = async (filters: LeadFilters): Promise<void> => {
  const response = await api.get('/leads/export', {
    params: filters,
    responseType: 'blob',
  });
  
  // Download the blob
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `gigflow_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
