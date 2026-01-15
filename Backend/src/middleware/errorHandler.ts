// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Custom Error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error for debugging
  console.error('❌ Error:', err);

  // Handle Prisma errors (database errors)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: 'Invalid data provided',
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

/**
 * Handle Prisma-specific errors
 * Different error codes mean different things
 */
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response,
) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        error: 'Duplicate entry',
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: 'The requested resource does not exist',
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: 'Invalid reference',
        error: 'Referenced record does not exist',
      });

    case 'P2014':
      // Required relation violation
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
        error: 'Required relation is missing',
      });

    default:
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
  }
};

/**
 * Catch 404 errors (route not found)
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
