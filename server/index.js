const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= DATABASE CONNECTION ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ Database error:", err));

/* ================= CREATE TABLES ================= */

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`);

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL
  );
`);

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

/* ---------- REGISTER ---------- */

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(email,password) VALUES($1,$2)",
      [email, hashedPassword]
    );

    res.json({
      message: "Registration successful",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Registration failed",
    });
  }
});

/* ---------- LOGIN ---------- */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

/* ---------- GET TASKS ---------- */

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

/* ---------- ADD TASK ---------- */

app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    await pool.query(
      "INSERT INTO tasks(title,status) VALUES($1,$2)",
      [title, status]
    );

    res.json({
      message: "Task added successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to add task",
    });
  }
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});