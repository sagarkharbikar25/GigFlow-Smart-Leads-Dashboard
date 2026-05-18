import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import * as leadService from '../services/lead.service';

/**
 * ➕ Create a new Lead
 */
export const createLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    const newLead = await leadService.createLead(req.body, req.user.id);

    res.status(201).json({
      status: 'success',
      data: {
        lead: newLead,
      },
    });
  }
);

/**
 * 🔍 Get Leads List (with Advanced Filters, Search, Sorting, and Pagination)
 */
export const getAllLeads = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const params = {
      status: req.query.status as string,
      source: req.query.source as string,
      search: req.query.search as string,
      sort: req.query.sort as string,
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
    };

    const result = await leadService.getLeads(params);

    res.status(200).json({
      status: 'success',
      results: result.leads.length,
      metadata: result.metadata,
      data: {
        leads: result.leads,
        stats: result.stats,
      },
    });
  }
);

/**
 * 🔍 Retrieve Single Lead Details
 */
export const getLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const lead = await leadService.getLeadById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        lead,
      },
    });
  }
);

/**
 * ✏️ Update Lead (RBAC Check in Service)
 */
export const updateLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    const updatedLead = await leadService.updateLead(req.params.id, req.body, req.user);

    res.status(200).json({
      status: 'success',
      data: {
        lead: updatedLead,
      },
    });
  }
);

/**
 * ❌ Delete Lead (RBAC Check in Service)
 */
export const deleteLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    await leadService.deleteLead(req.params.id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully.',
      data: null,
    });
  }
);
