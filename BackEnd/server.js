require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
});

const Task = mongoose.model("Task", taskSchema);

app.get("/tasks", async (req, res) => {
    res.json(await Task.find());
});

app.post("/tasks", async (req, res) => {
    const task = new Task({ text: req.body.text, completed: false });
    await task.save();
    res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});