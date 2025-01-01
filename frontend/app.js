// Backend API URL
const API_URL = "http://localhost:5000/tasks";

// Get references to HTML elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Function to fetch tasks from the backend
async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks); // Render tasks on the UI
}

// Function to render tasks on the UI
function renderTasks(tasks) {
  taskList.innerHTML = ""; // Clear the task list
  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-task-btn">Delete</button>
      <button class="complete-task-btn">
        ${task.completed ? "Undo" : "Done"}
      </button>
    `;

    // Add event listener to delete the task
    taskItem.querySelector(".delete-task-btn").addEventListener("click", async () => {
      await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
      fetchTasks(); // Refresh the task list
    });

    // Add event listener to mark task as completed/undo
    taskItem.querySelector(".complete-task-btn").addEventListener("click", async () => {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks(); // Refresh the task list
    });

    taskList.appendChild(taskItem); // Add task to the list
  });
}

// Add a new task
addTaskBtn.addEventListener("click", async () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!"); // Alert if the input is empty
    return;
  }

  // Send the new task to the backend
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: taskText }),
  });

  taskInput.value = ""; // Clear the input field
  fetchTasks(); // Refresh the task list
});

// Fetch tasks when the page loads
fetchTasks();
