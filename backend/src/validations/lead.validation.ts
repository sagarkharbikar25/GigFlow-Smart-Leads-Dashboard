import { z } from 'zod';

/**
 * Validation schema for Creating a Lead
 */
export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Lead name is required',
      })
      .trim()
      .min(2, 'Lead name must be at least 2 characters')
      .max(100, 'Lead name cannot exceed 100 characters'),
    email: z
      .string({
        required_error: 'Lead email is required',
      })
      .trim()
      .email('Please provide a valid lead email address'),
    status: z
      .enum(['new', 'contacted', 'qualified', 'lost'], {
        errorMap: () => ({ message: "Status must be: 'new', 'contacted', 'qualified', or 'lost'" }),
      })
      .optional(), // Mongoose defaults to 'new' if omitted
    source: z
      .enum(['website', 'instagram', 'referral'], {
        errorMap: () => ({ message: "Source must be: 'website', 'instagram', or 'referral'" }),
      }),
  }),
});

/**
 * Validation schema for Updating a Lead (All fields optional)
 */
export const updateLeadSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Lead name must be at least 2 characters')
      .max(100, 'Lead name cannot exceed 100 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Please provide a valid lead email address')
      .optional(),
    status: z
      .enum(['new', 'contacted', 'qualified', 'lost'], {
        errorMap: () => ({ message: "Status must be: 'new', 'contacted', 'qualified', or 'lost'" }),
      })
      .optional(),
    source: z
      .enum(['website', 'instagram', 'referral'], {
        errorMap: () => ({ message: "Source must be: 'website', 'instagram', or 'referral'" }),
      })
      .optional(),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
