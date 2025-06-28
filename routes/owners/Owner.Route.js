const express = require('express');
const router = express.Router();
const { addPG, getPGs, updatePG } = require('../../controllers/owners/Owner.Controller');
const { authMiddleware, verifyRole } = require('../../middlewares/owners/Auth.Middleware');

router.post('/add', authMiddleware, verifyRole('owner'), addPG);
router.get('/', authMiddleware, verifyRole('owner'), getPGs);
router.put('/:pgId', authMiddleware, verifyRole('owner'), updatePG);

module.exports = router;
