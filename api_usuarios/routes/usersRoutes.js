const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
} = require("../controllers/usersController");

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);

module.exports = router;
