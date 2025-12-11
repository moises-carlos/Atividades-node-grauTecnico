require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret';
const SESSION_MAX_AGE = 1000 * 60 * 60; 

app.use(session({
  name: 'sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

const users = []; 
let products = [
  { id: 1, name: 'Teclado Mecânico' },
  { id: 2, name: 'Mouse Gamer' }
];

const nextUserId = (() => {
  let id = 1;
  return () => id++;
})();
const nextProductId = (() => {
  let id = products.length + 1;
  return () => id++;
})();


(async function seedAdmin() {
  const adminExists = users.find(u => u.username === 'admin');
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 10);
    users.push({ id: nextUserId(), username: 'admin', passwordHash: hash, role: 'admin' });
    console.log('Usuário admin seedado (username: admin, password: admin123)');
  }
})();


function authenticateSession(req, res, next) {
  if (req.session && req.session.user) {

    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: usuário não autenticado.' });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: acesso negado.' });
    }
    next();
  };
}

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username e password são obrigatórios.' });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nextUserId(),
    username,
    passwordHash,
    role: role || 'user'
  };
  users.push(newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ message: 'Usuário registrado.', user: safeUser });
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username e password são obrigatórios.' });
  }

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Credenciais inválidas.' });

  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({ message: 'Login realizado com sucesso.', user: { id: user.id, username: user.username, role: user.role } });
});


app.post('/logout', authenticateSession, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Erro ao encerrar sessão.' });
    res.clearCookie('sid');
    res.json({ message: 'Logout realizado.' });
  });
});

app.get('/products', authenticateSession, (req, res) => {
  res.json(products);
});

app.post('/products', authenticateSession, authorizeRoles('admin'), (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Campo name é obrigatório.' });

  const newProduct = { id: nextProductId(), name };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


app.delete('/products/:id', authenticateSession, authorizeRoles('admin'), (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Produto não encontrado.' });

  const removed = products.splice(index, 1)[0];
  res.json({ message: 'Produto removido.', product: removed });
});


app.get('/', (req, res) => {
  res.send('API com express-session rodando.');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
