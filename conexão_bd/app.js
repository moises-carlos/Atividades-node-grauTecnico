
const express = require('express');
const { connectDB } = require('./database');
const petRoutes = require('./routes/petRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

connectDB();

app.use('/api/pets', petRoutes);

app.listen(PORT, () => {
  console.log(` Tá rodando aqui ó -> http://localhost:${PORT}`);
});