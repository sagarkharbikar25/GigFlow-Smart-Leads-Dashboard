import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { AppError } from '../utils/AppError';
import { IUserPayload } from '../types';

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
 * Service to register a new user
 */
export const registerUser = async (data: any): Promise<{ token: string; user: IUserPayload }> => {
  const { name, email, password, role } = data;

  // Double check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('A user with this email address already exists.', 400);
  }

  // Create the user document (pre-save hook will hash password automatically)
  const newUser = await User.create({
    name,
    email,
    password,
    role, // Schema will validate role, defaults to 'sales'
  });

  // Issue JSON Web Token
  const token = signToken(newUser._id.toString());

  return {
    token,
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
    },
  };
};

/**
 * Service to login a user
 */
export const loginUser = async (data: any): Promise<{ token: string; user: IUserPayload }> => {
  const { email, password } = data;

  // Retrieve the user and explicitly request the password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password. Please try again.', 401);
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password. Please try again.', 401);
  }

  // Issue JSON Web Token
  const token = signToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as any,
    },
  };
};

/**
 * Service to get the current authenticated user details
 */
export const getMe = async (userId: string): Promise<IUserPayload> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as any,
  };
};
