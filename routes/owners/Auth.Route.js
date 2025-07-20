const express = require('express');
const router = express.Router();
const { signup, login,   verifyEmail, verifyPhone } = require('../../controllers/owners/Auth.Controller');
const {authMiddleware}  = require('../../middlewares/owners/Auth.Middleware')

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);

router.post('/verify-token', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

module.exports = router;
