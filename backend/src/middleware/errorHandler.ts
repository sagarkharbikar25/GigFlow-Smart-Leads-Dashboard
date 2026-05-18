import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

interface IMongoError {
  statusCode?: number;
  status?: string;
  message: string;
  isOperational?: boolean;
  path?: string;
  value?: string;
  errmsg?: string;
  code?: number;
  name?: string;
  errors?: Record<string, { message: string }>;
  stack?: string;
}

/**
 * Handles Express development errors.
 * Returns full stack traces and error details for painless debugging.
 */
const sendErrorDev = (err: IMongoError, res: Response): void => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Handles Express production errors.
 * Masks sensitive system errors and prints operational, user-friendly errors.
 */
const sendErrorProd = (err: IMongoError, res: Response): void => {
  // Operational, trusted error: send clean message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error (e.g. library bug, Mongo connection lost): don't leak details
  console.error('🔥 ERROR: ', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on our end. Please try again later.',
  });
};

/**
 * Handle Mongoose CastError (e.g., invalid ObjectId format)
 */
const handleCastErrorDB = (err: IMongoError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error (e.g., email registered twice)
 */
const handleDuplicateFieldsDB = (err: IMongoError): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || 'Unknown field';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose ValidationError
 */
const handleValidationErrorDB = (err: IMongoError): AppError => {
  const errors = Object.values(err.errors ?? {}).map((el: { message: string }) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT Invalid Signature Error
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

/**
 * Handle JWT Expired Error
 */
const handleJWTExpiredError = () => new AppError('Your session has expired. Please log in again!', 401);

/**
 * Main Express Global Error Handling Middleware
 */
export const globalErrorHandler = (
  err: IMongoError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    const error: IMongoError = { ...err, message: err.message };
    
    // Mongoose/MongoDB common error handlers
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    
    // JWT specific error handlers
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
