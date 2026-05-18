import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { UserRole } from '../types';

/**
 * Restricts access to specified roles
 * @param roles Array of authorized roles (e.g. ['admin'])
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Safety check: protect middleware must be executed before restrictTo
    if (!req.user) {
      return next(
        new AppError('Authorization failed: Authentication context missing.', 500)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Access Denied: You do not have permissions to perform this action.', 403)
      );
    }

    next();
  };
};

export default restrictTo;
