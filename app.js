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
  console.log('\n--- POST /books ---'); // Log 1: Handler entry
  console.log('Received req.body:', req.body); // Log 2: Incoming data
  const { isbn, title, author, pages, type } = req.body;
  // Basic validation added
  if (!isbn || !title) {
      console.error('Missing required book fields (ISBN, Title)');
      return res.status(400).send('Missing required book fields (ISBN, Title)');
  }
  // Duplicate check with logging
  if (books.some(b => b.isbn === isbn)) {
      console.warn(`Duplicate ISBN detected: ${isbn}`);
      return res.status(400).send('ISBN already exists');
  }
  const newBook = { isbn, title, author, pages: parseInt(pages) || 0, type }; // Ensure pages is a number
  console.log('Attempting to add book:', newBook); // Log 3: Data before push
  try {
    books.push(newBook);
    console.log('Book added successfully. Total books:', books.length); // Log 4: Confirmation
    res.redirect('/books/success');
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Internal server error while adding book.");
  }
});

app.get('/users', (req, res) => res.render('users', { users }));
app.get('/users/new', (req, res) => res.render('new-user'));
app.post('/users', (req, res) => {
  console.log('\n--- POST /users ---'); // Log 1: Handler entry
  console.log('Received req.body:', req.body); // Log 2: Incoming data
  const { id, name, surname, email, type } = req.body;
  // Basic validation added
   if (!id || !name || !email) {
      console.error('Missing required user fields (ID, Name, Email)');
      return res.status(400).send('Missing required user fields (ID, Name, Email)');
  }
   // Duplicate check with logging
  if (users.some(u => u.id === id)) {
      console.warn(`Duplicate User ID detected: ${id}`);
      return res.status(400).send('User ID already exists');
  }
  const newUser = { id, name, surname, email, type };
  console.log('Attempting to add user:', newUser); // Log 3: Data before push
  try {
    users.push(newUser);
    console.log('User added successfully. Total users:', users.length); // Log 4: Confirmation
    res.redirect('/users/success');
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal server error while adding user.");
  }
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