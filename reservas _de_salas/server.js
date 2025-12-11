const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "segredo-super-seguro";

let rooms = [];
let bookings = [];
let users = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "maria", password: "123", role: "member" }
];

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token não enviado" });

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded;
    next();
  });
}

function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}
function validateRoomQuery(req, res, next) {
  const { page, limit, capacityMin, hasProjector } = req.query;

  if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return res.status(400).json({ error: "page deve ser inteiro > 0" });
  }

  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return res.status(400).json({ error: "limit deve ser inteiro > 0" });
  }

  if (capacityMin && isNaN(Number(capacityMin))) {
    return res.status(400).json({ error: "capacityMin deve ser número" });
  }

  if (hasProjector && !["true", "false"].includes(hasProjector)) {
    return res.status(400).json({ error: "hasProjector deve ser true ou false" });
  }

  next();
}

app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno"
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const found = users.find(
    u => u.username === username && u.password === password
  );

  if (!found) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign(
    { id: found.id, username: found.username, role: found.role },
    SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

app.get("/rooms", auth, validateRoomQuery, (req, res) => {
  let result = [...rooms];
  const { capacityMin, hasProjector, page, limit } = req.query;

  if (capacityMin) {
    result = result.filter(room => room.capacity >= Number(capacityMin));
  }

  if (hasProjector) {
    result = result.filter(room => room.hasProjector === (hasProjector === "true"));
  }

  if (page && limit) {
    const p = Number(page);
    const l = Number(limit);
    result = result.slice((p - 1) * l, p * l);
  }

  res.json(result);
});

app.post("/rooms", auth, authorize(["admin"]), (req, res) => {
  const { name, capacity, hasProjector } = req.body;

  if (!name || !capacity || Number(capacity) <= 0) {
    return res.status(422).json({ error: "Dados inválidos para criação de sala" });
  }

  const newRoom = {
    id: rooms.length + 1,
    name,
    capacity,
    hasProjector: Boolean(hasProjector)
  };

  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

app.post("/rooms/:id/bookings", auth, authorize(["member"]), (req, res) => {
  const roomId = Number(req.params.id);
  const { date, start, end } = req.body;

  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ error: "Sala não encontrada" });

  const conflict = bookings.some(b =>
    b.roomId === roomId &&
    b.date === date &&
    !(
      end <= b.start ||
      start >= b.end
    )
  );

  if (conflict) {
    return res.status(409).json({ error: "Conflito de horário para esta sala" });
  }

  const newBooking = {
    id: bookings.length + 1,
    roomId,
    userId: req.user.id,
    date,
    start,
    end
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

app.get("/bookings", auth, authorize(["admin"]), (req, res) => {
  res.json(bookings);
});

app.delete("/bookings/:id", auth, authorize(["admin"]), (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Reserva não encontrada" });
  }

  bookings.splice(index, 1);
  res.status(204).send();
});


app.listen(3000, () => console.log("API rodando na porta 3000"));
