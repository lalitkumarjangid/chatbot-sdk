import { Request, Response, NextFunction } from 'express';
import { sessionService, geminiService, appointmentService, AppointmentState } from '../services/index.js';
import { createError } from '../middleware/index.js';

// In-memory store for appointment states (in production, use Redis or session storage)
const appointmentStates = new Map<string, AppointmentState>();

export const chatController = {
  /**
   * Send a message and get AI response
   * POST /api/chat/message
   */
  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, message, context } = req.body;

      // Get or create session
      const session = await sessionService.getOrCreateSession(sessionId, context);

      // Store user message
      await sessionService.addMessage({
        sessionId: session.sessionId,
        role: 'user',
        content: message,
      });

      // Get conversation history for context
      const messages = await sessionService.getMessages(session.sessionId, 10);

      // Get current appointment state
      let appointmentState = appointmentStates.get(session.sessionId) || {
        step: 'idle' as const,
        data: {},
      };

      // Generate AI response
      const response = await geminiService.generateResponse(message, messages, appointmentState);

      // Update appointment state if in booking flow
      if (response.intent === 'appointment_booking') {
        appointmentState = {
          step: response.appointmentStep as AppointmentState['step'],
          data: response.appointmentData || {},
        };
        appointmentStates.set(session.sessionId, appointmentState);

        // If appointment is complete, save it
        if (response.appointmentStep === 'complete' && appointmentState.data) {
          try {
            await appointmentService.createAppointment({
              sessionId: session.sessionId,
              ownerName: appointmentState.data.ownerName || '',
              petName: appointmentState.data.petName || '',
              phone: appointmentState.data.phone || '',
              preferredDateTime: appointmentState.data.preferredDateTime || new Date().toISOString(),
            });
            
            // Reset appointment state
            appointmentStates.delete(session.sessionId);
          } catch (error) {
            console.error('Error saving appointment:', error);
          }
        }
      }

      // Store assistant response
      await sessionService.addMessage({
        sessionId: session.sessionId,
        role: 'assistant',
        content: response.message,
      });

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          message: response.message,
          intent: response.intent,
          isAppointmentFlow: response.intent === 'appointment_booking',
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get chat history for a session
   * GET /api/chat/history/:sessionId
   */
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const session = await sessionService.getSession(sessionId);
      if (!session) {
        throw createError('Session not found', 404);
      }

      const messages = await sessionService.getMessages(sessionId, limit);

      res.json({
        success: true,
        data: {
          sessionId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset appointment booking flow
   * POST /api/chat/reset-appointment/:sessionId
   */
  async resetAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;

      appointmentStates.delete(sessionId);

      res.json({
        success: true,
        message: 'Appointment flow reset successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
