require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_DATABASE || 'mydatabase'
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        await connection.end();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));