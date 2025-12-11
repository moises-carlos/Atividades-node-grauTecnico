let users = [];

function isEmailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

exports.getUsers = (req, res) => {
  const { name } = req.query;

  if (name) {
    const filtro = users.filter((u) =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtro);
  }

  return res.json(users);
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json(user);
};

exports.createUser = (req, res) => {
  const { id, name, email } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (typeof id !== "number") {
    return res.status(400).json({ error: "ID deve ser numérico" });
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: "O nome deve ter no mínimo 3 caracteres" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  const newUser = { id, name, email };
  users.push(newUser);

  return res.status(201).json(newUser);
};
