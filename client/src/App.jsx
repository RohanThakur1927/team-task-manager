import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://team-task-manager-production-cebb.up.railway.app";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Todo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  // FETCH TASKS

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // REGISTER

  const register = async () => {
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  // LOGIN

  const login = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  // ADD TASK

  const addTask = async () => {
    if (!title) return;

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          status,
        }),
      });

      const data = await res.json();

      setTasks([data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // COUNTS

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todo = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* SIDEBAR */}

      <div className="sidebar">
        <h1 className="logo">
          Team Task
          <br />
          Manager
        </h1>

        <button>📊 Dashboard</button>

        <button
          onClick={() =>
            alert("Saved Tasks feature coming soon")
          }
        >
          ✅ Saved Tasks
        </button>

        <button
          onClick={() =>
            alert(email || "Guest User")
          }
        >
          👤 Profile
        </button>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          ⚙ Settings
        </button>

        {/* PROFILE */}

        <div className="profile-card">
          <h3>Guest User</h3>

          <p>
            {email || "guest@gmail.com"}
          </p>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode
              ? "☀ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div className="main">
        {/* TOPBAR */}

        <div className="topbar">
          <div className="topbar-left">
            <h1>👋 Welcome Back</h1>

            <p>
              Manage your tasks efficiently
            </p>
          </div>

          {/* AUTH */}

          <div className="auth-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button onClick={register}>
              Register
            </button>

            <button onClick={login}>
              Login
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="stats">
          <div className="card">
            <h2>Total Tasks</h2>
            <p>{tasks.length}</p>
          </div>

          <div className="card">
            <h2>Completed</h2>
            <p>{completed}</p>
          </div>

          <div className="card">
            <h2>In Progress</h2>
            <p>{progress}</p>
          </div>

          <div className="card">
            <h2>Todo</h2>
            <p>{todo}</p>
          </div>
        </div>

        {/* ADD TASK */}

        <div className="task-form">
          <h2>Add New Task</h2>

          <div className="task-inputs">
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>Todo</option>

              <option>
                In Progress
              </option>

              <option>
                Completed
              </option>
            </select>

            <button onClick={addTask}>
              Add Task
            </button>
          </div>
        </div>

        {/* TASKS */}

        <div className="tasks-container">
          <h2>Task Board</h2>

          <div className="tasks-grid">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
              >
                <h3>{task.title}</h3>

                <p>
                  Status: {task.status}
                </p>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;