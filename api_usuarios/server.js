const express = require("express");
const app = express();

const usersRoutes = require("./routes/usersRoutes");

app.use(express.json());
app.use(usersRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
