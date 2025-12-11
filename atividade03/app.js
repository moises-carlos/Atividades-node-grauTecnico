require('dotenv').config();
const express = require('express');
const app = express();
const loginRoutes = require('./routes/loginRoutes');
const productsRoutes = require('./routes/productsRoutes');

app.use(express.json());

app.use(loginRoutes);
app.use(productsRoutes);

module.exports = app;