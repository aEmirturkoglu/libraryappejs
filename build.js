const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const distDir = path.join(__dirname, 'dist');

// Function to render EJS template to HTML
const renderEjsToHtml = (templatePath, outputPath, data = {}) => {
  try {
    const template = fs.readFileSync(templatePath, 'utf8');
    const renderedHtml = ejs.render(template, { ...data, filename: templatePath });
    fs.writeFileSync(outputPath, renderedHtml);
    console.log(`Rendered ${templatePath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error rendering ${templatePath}:`, error);
  }
};

// Define data for EJS templates
const books = [];
const users = [];
const types = ['Academic', 'Fiction', 'Non-Fiction'];
const successMessage = 'Submitted successfully';
const bookCatalogLink = { url: '/books', text: 'Book Catalog' };
const userListLink = { url: '/users', text: 'User List' };

// Get all EJS files in the views directory
const ejsFiles = fs.readdirSync(viewsDir).filter(file => file.endsWith('.ejs'));

// Render each EJS file to HTML
ejsFiles.forEach(ejsFile => {
  const templatePath = path.join(viewsDir, ejsFile);
  const outputPath = path.join(distDir, ejsFile.replace('.ejs', '.html'));
  let data = {};

  // Pass data to specific templates
  if (ejsFile === 'books.ejs') {
    data = { books };
  } else if (ejsFile === 'new-book.ejs') {
    data = { types };
  } else if (ejsFile === 'success.ejs') {
    data = { message: successMessage, links: [bookCatalogLink] };
  } else if (ejsFile === 'users.ejs') {
    data = { users };
  }

  renderEjsToHtml(templatePath, outputPath, data);
});

// Copy app.js to dist directory
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(distDir, 'app.js'));
console.log('Copied app.js to dist directory');