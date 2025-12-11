const { products, Products } = require('../models/productsModel');

const getAllProducts = (req, res) => {
    res.json(products);
};

const addProduct = (req, res) => {
    const { name, price } = req.body;
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = new Products(newId, name, price);
    products.push(newProduct);
    res.status(201).json(newProduct);
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id == id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
};

module.exports = { getAllProducts, addProduct, deleteProduct };
