const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to serve static files from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for the signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});