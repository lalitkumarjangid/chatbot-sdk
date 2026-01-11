import { Router } from 'express';
import { chatController } from '../controllers/index.js';
import { validate, chatMessageSchema } from '../middleware/index.js';

const router = Router();

/**
 * @route POST /api/chat/message
 * @desc Send a message and get AI response
 */
router.post('/message', validate(chatMessageSchema), chatController.sendMessage);

/**
 * @route GET /api/chat/history/:sessionId
 * @desc Get chat history for a session
 */
router.get('/history/:sessionId', chatController.getHistory);

/**
 * @route POST /api/chat/reset-appointment/:sessionId
 * @desc Reset appointment booking flow for a session
 */
router.post('/reset-appointment/:sessionId', chatController.resetAppointment);

export default router;
