const express = require('express');
const authRoute = require('./Auth.Route');
const ownerRoute = require('./Owner.Route');
const router = express();

router.use('/auth', authRoute);
router.use('/owner/pg', ownerRoute);

module.exports = router;

