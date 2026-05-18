import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/auth.service';

/**
 * Register User Controller
 */
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, user } = await authService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  }
);

/**
 * Login User Controller
 */
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, user } = await authService.loginUser(req.body);

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  }
);

/**
 * Get Current User Controller
 */
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // req.user is guaranteed to be set by the auth middleware
    const user = await authService.getMe(req.user!.id);
    
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }
);
