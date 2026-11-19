
-- =====================================================
-- HOSTELCARE
-- Hostel Complaint Management System
-- Database: MySQL 8
-- =====================================================

-- Run using:
-- mysql -u root -p < schema.sql


-- =====================================================
-- 1. CREATE DATABASE
-- =====================================================

CREATE DATABASE IF NOT EXISTS hostelcare;

USE hostelcare;


-- =====================================================
-- 2. HOSTELS TABLE
-- =====================================================

CREATE TABLE Hostels (
    hostel_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    type ENUM('Boys', 'Girls', 'Co-ed') NOT NULL,
    total_floors INT DEFAULT 1
);


-- =====================================================
-- 3. ROOMS TABLE
-- =====================================================

CREATE TABLE Rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    floor INT,
    capacity INT DEFAULT 3,

    UNIQUE(hostel_id, room_number),

    FOREIGN KEY (hostel_id)
        REFERENCES Hostels(hostel_id)
);


-- =====================================================
-- 4. USERS TABLE
-- =====================================================

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('student', 'warden', 'staff') NOT NULL,

    roll_no VARCHAR(20),
    phone VARCHAR(15),
    department VARCHAR(40),
    specialization VARCHAR(40),

    room_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id)
        REFERENCES Rooms(room_id)
);


-- =====================================================
-- 5. COMPLAINTS TABLE
-- =====================================================

CREATE TABLE Complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,
    room_id INT NOT NULL,

    category VARCHAR(30) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,

    priority ENUM('Low', 'Medium', 'High', 'Urgent')
        DEFAULT 'Medium',

    status ENUM(
        'Submitted',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
        'Rejected',
        'Reopened'
    ) DEFAULT 'Submitted',

    rating TINYINT NULL CHECK(rating BETWEEN 1 AND 5),

    feedback VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,

    FOREIGN KEY (student_id)
        REFERENCES Users(user_id),

    FOREIGN KEY (room_id)
        REFERENCES Rooms(room_id)
);


-- =====================================================
-- 6. ASSIGNMENTS TABLE
-- =====================================================

CREATE TABLE Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,

    complaint_id INT NOT NULL,
    staff_id INT NOT NULL,
    assigned_by INT NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (complaint_id)
        REFERENCES Complaints(complaint_id),

    FOREIGN KEY (staff_id)
        REFERENCES Users(user_id),

    FOREIGN KEY (assigned_by)
        REFERENCES Users(user_id)
);


-- =====================================================
-- 7. COMPLAINT HISTORY TABLE
-- =====================================================

CREATE TABLE Complaint_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,

    complaint_id INT NOT NULL,
    status VARCHAR(20),
    note VARCHAR(255),
    changed_by INT,

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (complaint_id)
        REFERENCES Complaints(complaint_id)
);


-- =====================================================
-- 8. NOTICES TABLE
-- =====================================================

-- Extra module used by the prototype

CREATE TABLE Notices (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(120),
    body TEXT,

    audience ENUM(
        'All',
        'Gayatri Hostel',
        'Vivekanand Hostel'
    ) DEFAULT 'All',

    posted_by INT,

    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 9. OUTPASSES TABLE
-- =====================================================

CREATE TABLE Outpasses (
    outpass_id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT,

    type ENUM(
        'Day Out',
        'Night Out',
        'Leave'
    ),

    from_date DATE,
    to_date DATE,

    reason VARCHAR(200),

    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',

    FOREIGN KEY (student_id)
        REFERENCES Users(user_id)
);


-- =====================================================
-- 10. MAINTENANCE TASKS TABLE
-- =====================================================

CREATE TABLE Maintenance_Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(120),

    staff_id INT,
    hostel_id INT,

    due_date DATE,
    frequency VARCHAR(20),

    status ENUM(
        'Scheduled',
        'In Progress',
        'Done'
    ) DEFAULT 'Scheduled',

    FOREIGN KEY (staff_id)
        REFERENCES Users(user_id),

    FOREIGN KEY (hostel_id)
        REFERENCES Hostels(hostel_id)
);


-- =====================================================
-- 11. INDEXES
-- =====================================================

CREATE INDEX idx_c_status
ON Complaints(status);

CREATE INDEX idx_c_student
ON Complaints(student_id);


-- =====================================================
-- 12. SAMPLE REPORT
-- Average resolution time by category
-- =====================================================

SELECT
    category,
    COUNT(*) AS total,

    ROUND(
        AVG(DATEDIFF(resolved_at, created_at)),
        1
    ) AS avg_days

FROM Complaints

WHERE resolved_at IS NOT NULL

GROUP BY category;


-- =====================================================
-- 13. SEED ESSENTIALS
-- Matches the demo
-- =====================================================

-- Insert hostels

INSERT INTO Hostels (
    name,
    type,
    total_floors
)
VALUES
    ('Gayatri Hostel', 'Girls', 4),
    ('Vivekanand Hostel', 'Boys', 3);


-- Insert rooms

INSERT INTO Rooms (
    hostel_id,
    room_number,
    floor,
    capacity
)
VALUES
    (1, '426', 4, 3);


-- Insert student

INSERT INTO Users (
    name,
    email,
    password_hash,
    role,
    roll_no,
    department,
    room_id
)
VALUES (
    'Aduita',
    'aduita@hostelcare.edu',
    'demo',
    'student',
    '206',
    'CSE',
    1
);


-- Insert warden

INSERT INTO Users (
    name,
    email,
    password_hash,
    role
)
VALUES (
    'Sukriti Chauhan',
    'sukriti.chauhan@hostelcare.edu',
    'demo',
    'warden'
);


-- =====================================================
-- END OF HOSTELCARE DATABASE SCHEMA
-- =====================================================
