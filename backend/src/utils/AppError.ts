/**
 * Custom Operational Error Class
 * Used to handle standard REST operational errors (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found)
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call itself from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
