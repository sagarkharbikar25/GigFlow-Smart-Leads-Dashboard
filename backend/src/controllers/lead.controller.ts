import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

/**
 * ➕ Create a new Lead
 */
export const createLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, status, source } = req.body;
    
    // Safety check: req.user injected from protect middleware
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    const newLead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user.id, // Links lead to the active User
    });

    res.status(201).json({
      status: 'success',
      data: {
        lead: newLead,
      },
    });
  }
);

/**
 * 🔍 Get Leads List (with Advanced Filters, Debounced Search, Sorting, and Pagination)
 */
export const getAllLeads = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Dynamic MongoDB Query construction
    const queryObj: any = {};

    // Filter: By Status
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter: By Source
    if (req.query.source) {
      queryObj.source = req.query.source;
    }

    // Search: Match Name or Email (Case-Insensitive Regex)
    if (req.query.search) {
      const searchStr = req.query.search as string;
      queryObj.$or = [
        { name: { $regex: searchStr, $options: 'i' } },
        { email: { $regex: searchStr, $options: 'i' } },
      ];
    }

    // 2. Sorting Setup
    // Default: 'latest' (descending createdAt), optional: 'oldest' (ascending)
    let sortBy = '-createdAt';
    if (req.query.sort === 'oldest') {
      sortBy = 'createdAt';
    }

    // 3. Pagination Setup (Default Page: 1, Default Limit: 10)
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    // 4. Execute Queries in Parallel (Saves database transaction time!)
    const [leads, totalRecords, statsArray] = await Promise.all([
      Lead.find(queryObj)
        .populate('createdBy', 'name email role') // Join creator metadata
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(queryObj),
      // Aggregate stats across the entire collection for dashboard metrics
      Lead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Map raw MongoDB aggregation array to clean key-value dictionary
    const stats = {
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
      total: 0,
    };

    statsArray.forEach((item: { _id: string; count: number }) => {
      if (item._id in stats) {
        (stats as any)[item._id] = item.count;
      }
    });
    
    // Calculate grand total of all records in DB
    stats.total = stats.new + stats.contacted + stats.qualified + stats.lost;

    // 5. Build Pagination Metadata
    const totalPages = Math.ceil(totalRecords / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: 'success',
      results: leads.length,
      metadata: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      data: {
        leads,
        stats, // Inject global stats dictionary!
      },
    });
  }
);

/**
 * 🔍 Retrieve Single Lead Details
 */
export const getLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const leadId = req.params.id;

    // Validate MongoDB ObjectId format before hitting DB
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(new AppError('Invalid lead reference ID format.', 400));
    }

    const lead = await Lead.findById(leadId).populate('createdBy', 'name email role');
    if (!lead) {
      return next(new AppError('No lead found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lead,
      },
    });
  }
);

/**
 * ✏️ Update Lead (RBAC: Admin can edit any, Sales can edit ONLY their OWN leads)
 */
export const updateLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const leadId = req.params.id;
    
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(new AppError('Invalid lead reference ID format.', 400));
    }

    // 2. Retrieve Lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return next(new AppError('No lead found with that ID.', 404));
    }

    // 3. Enforce RBAC rules
    // Sales role cannot edit leads made by other team members
    if (req.user.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      return next(
        new AppError('Access Denied: Sales users are only authorized to edit their own leads.', 403)
      );
    }

    // 4. Apply Changes
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      req.body,
      {
        new: true, // Returns the modified document rather than original
        runValidators: true, // Forces Mongoose schema enums verification
      }
    ).populate('createdBy', 'name email role');

    res.status(200).json({
      status: 'success',
      data: {
        lead: updatedLead,
      },
    });
  }
);

/**
 * ❌ Delete Lead (RBAC: Admin ONLY, Sales are strictly blocked)
 */
export const deleteLead = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const leadId = req.params.id;

    if (!req.user) {
      return next(new AppError('Authentication context missing.', 500));
    }

    // 1. Enforce RBAC: Sales users cannot delete *any* leads
    if (req.user.role !== 'admin') {
      return next(
        new AppError('Access Denied: Only administrators are authorized to delete leads.', 403)
      );
    }

    // 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(new AppError('Invalid lead reference ID format.', 400));
    }

    // 3. Delete Lead
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      return next(new AppError('No lead found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully.',
      data: null,
    });
  }
);
