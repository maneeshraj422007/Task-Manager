const API_URL = "https://task-manager-dlkw.onrender.com/tasks";

let currentFilter = "all";

window.onload = function () {
    loadTasks();

    document.getElementById("taskInput").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });
};

// Load tasks
async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => createTask(task));
    updateDashboard();
}

// Add task
async function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();
    let warning = document.getElementById("warningMsg");

    if (text === "") return;

    const res = await fetch(API_URL);
    const tasks = await res.json();

    let exists = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());

    if (exists) {
        warning.innerHTML = "⚠️ Task already listed";
        warning.style.opacity = "1";

        setTimeout(() => {
            warning.style.opacity = "0";
        }, 2000);

        return;
    }

    warning.style.opacity = "0";

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    input.value = "";
    loadTasks();
}

// Create task
function createTask(task) {
    let li = document.createElement("li");

    li.classList.add("fade-in");

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <span>${task.text}</span>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    `;

    li.addEventListener("click", async function (e) {
        if (e.target.closest(".delete-btn")) return;

        await fetch(`${API_URL}/${task._id}`, { method: "PUT" });
        loadTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", function (e) {
        e.stopPropagation();

        li.classList.add("slide-out");

        setTimeout(async () => {
            await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
            loadTasks();
        }, 300);
    });

    document.getElementById("taskList").appendChild(li);
}

// Search
function filterTasks() {
    let searchText = document.getElementById("searchInput").value.toLowerCase();

    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector("span").innerText.toLowerCase();
        li.style.display = text.includes(searchText) ? "flex" : "none";
    });
}

// Filter
function setFilter(filter, event) {
    currentFilter = filter;

    document.querySelectorAll(".filter-section button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    document.querySelectorAll("#taskList li").forEach(li => {
        if (filter === "all") li.style.display = "flex";
        else if (filter === "completed" && li.classList.contains("completed")) li.style.display = "flex";
        else if (filter === "pending" && !li.classList.contains("completed")) li.style.display = "flex";
        else li.style.display = "none";
    });
}

// Dashboard
function updateDashboard() {
    let total = document.querySelectorAll("#taskList li").length;
    let completed = document.querySelectorAll("#taskList li.completed").length;
    let pending = total - completed;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
}

// Toggle search
function toggleSearch() {
    const container = document.querySelector(".container");

    container.classList.toggle("search-active");

    const icon = document.querySelector(".search-btn i");

    if (container.classList.contains("search-active")) {
        icon.classList.replace("fa-magnifying-glass", "fa-xmark");
    } else {
        icon.classList.replace("fa-xmark", "fa-magnifying-glass");

        document.getElementById("searchInput").value = "";
        filterTasks();
    }
}