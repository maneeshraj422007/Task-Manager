require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* ================== DATABASE ================== */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ================== MODELS ================== */

// Task Model
const taskSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false },
    userId: String
});

const Task = mongoose.model("Task", taskSchema);

// User Model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

/* ================== AUTH MIDDLEWARE ================== */

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

/* ================== AUTH ROUTES ================== */

// Signup
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword
    });

    await user.save();

    res.json({ message: "User created successfully" });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token });
});

/* ================== TASK ROUTES (PROTECTED) ================== */

// Get tasks (ONLY USER TASKS)
app.get("/tasks", auth, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
});

// Add task
app.post("/tasks", auth, async (req, res) => {
    const newTask = new Task({
        text: req.body.text,
        userId: req.userId
    });

    await newTask.save();
    res.json(newTask);
});

// Toggle task
app.put("/tasks/:id", auth, async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        userId: req.userId
    });

    if (!task) return res.status(404).json({ message: "Not found" });

    task.completed = !task.completed;
    await task.save();

    res.json(task);
});

// Delete task
app.delete("/tasks/:id", auth, async (req, res) => {
    await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
    });

    res.json({ message: "Deleted" });
});

/* ================== SERVER ================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});