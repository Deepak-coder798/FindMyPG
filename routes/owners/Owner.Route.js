const express = require('express');
const router = express.Router();
const { addPG, getPGs, updatePG, getPGsNearby } = require('../../controllers/owners/Owner.Controller');
const { authMiddleware, verifyRole } = require('../../middlewares/owners/Auth.Middleware');

router.post('/add/:id', authMiddleware, verifyRole('owner'), addPG);
router.get('/', authMiddleware, verifyRole('owner'), getPGs);
router.put('/:pgId', authMiddleware, verifyRole('owner'), updatePG);
router.get('/nearBy', authMiddleware, verifyRole('owner'), getPGsNearby);

module.exports = router;
