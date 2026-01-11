import { Router } from 'express';
import { sessionController } from '../controllers/index.js';
import { validate, createSessionSchema } from '../middleware/index.js';

const router = Router();

/**
 * @route POST /api/sessions
 * @desc Create a new session
 */
router.post('/', validate(createSessionSchema), sessionController.create);

/**
 * @route GET /api/sessions/:sessionId
 * @desc Get a session by ID
 */
router.get('/:sessionId', sessionController.get);

/**
 * @route GET /api/sessions/user/:userId
 * @desc Get sessions by user ID
 */
router.get('/user/:userId', sessionController.getByUser);

/**
 * @route DELETE /api/sessions/:sessionId
 * @desc Delete a session
 */
router.delete('/:sessionId', sessionController.delete);

export default router;
