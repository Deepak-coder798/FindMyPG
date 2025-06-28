const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const ConnectDB = require('./config/ConnectDB')
const ownerRouters = require('./routes/owners/Index');

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

//database connection
ConnectDB();


// Routes
app.use('/api', ownerRouters);



app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
