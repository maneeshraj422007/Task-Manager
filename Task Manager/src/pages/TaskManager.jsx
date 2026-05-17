import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import Dashboard from "../components/Dashboard";
import Filters from "../components/Filters";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import Warning from "../components/Warning";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [warning, setWarning] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!text.trim()) return;

    const exists = tasks.some(
      (task) => task.text.toLowerCase() === text.toLowerCase()
    );

    if (exists) {
      setWarning("⚠️ Task already exists");

      setTimeout(() => {
        setWarning("");
      }, 2000);

      return;
    }

    await API.post("/tasks", { text });

    setText("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  };

  const toggleTask = async (id) => {
    await API.put(`/tasks/${id}`);
    loadTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "completed") {
      return task.completed && matchesSearch;
    }

    if (filter === "pending") {
      return !task.completed && matchesSearch;
    }

    return matchesSearch;
  });

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <TaskInput
        text={text}
        setText={setText}
        addTask={addTask}
        search={search}
        setSearch={setSearch}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      <Filters filter={filter} setFilter={setFilter} />

      <Dashboard
        total={total}
        completed={completed}
        pending={pending}
      />

      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />

      <Warning warning={warning} />

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default TaskManager;