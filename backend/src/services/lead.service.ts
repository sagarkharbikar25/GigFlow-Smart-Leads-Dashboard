import mongoose, { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead';
import { AppError } from '../utils/AppError';

interface GetLeadsParams {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Service: Create Lead
 */
export const createLead = async (data: any, userId: string): Promise<ILeadDocument> => {
  const newLead = await Lead.create({
    ...data,
    createdBy: userId,
  });
  return newLead;
};

/**
 * Service: Get All Leads with Filtering, Sorting, and Pagination
 */
export const getLeads = async (params: GetLeadsParams) => {
  const { status, source, search, sort, page = 1, limit = 10 } = params;

  // 1. Dynamic MongoDB Query construction
  const queryObj: FilterQuery<ILeadDocument> = {};

  if (status) queryObj.status = status;
  if (source) queryObj.source = source;
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // 2. Sorting Setup
  let sortBy = '-createdAt';
  if (sort === 'oldest') {
    sortBy = 'createdAt';
  }

  // 3. Pagination Setup
  const skip = (page - 1) * limit;

  // 4. Execute Queries in Parallel
  const [leads, totalRecords, statsArray] = await Promise.all([
    Lead.find(queryObj)
      .populate('createdBy', 'name email role')
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(queryObj),
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
  const stats = { new: 0, contacted: 0, qualified: 0, lost: 0, total: 0 };
  statsArray.forEach((item: { _id: string; count: number }) => {
    if (item._id in stats) {
      (stats as any)[item._id] = item.count;
    }
  });
  stats.total = stats.new + stats.contacted + stats.qualified + stats.lost;

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    leads,
    totalRecords,
    stats,
    metadata: {
      page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Service: Export Leads to CSV
 */
export const exportLeadsCSV = async (params: GetLeadsParams): Promise<string> => {
  const { status, source, search, sort } = params;

  const queryObj: FilterQuery<ILeadDocument> = {};
  if (status) queryObj.status = status;
  if (source) queryObj.source = source;
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let sortBy = '-createdAt';
  if (sort === 'oldest') sortBy = 'createdAt';

  const leads = await Lead.find(queryObj)
    .populate('createdBy', 'name')
    .sort(sortBy);

  if (leads.length === 0) {
    throw new AppError('No leads found matching current filters.', 404);
  }

  const headers = ['Lead Name,Email Address,Status,Acquisition Source,Created At,Territory Owner'];
  const rows = leads.map((lead: any) => {
    return [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email}"`,
      lead.status.toUpperCase(),
      lead.source.toUpperCase(),
      new Date(lead.createdAt).toLocaleDateString(),
      `"${lead.createdBy?.name || 'Unassigned'}"`,
    ].join(',');
  });

  return [...headers, ...rows].join('\n');
};

/**
 * Service: Get Single Lead
 */
export const getLeadById = async (leadId: string): Promise<ILeadDocument> => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError('Invalid lead reference ID format.', 400);
  }

  const lead = await Lead.findById(leadId).populate('createdBy', 'name email role');
  if (!lead) {
    throw new AppError('No lead found with that ID.', 404);
  }

  return lead;
};

/**
 * Service: Update Lead
 */
export const updateLead = async (
  leadId: string,
  updateData: any,
  user: { id: string; role: string }
): Promise<ILeadDocument> => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError('Invalid lead reference ID format.', 400);
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new AppError('No lead found with that ID.', 404);
  }

  // RBAC: Sales users can only edit their own leads
  if (user.role === 'sales' && lead.createdBy.toString() !== user.id) {
    throw new AppError('Access Denied: Sales users are only authorized to edit their own leads.', 403);
  }

  const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email role');

  return updatedLead as ILeadDocument;
};

/**
 * Service: Delete Lead
 */
export const deleteLead = async (leadId: string, user: { role: string }): Promise<void> => {
  // RBAC: Sales users cannot delete ANY leads
  if (user.role !== 'admin') {
    throw new AppError('Access Denied: Only administrators are authorized to delete leads.', 403);
  }

  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError('Invalid lead reference ID format.', 400);
  }

  const deletedLead = await Lead.findByIdAndDelete(leadId);
  if (!deletedLead) {
    throw new AppError('No lead found with that ID.', 404);
  }
};
