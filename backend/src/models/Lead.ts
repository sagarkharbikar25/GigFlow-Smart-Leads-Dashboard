import mongoose, { Schema } from 'mongoose';

// Explicit type definitions for status and source
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';

// Lead document structure in TypeScript
export interface ILeadDocument extends mongoose.Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Strictly-typed Mongoose Lead Schema
const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the lead name'],
      trim: true,
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide the lead email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid lead email address',
      ],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'qualified', 'lost'],
        message: '{VALUE} is not a valid lead status (new, contacted, qualified, lost)',
      },
      default: 'new',
    },
    source: {
      type: String,
      required: [true, 'Please specify the lead source'],
      enum: {
        values: ['website', 'instagram', 'referral'],
        message: '{VALUE} is not a valid lead source (website, instagram, referral)',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Establishes relationships for join querying
      required: [true, 'A lead must be linked to the creating User'],
    },
  },
  {
    timestamps: true, // Automatically provides createdAt & updatedAt
  }
);

// Indexes for ultra-fast filtering and text matching
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
// Compound index for name & email search optimizations
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
export default Lead;
