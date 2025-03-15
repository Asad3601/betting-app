require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const bodyParser = require('body-parser');
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');
const AuthRoute = require('./routes/AuthRoute');
const crypto = require('crypto');
const axios = require('axios');
const AdminRoute = require('./routes/AdminRoute');
const TronWeb = require('tronweb').TronWeb;
const Binance = require('node-binance-api');

const PORT = process.env.PORT || 5000;
const app = express();


// Using a temporary private key for testnet (DO NOT use for real funds)
const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: "DC45265E4D76BF234B92FAEF5389B239A8963E8680A37EB41DAA34AC0713A61F", // Your private key
});

// Get the associated address
// console.log(tronWeb.address.fromPrivateKey("DC45265E4D76BF234B92FAEF5389B239A8963E8680A37EB41DAA34AC0713A61F"));




app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.use("/api/auth/user", AuthRoute);
app.use("/api/admin/plans", AdminRoute);




app.use(ErrorMiddleware);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
