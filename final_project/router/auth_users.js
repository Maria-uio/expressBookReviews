const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Tarea 7: login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Debe proporcionar username y password" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "Inicio de sesión exitoso" });
});

// Tarea 8: agregar o modificar una reseña
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
  if (!review) {
    return res.status(400).json({ message: "Debe enviar la reseña en el parámetro 'review'" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: `Reseña del usuario ${username} guardada para el libro ${isbn}`,
    reviews: books[isbn].reviews
  });
});

// Tarea 9: eliminar la reseña propia
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No tiene una reseña para este libro" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Reseña del usuario ${username} eliminada del libro ${isbn}`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;