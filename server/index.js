require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false
  })
);

// DATABASE
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false
  }
});

// ==============================
// REGISTER
// ==============================
app.post("/register", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users(email, password, role)
      VALUES($1,$2,$3)
    `,
      [
        email,
        hashedPassword,
        "member"
      ]
    );

    res.send("User registered");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Registration failed");
  }
});

// ==============================
// LOGIN
// ==============================
app.post("/login", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const result =
      await pool.query(
        `
      SELECT * FROM users
      WHERE email=$1
    `,
        [email]
      );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .send("User not found");
    }

    const user = result.rows[0];

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
      return res
        .status(400)
        .send("Wrong password");
    }

    req.session.user = user;

    res.send("Login successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("Login failed");
  }
});

// ==============================
// CREATE TASK
// ==============================
app.post("/tasks", async (req, res) => {
  try {
    const { title, status } =
      req.body;

    await pool.query(
      `
      INSERT INTO tasks(title, status)
      VALUES($1,$2)
    `,
      [title, status]
    );

    res.send("Task created");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Task creation failed");
  }
});

// ==============================
// GET TASKS
// ==============================
app.get("/tasks", async (req, res) => {
  try {
    const result =
      await pool.query(`
      SELECT * FROM tasks
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Failed to fetch tasks");
  }
});

// ==============================
// DELETE TASK
// ==============================
app.delete(
  "/tasks/:id",
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM tasks
        WHERE id=$1
      `,
        [req.params.id]
      );

      res.send("Task deleted");
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send("Delete failed");
    }
  }
);

// ==============================
// ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send(
    "Team Task Manager Backend Running 🚀"
  );
});

// ==============================
// START SERVER
// ==============================
app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});