CREATE DATABASE IF NOT EXISTS brits_academy;
USE brits_academy;

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(100) NOT NULL,
    course_level VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    receipt_id VARCHAR(50) NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX idx_status ON payments(status);
CREATE INDEX idx_course ON payments(course);
CREATE INDEX idx_payment_date ON payments(payment_date);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(100) NOT NULL,
    course_level VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    schedule VARCHAR(50),
    receipt_id VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(50)
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    salary VARCHAR(50),
    completion_rate VARCHAR(50)
);

-- Insert course data
INSERT INTO courses (course_id, title, description, duration, salary, completion_rate) VALUES
('web-dev', 'Web Development Fundamentals', 'Learn HTML, CSS, and JavaScript to build modern, responsive websites...', '8 weeks', '$1,200+', '96%'),
('data-science', 'Data Science & Analytics', 'Master Python, statistics, and machine learning to extract valuable insights...', '12 weeks', '$1,500+', '92%'),
('graphics-design', 'GRAPHICS DESIGN & Architecture', 'Master the art of visually communicating ideas using typography, imagery...', '12 weeks', '$1,450+', '91%');
-- Add other courses similarly