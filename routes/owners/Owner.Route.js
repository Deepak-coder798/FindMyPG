const express = require('express');
const router = express.Router();
const { addProperty, addRoom, addStaff, getStaffByOwnerId, addTenant, getTenants, getStaffByPgId, getStaffById } = require('../../controllers/owners/Owner.Controller');
const { authMiddleware, verifyRole } = require('../../middlewares/owners/Auth.Middleware');

router.post('/addProperty/:id', authMiddleware, verifyRole('owner'), addProperty);
router.post('/addRoom/:id', authMiddleware, verifyRole('owner'), addRoom);
router.post('/addTenant/', authMiddleware, verifyRole('owner'), addTenant);
router.post('/getTenant/', authMiddleware, verifyRole('owner'), getTenants);
// router.get('/', authMiddleware, getPGs);
// router.put('/:pgId', authMiddleware, verifyRole('owner'), updatePG);
// router.get('/nearBy', authMiddleware, getPGsNearby);

router.post('/add-staff', authMiddleware, verifyRole('owner'), addStaff);

router.get('/staff-list-ownerId/:pgOwnerId', authMiddleware, getStaffByOwnerId);
router.get('/staff-list-pgId/:pgId', authMiddleware, getStaffByPgId);
router.get('/staff-list-staffId/:staffId', authMiddleware, getStaffById);

module.exports = router;
