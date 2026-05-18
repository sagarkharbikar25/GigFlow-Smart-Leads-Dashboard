import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

/**
 * Sign a JSON Web Token for the user id
 */
const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server configuration issue: JWT Secret is missing.', 500);
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register User Controller
 */
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body;

    // 1. Double check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('A user with this email address already exists.', 400));
    }

    // 2. Create the user document (pre-save hook will hash password automatically)
    const newUser = await User.create({
      name,
      email,
      password,
      role, // Schema will validate role, defaults to 'sales'
    });

    // 3. Issue JSON Web Token
    const token = signToken(newUser._id.toString());

    // 4. Send Response
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  }
);

/**
 * Login User Controller
 */
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // 1. Retrieve the user and explicitly request the password field (since select: false is on in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password. Please try again.', 401));
    }

    // 2. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password. Please try again.', 401));
    }

    // 3. Issue JSON Web Token
    const token = signToken(user._id.toString());

    // 4. Send Response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);
