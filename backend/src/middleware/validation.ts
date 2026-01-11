import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Validation schemas
export const chatMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  context: z.object({
    userId: z.string().optional(),
    userName: z.string().optional(),
    petName: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
});

export const createSessionSchema = z.object({
  userId: z.string().optional(),
  userName: z.string().optional(),
  petName: z.string().optional(),
  source: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

export const createAppointmentSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  petName: z.string().min(1, 'Pet name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferredDateTime: z.string().or(z.date()),
  reason: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  ownerName: z.string().optional(),
  petName: z.string().optional(),
  phone: z.string().min(10).optional(),
  preferredDateTime: z.string().or(z.date()).optional(),
  reason: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  notes: z.string().optional(),
});

// Generic validation middleware factory
export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
