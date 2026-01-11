import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/index.js';
import { createError } from '../middleware/index.js';

export const sessionController = {
  /**
   * Create a new session
   * POST /api/sessions
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await sessionService.createSession(req.body);

      res.status(201).json({
        success: true,
        data: {
          sessionId: session.sessionId,
          userId: session.userId,
          userName: session.userName,
          petName: session.petName,
          source: session.source,
          createdAt: session.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a session by ID
   * GET /api/sessions/:sessionId
   */
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const session = await sessionService.getSession(sessionId);

      if (!session) {
        throw createError('Session not found', 404);
      }

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          userId: session.userId,
          userName: session.userName,
          petName: session.petName,
          source: session.source,
          messageCount: session.messages.length,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get sessions by user ID
   * GET /api/sessions/user/:userId
   */
  async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const sessions = await sessionService.getSessionsByUserId(userId, limit);

      res.json({
        success: true,
        data: sessions.map(s => ({
          sessionId: s.sessionId,
          userName: s.userName,
          petName: s.petName,
          source: s.source,
          createdAt: s.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a session
   * DELETE /api/sessions/:sessionId
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const deleted = await sessionService.deleteSession(sessionId);

      if (!deleted) {
        throw createError('Session not found', 404);
      }

      res.json({
        success: true,
        message: 'Session deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
