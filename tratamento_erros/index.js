const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const users = [];

const db = {
  async createUser(user) {
    return new Promise((resolve) => {
      setTimeout(() => {
        users.push(user);
        resolve(user);
      }, 10);
    });
  },
  async findUserByEmail(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users.find(u => u.email === email) || null);
      }, 10);
    });
  },
  async findUserById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users.find(u => u.id === id) || null);
      }, 10);
    });
  }
};

function validateCreateUser(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {

    return res.status(422).json({ error: 'Nome e e-mail são obrigatórios' });
  }
  next();
}
app.post('/users', validateCreateUser, async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const existing = await db.findUserByEmail(email);
    if (existing) {
     
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const newUser = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    const created = await db.createUser(newUser);

    return res.status(201).json(created);
  } catch (err) {
    
    next(err);
  }
});

app.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.findUserById(id);
    if (!user) {

      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ei luana, tá rodando aqui ó -> http://localhost:${PORT}`);
});