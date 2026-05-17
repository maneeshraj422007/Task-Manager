import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TaskManager from "./pages/TaskManager";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/Task-Manager">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;