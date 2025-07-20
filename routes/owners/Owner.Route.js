const express = require('express');
const router = express.Router();
const { addPG, getPGs, updatePG, getPGsNearby, addStaff, getStaffByOwnerId } = require('../../controllers/owners/Owner.Controller');
const { authMiddleware, verifyRole } = require('../../middlewares/owners/Auth.Middleware');

router.post('/add/:id', authMiddleware, verifyRole('owner'), addPG);
router.get('/', authMiddleware, getPGs);
router.put('/:pgId', authMiddleware, verifyRole('owner'), updatePG);
router.get('/nearBy', authMiddleware, getPGsNearby);

router.post('/add-staff', authMiddleware, verifyRole('owner'), addStaff);

router.get('/staff-list/:ownerId', authMiddleware, getStaffByOwnerId);

module.exports = router;
