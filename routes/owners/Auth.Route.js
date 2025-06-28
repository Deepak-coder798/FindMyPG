const express = require('express');
const router = express.Router();
const { signup, login,   verifyEmail, verifyPhone } = require('../../controllers/owners/Auth.Controller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);

module.exports = router;
