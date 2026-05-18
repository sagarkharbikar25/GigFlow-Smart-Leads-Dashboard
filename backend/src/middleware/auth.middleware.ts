import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { IUserPayload, UserRole } from '../types';

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Authentication Middleware
 * Enforces valid bearer token presence and extracts identity payload
 */
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    // 1. Check if auth header is present and starts with 'Bearer'
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2. Cryptographically verify the token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Server configuration missing: JWT Secret.', 500));
    }

    const decoded = jwt.verify(token, secret) as IDecodedToken;

    // 3. Confirm user still exists in MongoDB
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this session token no longer exists.', 401)
      );
    }

    // 4. Inject standard user payload into the Express Request context
    req.user = {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role as UserRole,
    };

    next();
  }
);
