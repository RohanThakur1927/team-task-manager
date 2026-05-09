const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(express.json());

// CORS

app.use(
  cors({
    origin:
      "https://team-task-manager-three-delta.vercel.app",
    credentials: true,
  })
);

// SESSION

app.use(
  session({
    secret: "teamtasksecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);

// DATABASE

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// CREATE USERS TABLE

pool.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
`);

// CREATE TASKS TABLE

pool.query(`
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL
)
`);

// REGISTER

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please enter email and password",
      });
    }

    // CHECK EXISTING USER

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // INSERT USER

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
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

// LOGIN

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // CHECK PASSWORD

    const validPassword =
      await bcrypt.compare(
        password,
        user.rows[0].password
      );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // SESSION

    req.session.user = {
      id: user.rows[0].id,
      email: user.rows[0].email,
    };

    res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// GET TASKS

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

// ADD TASK

app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *",
      [title, status]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
});

// DELETE TASK

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id=$1",
      [id]
    );

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    console.log(err);
  }
});

// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});