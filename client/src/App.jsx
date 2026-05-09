import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [task, setTask] = useState("");

  const [status, setStatus] =
    useState("Todo");

  const [tasks, setTasks] = useState([]);

  // REGISTER
  const register = async () => {
    try {
      await axios.post(
        "http://localhost:5000/register",
        {
          email,
          password
        }
      );

      alert("Registered Successfully!");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  // LOGIN
  const login = async () => {
    try {
      await axios.post(
        "team-task-manager.railway.internal",
        {
          email,
          password
        }
      );

      alert("Login Successful!");
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  // ADD TASK
  const addTask = async () => {
    if (!task) return;

    try {
      await axios.post(
        "team-task-manager.railway.internal/tasks",
        {
          title: task,
          status
        }
      );

      setTask("");
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Task creation failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `team-task-manager.railway.internal/tasks/${id}`
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "team-task-manager.railway.internal/tasks"
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const theme = {
    background: darkMode
      ? "#0f172a"
      : "#f1f5f9",

    sidebar: darkMode
      ? "#111827"
      : "#ffffff",

    card: darkMode
      ? "#1e293b"
      : "#ffffff",

    text: darkMode
      ? "#ffffff"
      : "#0f172a",

    subtext: darkMode
      ? "#cbd5e1"
      : "#475569",

    input: darkMode
      ? "#334155"
      : "#e2e8f0"
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: theme.background,
        color: theme.text,
        fontFamily: "Arial"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: theme.sidebar,
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            "space-between",

          borderRight: darkMode
            ? "1px solid #334155"
            : "1px solid #cbd5e1"
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              lineHeight: "40px",
              marginBottom: "40px",
              color: theme.text
            }}
          >
            Team Task
            <br />
            Manager
          </h1>

          {/* MENU */}
          <div
            onClick={() =>
              setActiveMenu(
                "dashboard"
              )
            }
            style={{
              ...menuItem,
              background:
                activeMenu ===
                "dashboard"
                  ? "#3b82f6"
                  : "#334155"
            }}
          >
            📊 Dashboard
          </div>

          <div
            onClick={() =>
              setActiveMenu("tasks")
            }
            style={{
              ...menuItem,
              background:
                activeMenu ===
                "tasks"
                  ? "#3b82f6"
                  : "#334155"
            }}
          >
            ✅ Saved Tasks
          </div>

          <div
            onClick={() =>
              setActiveMenu(
                "profile"
              )
            }
            style={{
              ...menuItem,
              background:
                activeMenu ===
                "profile"
                  ? "#3b82f6"
                  : "#334155"
            }}
          >
            👤 Profile
          </div>

          <div
            onClick={() =>
              setActiveMenu(
                "settings"
              )
            }
            style={{
              ...menuItem,
              background:
                activeMenu ===
                "settings"
                  ? "#3b82f6"
                  : "#334155"
            }}
          >
            ⚙️ Settings
          </div>
        </div>

        {/* PROFILE CARD */}
        <div
          style={{
            background: theme.card,
            padding: "20px",
            borderRadius: "16px"
          }}
        >
          <h3>
            {email || "Guest User"}
          </h3>

          <p
            style={{
              color: theme.subtext
            }}
          >
            {email ||
              "guest@gmail.com"}
          </p>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          padding: "40px"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",

            alignItems: "center",

            flexWrap: "wrap",

            gap: "20px",

            marginBottom: "40px"
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "42px",
                color: theme.text
              }}
            >
              Welcome Back 👋
            </h1>

            <p
              style={{
                color:
                  theme.subtext
              }}
            >
              Manage your tasks
              efficiently
            </p>
          </div>

          {/* AUTH */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                background:
                  theme.input,
                color: theme.text
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                background:
                  theme.input,
                color: theme.text
              }}
            />

            <button
              onClick={register}
              style={buttonStyle}
            >
              Register
            </button>

            <button
              onClick={login}
              style={buttonStyle}
            >
              Login
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        {activeMenu ===
          "dashboard" && (
          <>
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",

                gap: "20px",

                marginBottom:
                  "40px"
              }}
            >
              <DashboardCard
                title="Total Tasks"
                value={tasks.length}
                bg={theme.card}
                color={
                  theme.text
                }
              />

              <DashboardCard
                title="Completed"
                value={
                  tasks.filter(
                    (t) =>
                      t.status ===
                      "Done"
                  ).length
                }
                bg={theme.card}
                color={
                  theme.text
                }
              />

              <DashboardCard
                title="In Progress"
                value={
                  tasks.filter(
                    (t) =>
                      t.status ===
                      "In Progress"
                  ).length
                }
                bg={theme.card}
                color={
                  theme.text
                }
              />

              <DashboardCard
                title="Todo"
                value={
                  tasks.filter(
                    (t) =>
                      t.status ===
                      "Todo"
                  ).length
                }
                bg={theme.card}
                color={
                  theme.text
                }
              />
            </div>

            {/* ADD TASK */}
            <div
              style={{
                background:
                  theme.card,

                padding: "30px",

                borderRadius:
                  "20px"
              }}
            >
              <h2>
                Add New Task
              </h2>

              <div
                style={{
                  display:
                    "flex",

                  gap: "15px",

                  marginTop:
                    "20px",

                  flexWrap:
                    "wrap"
                }}
              >
                <input
                  placeholder="Enter task title"
                  value={task}
                  onChange={(e) =>
                    setTask(
                      e.target
                        .value
                    )
                  }
                  style={{
                    ...inputStyle,
                    flex: 1,
                    minWidth:
                      "250px",

                    background:
                      theme.input,

                    color:
                      theme.text
                  }}
                />

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target
                        .value
                    )
                  }
                  style={{
                    ...inputStyle,

                    background:
                      theme.input,

                    color:
                      theme.text
                  }}
                >
                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>
                </select>

                <button
                  onClick={
                    addTask
                  }
                  style={
                    buttonStyle
                  }
                >
                  Add Task
                </button>
              </div>
            </div>
          </>
        )}

        {/* TASKS */}
        {activeMenu ===
          "tasks" && (
          <div>
            <h2
              style={{
                marginBottom:
                  "20px"
              }}
            >
              Saved Tasks
            </h2>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(300px,1fr))",

                gap: "20px"
              }}
            >
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background:
                      theme.card,

                    padding:
                      "25px",

                    borderRadius:
                      "16px",

                    borderLeft:
                      t.status ===
                      "Done"
                        ? "8px solid #22c55e"
                        : t.status ===
                          "In Progress"
                        ? "8px solid #facc15"
                        : "8px solid #3b82f6"
                  }}
                >
                  <h2>
                    {t.title}
                  </h2>

                  <p
                    style={{
                      color:
                        theme.subtext,

                      marginTop:
                        "10px"
                    }}
                  >
                    Status:{" "}
                    {
                      t.status
                    }
                  </p>

                  <button
                    onClick={() =>
                      deleteTask(
                        t.id
                      )
                    }
                    style={{
                      marginTop:
                        "20px",

                      background:
                        "#ef4444",

                      border:
                        "none",

                      padding:
                        "10px 15px",

                      borderRadius:
                        "10px",

                      color:
                        "white",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeMenu ===
          "profile" && (
          <div
            style={{
              background:
                theme.card,

              padding: "40px",

              borderRadius:
                "20px"
            }}
          >
            <h1>
              Profile Details
            </h1>

            <p
              style={{
                marginTop:
                  "20px",

                fontSize:
                  "20px"
              }}
            >
              Email:{" "}
              {email ||
                "guest@gmail.com"}
            </p>

            <p
              style={{
                marginTop:
                  "10px",

                fontSize:
                  "20px"
              }}
            >
              Role: Member
            </p>
          </div>
        )}

        {/* SETTINGS */}
        {activeMenu ===
          "settings" && (
          <div
            style={{
              background:
                theme.card,

              padding: "40px",

              borderRadius:
                "20px"
            }}
          >
            <h1>Settings</h1>

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              style={{
                marginTop:
                  "20px",

                padding:
                  "15px 20px",

                border: "none",

                borderRadius:
                  "10px",

                background:
                  "#3b82f6",

                color:
                  "white",

                cursor:
                  "pointer",

                fontWeight:
                  "bold"
              }}
            >
              Switch to{" "}
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  bg,
  color
}) {
  return (
    <div
      style={{
        background: bg,
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center"
      }}
    >
      <h2
        style={{
          color
        }}
      >
        {title}
      </h2>

      <h1
        style={{
          fontSize: "45px",
          marginTop: "15px",
          color
        }}
      >
        {value}
      </h1>
    </div>
  );
}

const menuItem = {
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "bold",
  color: "white"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  minWidth: "180px",
  fontSize: "15px"
};

const buttonStyle = {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};