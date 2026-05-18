import { Request } from 'express';

// Define standard User roles
export type UserRole = 'admin' | 'sales';

// Core User interface representing Mongo User documents
export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Global Namespace Override for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
