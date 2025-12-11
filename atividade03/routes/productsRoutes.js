const express = require('express');
const routes = express.Router();
const { getAllProducts, addProduct, deleteProduct } = require('../controllers/productsController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

routes.get('/products', authenticateToken, getAllProducts);
routes.post('/products', authenticateToken, authorizeRoles('admin'), addProduct);
routes.delete('/products/:id', authenticateToken, authorizeRoles('admin'), deleteProduct);

module.exports = routes;