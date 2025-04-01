const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let books = [];
let users = [];

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/books', (req, res) => res.render('books', { books }));
app.get('/books/new', (req, res) => res.render('new-book', { types: ['Academic', 'Fiction', 'Non-Fiction'] }));
app.post('/books', (req, res) => {
  const { isbn, title, author, pages, type } = req.body;
  if (books.some(b => b.isbn === isbn)) return res.status(400).send('ISBN exists');
  books.push({ isbn, title, author, pages, type });
  res.redirect('/books/success');
});

app.get('/users', (req, res) => res.render('users', { users }));
app.get('/users/new', (req, res) => res.render('new-user'));
app.post('/users', (req, res) => {
  const { id, name, surname, email, type } = req.body;
  if (users.some(u => u.id === id)) return res.status(400).send('User ID exists');
  users.push({ id, name, surname, email, type });
  res.redirect('/users/success');
});

app.get('/contact', (req, res) => res.render('contact'));
app.get('/books/success', (req, res) => res.render('success', { 
  message: 'Book submitted successfully',
  links: [{ url: '/books', text: 'Book Catalog' }]
}));
app.get('/users/success', (req, res) => res.render('success', {
  message: 'User submitted successfully',
  links: [
    { url: '/books', text: 'Book Catalog' },
    { url: '/users', text: 'User List' }
  ]
}));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));