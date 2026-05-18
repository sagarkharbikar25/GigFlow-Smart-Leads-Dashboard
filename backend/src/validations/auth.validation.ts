import { z } from 'zod';

/**
 * Validation schema for User Registration
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .trim()
      .email('Please provide a valid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long')
      .max(32, 'Password cannot exceed 32 characters'),
    role: z
      .enum(['admin', 'sales'], {
        errorMap: () => ({ message: "Role must be either 'admin' or 'sales'" }),
      })
      .optional(),
  }),
});

/**
 * Validation schema for User Login
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .trim()
      .email('Please provide a valid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      }),
  }),
});

// Infer TS types directly from Zod schemas for compiler safety!
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
