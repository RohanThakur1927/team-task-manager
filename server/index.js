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
    origin: [
      "http://localhost:5173",
      "https://team-task-manager-three-delta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true,
  })
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});


// ---------------- TEST ROUTE ----------------

app.get("/", (req, res) => {
  res.send("Team Task Manager Backend Running 🚀");
});


// ---------------- REGISTER ----------------

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, "member"]
    );

    res.json(newUser.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});


// ---------------- LOGIN ----------------

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }

    req.session.user = user.rows[0];

    res.json({
      message: "Login successful",
      user: user.rows[0],
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});


// ---------------- GET TASKS ----------------

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(tasks.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});


// ---------------- ADD TASK ----------------

app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    const newTask = await pool.query(
      "INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *",
      [title, status]
    );

    res.json(newTask.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});


// ---------------- DELETE TASK ----------------

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id=$1",
      [id]
    );

    res.json("Task deleted");

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});


// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});