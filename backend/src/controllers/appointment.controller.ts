import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/index.js';
import { createError } from '../middleware/index.js';

export const appointmentController = {
  /**
   * Create a new appointment
   * POST /api/appointments
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointment = await appointmentService.createAppointment(req.body);

      res.status(201).json({
        success: true,
        data: {
          id: appointment._id,
          sessionId: appointment.sessionId,
          ownerName: appointment.ownerName,
          petName: appointment.petName,
          phone: appointment.phone,
          preferredDateTime: appointment.preferredDateTime,
          status: appointment.status,
          createdAt: appointment.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get an appointment by ID
   * GET /api/appointments/:id
   */
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      if (!appointment) {
        throw createError('Appointment not found', 404);
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all appointments with optional filters
   * GET /api/appointments
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, startDate, endDate, limit, offset } = req.query;

      const result = await appointmentService.getAllAppointments({
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.json({
        success: true,
        data: result.appointments,
        meta: {
          total: result.total,
          limit: limit ? parseInt(limit as string) : 50,
          offset: offset ? parseInt(offset as string) : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get appointments by session ID
   * GET /api/appointments/session/:sessionId
   */
  async getBySession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const appointments = await appointmentService.getAppointmentsBySession(sessionId);

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get upcoming appointments
   * GET /api/appointments/upcoming
   */
  async getUpcoming(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const appointments = await appointmentService.getUpcomingAppointments(limit);

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an appointment
   * PATCH /api/appointments/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.updateAppointment(id, req.body);

      if (!appointment) {
        throw createError('Appointment not found', 404);
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel an appointment
   * POST /api/appointments/:id/cancel
   */
  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.cancelAppointment(id);

      if (!appointment) {
        throw createError('Appointment not found', 404);
      }

      res.json({
        success: true,
        data: appointment,
        message: 'Appointment cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an appointment
   * DELETE /api/appointments/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await appointmentService.deleteAppointment(id);

      if (!deleted) {
        throw createError('Appointment not found', 404);
      }

      res.json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
