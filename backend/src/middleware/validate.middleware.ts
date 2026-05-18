import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Validates request input against a Zod schema
 * @param schema AnyZodObject schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Collect all validation messages
        const errorMessages = error.errors.map((err) => `${err.path.slice(1).join('.')}: ${err.message}`);
        const cleanMessage = `Validation Error: ${errorMessages.join(' | ')}`;
        
        // Pass validation error (400 Bad Request) to the global handler
        return next(new AppError(cleanMessage, 400));
      }
      next(error);
    }
  };
};

export default validate;
