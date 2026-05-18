import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * Route: POST /api/v1/auth/register
 * Desc: Register a new user (default role: sales)
 */
router.post('/register', validate(registerSchema), register);

/**
 * Route: POST /api/v1/auth/login
 * Desc: Authenticate user & retrieve JWT token
 */
router.post('/login', validate(loginSchema), login);

/**
 * Route: GET /api/v1/auth/me
 * Desc: Returns current authenticated user
 */
router.get('/me', protect, getMe);

export default router;
