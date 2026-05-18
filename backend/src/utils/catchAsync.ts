import { Request, Response, NextFunction } from 'express';

/**
 * Wraps asynchronous Express route handlers to automatically catch errors
 * and forward them to the global error middleware pipeline.
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
