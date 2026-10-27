const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Debe proporcionar username y password" });
  }
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "El usuario ya existe" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Usuario registrado correctamente. Ahora puede iniciar sesión" });
});

// Tarea 1: obtener la lista de todos los libros
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Tarea 2: obtener detalles de un libro por ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({ message: "Libro no encontrado" });
});

// Tarea 3: obtener libros por autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.keys(books)
    .filter((key) => books[key].author.toLowerCase() === author)
    .map((key) => ({ isbn: key, ...books[key] }));

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No se encontraron libros de ese autor" });
});

// Tarea 4: obtener libros por título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.keys(books)
    .filter((key) => books[key].title.toLowerCase() === title)
    .map((key) => ({ isbn: key, ...books[key] }));

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No se encontraron libros con ese título" });
});

// Tarea 5: obtener las reseñas de un libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Libro no encontrado" });
});

const BASE_URL = "http://localhost:5000";

// Tarea 10: obtener todos los libros con async/await + Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error.message);
  }
};

// Tarea 11: obtener libro por ISBN con Promises + Axios
const getBookByISBN = (isbn) => {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => console.error("Error al buscar por ISBN:", error.message));
};

// Tarea 12: obtener libros por autor con async/await + Axios
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al buscar por autor:", error.message);
  }
};

// Tarea 13: obtener libros por título con async/await + Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al buscar por título:", error.message);
  }
};

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.general = public_users;