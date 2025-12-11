const express = require('express');
const app = express();
const livrosRoutes = require('./routes/livrosRoutes');

app.use(express.json());

// Rotas
app.use('/api', livrosRoutes);

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
