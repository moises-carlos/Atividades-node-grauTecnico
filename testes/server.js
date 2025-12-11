const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "chave-secreta-super-segura",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } 
  })
);

let users = []; 
let notasPorUsuario = {}; 

function auth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
}

app.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(senha, 10);

  const newUser = {
    id: users.length + 1,
    email,
    passwordHash
  };

  users.push(newUser);
  notasPorUsuario[newUser.id] = [];

  res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }

  const ok = await bcrypt.compare(senha, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }

  req.session.userId = user.id;
  res.json({ message: "Login realizado com sucesso!" });
});

app.post("/notas", auth, (req, res) => {
  const { nomeAluno, nota } = req.body;

  if (nota < 0 || nota > 10) {
    return res.status(400).json({ error: "Nota deve estar entre 0 e 10" });
  }

  notasPorUsuario[req.session.userId].push({ nomeAluno, nota });

  res.status(201).json({ message: "Nota adicionada com sucesso!" });
});

app.get("/notas", auth, (req, res) => {
  const notas = notasPorUsuario[req.session.userId];
  res.json(notas);
});

app.get("/notas/:nomeAluno/media", auth, (req, res) => {
  const nome = req.params.nomeAluno;
  const notas = notasPorUsuario[req.session.userId];

  const filtradas = notas.filter(n => n.nomeAluno === nome);

  if (filtradas.length === 0) {
    return res.status(404).json({ error: "Aluno não encontrado" });
  }

  const media =
    filtradas.reduce((acc, obj) => acc + obj.nota, 0) / filtradas.length;

  res.json({ aluno: nome, media });
});

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});


module.exports = app; 