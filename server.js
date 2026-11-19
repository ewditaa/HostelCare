
// ==========================================
// HOSTELCARE - HOSTEL COMPLAINT MANAGEMENT
// Backend: Node.js + Express
// Database: MySQL
// ==========================================

// 1. Import dependencies
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

// 2. Initialize Express application
const app = express();

app.use(cors());
app.use(express.json());

// 3. Validate environment variables
const requiredVariables = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME"
];

const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
    console.error(
        "Missing environment variables:",
        missingVariables.join(", ")
    );
    process.exit(1);
}

// 4. Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 5. Home route - Check whether API is running
app.get("/", (req, res) => {
    res.status(200).send("HostelCare API is running!");
});

// 6. Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HostelCare backend is running!"
    });
});

// 7. Test MySQL database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS databaseName"
        );

        res.status(200).json({
            success: true,
            message: "MySQL connected successfully!",
            database: rows[0].databaseName
        });

    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// 8. Handle unknown API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// 9. Start backend server
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
    console.log(`HostelCare API running on port ${PORT}`);
});

// 10. Export database pool for future API routes
module.exports = { app, pool };
