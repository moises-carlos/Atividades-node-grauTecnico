import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = "minha_chave_secreta";


const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'joao', password: '123456', role: 'user' }
];


let products = [
  { id: 1, name: "Teclado Mecânico" },
  { id: 2, name: "Mouse Gamer" }
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido." });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido." });

    req.user = user; 
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado." });
    }
    next();
  };
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }


  const payload = {
    username: foundUser.username,
    role: foundUser.role
  };

  // Cria o token
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

app.get('/products', authenticateToken, (req, res) => {
  res.json(products);
});

app.post('/products',
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    const { name } = req.body;

    const newProduct = {
      id: products.length + 1,
      name
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
  }
);

app.delete('/products/:id',
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {

    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const removed = products.splice(index, 1);

    res.json({ message: "Produto removido.", removed });
  }
);


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
