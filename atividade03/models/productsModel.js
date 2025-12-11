class Products {
    constructor(id, name, preco) {
        this.id = id;
        this.name = name;
        this.preco = preco;
    }
}

const products = [
    new Products(1, 'Produto A', 19.99),
    new Products(2, 'Produto B', 29.99)
];

module.exports = { Products, products };