// Script connecting frontend to backend
const API_BASE = "http://127.0.0.1:5000";

// ==========================
// LOAD TASKS
// ==========================
async function loadTasks() {
    const token = localStorage.getItem("authToken");
    const uid  = token.split("_")[1]
    //console.log("uid", uid)

    // Prevent adding task if user is not logged in
    if (!token) {
        alert("You must log in first.");
        window.location.href = "login.html";
        return;
    }
    //console.log("userid:",uid)
    try {
        const response = await fetch(`${API_BASE}/tasks/${uid}`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        if (!response.ok) {
            alert("Failed to load tasks.");
            return;
        }

        const tasks = await response.json();
        renderTasks(tasks);

    } catch (err) {
        console.error(err);
    }
}


// ==========================
// ADD NEW TASK
// ==========================
async function addTask() {
    console.log("Calling Add Task Function")
    const token = localStorage.getItem("authToken");
    const uid  = token.slice(-1)
    const taskInput = document.getElementById("taskInput");
    const value = taskInput.value.trim();
    if (!value) {
        alert("Task cannot be empty.");
    return;
}
    console.log("userid:",uid, "task:", value)

    try {
        const response = await fetch(`${API_BASE}/add_task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                user_id: uid,
                task: value })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || "Failed to add task.");
            return;
        }
        else {
        document.getElementById("taskInput").value = "";
        loadTasks();
        }
    } catch (error) {
        alert("Could not add task. Check server.");
    }
}

// ==========================
// DELETE A TASK
// ==========================
async function deleteTask(id) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: "DELETE",
            headers: { "Authorization": token }
        });

        if (!response.ok) {
            alert("Failed to delete task.");
            return;
        }

        loadTasks();

    } catch (error) {
        console.error("Delete task error:", error);
        alert("Error deleting task.");
    }
}


// ==========================
// TOGGLE COMPLETE
// ==========================
async function completeTask(id) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`${API_BASE}/tasks/${id}/complete`, {
            method: "PUT",
            headers: { "Authorization": token }
        });

        if (!response.ok) {
            alert("Could not update task.");
            return;
        }

        loadTasks();

    } catch (error) {
        console.error("Complete task error:", error);
        alert("Error updating task.");
    }
}



// ==========================
// RENDER TASKS IN UI
// ==========================
function renderTasks(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        // show completed styling
        const text = document.createElement("span");
        text.textContent = task.task;
        if (task.is_completed && task.is_completed !== 0) {
            text.style.textDecoration = "line-through";
            text.style.opacity = "0.6";
        }

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "✖";
        delBtn.style.backgroundColor = "red";
        delBtn.style.color = "white";
        delBtn.style.position = 'absolute';
        delBtn.style.right = '6px';
        delBtn.style.top = '3px';
        delBtn.onclick = () => deleteTask(task.id);

        // Complete button
        const compBtn = document.createElement("button");
        compBtn.textContent = "✔";
        compBtn.style.backgroundColor = "light-green";
        compBtn.style.color = "white";
        //compBtn.style.float = 'right';
        compBtn.style.position = 'absolute';
        compBtn.style.right = '55px';
        compBtn.style.top = '3px';
        compBtn.onclick = () => completeTask(task.id);

        li.appendChild(text);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(compBtn);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

function showWelcomeMessage() {
    const tmp = localStorage.getItem("username");
    const name = capitalizeName(tmp);
    if (name) {
        document.getElementById("welcomeText").textContent = `Welcome back, ${name}!`;
    }
}

function capitalizeName(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}


// Auto-load tasks when page opens
//window.onload = loadTasks;
window.onload = () => {
    showWelcomeMessage();
    loadTasks();
};


// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
}

// CONNECT LOGOUT BUTTON
document.getElementById("logoutBtn").onclick = logout;