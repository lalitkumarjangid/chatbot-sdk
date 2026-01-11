import { Router } from 'express';
import chatRoutes from './chat.routes.js';
import sessionRoutes from './session.routes.js';
import appointmentRoutes from './appointment.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Veterinary Chatbot API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/chat', chatRoutes);
router.use('/sessions', sessionRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
