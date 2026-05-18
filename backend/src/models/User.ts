import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

// Define User Interface extending mongoose.Document for TS safety
export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Strictly-typed Mongoose User Schema
const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Automatically excludes this field from standard queries!
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'sales'],
        message: 'Role must be either admin or sales',
      },
      default: 'sales',
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
  }
);

// Pre-save hashing middleware
userSchema.pre<IUserDocument>('save', async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12); // Production-grade salting rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare candidate password against database hash
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export User Model
export const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;
