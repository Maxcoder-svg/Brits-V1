const express = require('express');
const mariadb = require('mariadb');
const app = express();
const port = 3000;

// Create MariaDB connection pool
const pool = mariadb.createPool({
    host: '192.168.1.102',
    user: 'myuser',
    password: 'mypassword',
    database: 'brits_academy',
    connectionLimit: 5
});

// Middleware
app.use(express.json());

// Get all students
app.get('/api/students', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM students ORDER BY enrollment_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const [totalStudents] = await conn.query(
            'SELECT COUNT(*) AS count FROM students'
        );
        
        const [totalRevenue] = await conn.query(
            'SELECT SUM(amount) AS total FROM students WHERE payment_status = "Paid"'
        );
        
        const [pendingPayments] = await conn.query(
            'SELECT COUNT(*) AS count FROM students WHERE payment_status = "Pending"'
        );
        
        const [activeCourses] = await conn.query(
            'SELECT COUNT(DISTINCT course) AS count FROM students'
        );
        
        res.json({
            totalStudents: totalStudents.count,
            totalRevenue: totalRevenue.total || 0,
            pendingPayments: pendingPayments.count,
            activeCourses: activeCourses.count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM courses');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});

// Mark payment as paid
app.patch('/api/students/:id/mark-paid', async (req, res) => {
    const studentId = req.params.id;
    let conn;
    
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            'UPDATE students SET payment_status = "Paid" WHERE id = ?',
            [studentId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json({ message: 'Payment status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
    const studentId = req.params.id;
    let conn;
    
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            'DELETE FROM students WHERE id = ?',
            [studentId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});