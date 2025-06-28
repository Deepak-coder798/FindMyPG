const express = require('express');
const cors = require('cors');
const ConnectDB  = require('./config/ConnectDB')
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
ConnectDB();


app.listen(PORT,()=>{
    console.log(`server is running on PORT: ${PORT}`);
})