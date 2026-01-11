import { Router } from 'express';
import { appointmentController } from '../controllers/index.js';
import { validate, createAppointmentSchema, updateAppointmentSchema } from '../middleware/index.js';

const router = Router();

/**
 * @route POST /api/appointments
 * @desc Create a new appointment
 */
router.post('/', validate(createAppointmentSchema), appointmentController.create);

/**
 * @route GET /api/appointments
 * @desc Get all appointments with optional filters
 */
router.get('/', appointmentController.getAll);

/**
 * @route GET /api/appointments/upcoming
 * @desc Get upcoming appointments
 */
router.get('/upcoming', appointmentController.getUpcoming);

/**
 * @route GET /api/appointments/session/:sessionId
 * @desc Get appointments by session ID
 */
router.get('/session/:sessionId', appointmentController.getBySession);

/**
 * @route GET /api/appointments/:id
 * @desc Get an appointment by ID
 */
router.get('/:id', appointmentController.get);

/**
 * @route PATCH /api/appointments/:id
 * @desc Update an appointment
 */
router.patch('/:id', validate(updateAppointmentSchema), appointmentController.update);

/**
 * @route POST /api/appointments/:id/cancel
 * @desc Cancel an appointment
 */
router.post('/:id/cancel', appointmentController.cancel);

/**
 * @route DELETE /api/appointments/:id
 * @desc Delete an appointment
 */
router.delete('/:id', appointmentController.delete);

export default router;
