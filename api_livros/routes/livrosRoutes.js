const express = require('express');
const router = express.Router();

let livros = [];


router.post('/criarLivros', (req, res) => {
  const { titulo, autor, ano } = req.body;

  if (!titulo || !autor || !ano) {
    return res.status(400).json({ error: 'Título, autor e ano são obrigatórios.' });
  }

  const novoLivro = { titulo, autor, ano };
  livros.push(novoLivro);

  return res.status(201).json({
    message: 'Livro cadastrado com sucesso!',
    livro: novoLivro
  });
});

router.get('/exibirLivros', (req, res) => {
  res.json(livros);
});

module.exports = router;
