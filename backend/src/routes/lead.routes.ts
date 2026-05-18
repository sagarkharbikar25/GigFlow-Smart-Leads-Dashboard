import { Router } from 'express';
import {
  createLead,
  getAllLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';

const router = Router();

// ==========================================
// 🔒 Protected Routes (Require Valid JWT Token)
// ==========================================
router.use(protect);

/**
 * Route: POST /api/v1/leads
 * Desc: Create a new lead (Allowed for: admin, sales)
 */
router.post('/', validate(createLeadSchema), createLead);

/**
 * Route: GET /api/v1/leads
 * Desc: Get leads list with advanced filters, search, and page limit options (Allowed for: admin, sales)
 */
router.get('/', getAllLeads);

/**
 * Route: GET /api/v1/leads/:id
 * Desc: Retrieve details of a single lead (Allowed for: admin, sales)
 */
router.get('/:id', getLead);

/**
 * Route: PUT /api/v1/leads/:id
 * Desc: Update a lead (Allowed for: admin, sales. Sales can only edit own leads, checked in controller)
 */
router.put('/:id', validate(updateLeadSchema), updateLead);

/**
 * Route: DELETE /api/v1/leads/:id
 * Desc: Delete a lead (Allowed for: admin ONLY, checked in controller and double secured here)
 */
router.delete('/:id', restrictTo('admin'), deleteLead);

export default router;
