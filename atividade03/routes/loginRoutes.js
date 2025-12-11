const express = require('express');
const routes = express.Router();
const { login } = require('../controllers/authControllers');

routes.post('/login', login);

module.exports = routes;