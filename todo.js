document.addEventListener("DOMContentLoaded", function() {
    const todoList = document.getElementById("todo-list");
    const taskInput = document.getElementById("task-input");
    const allTab = document.getElementById("all-tab");
    const activeTab = document.getElementById("active-tab");
    const addTaskBtn = document.getElementById("add-task-btn");
    const completedTab = document.getElementById("completed-tab");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    function renderTasks() {
        todoList.innerHTML = "";
        tasks.forEach(function(task, index) {
            const listItem = document.createElement("div");
            listItem.className = "task-item";
            if (task.completed) {
                listItem.classList.add("completed"); // Add completed class if task is completed
            }
            listItem.innerHTML = `
                <input type="checkbox" class="mr-2" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            `;
            if (task.completed) {
                listItem.innerHTML += `<i class="fa-solid fa-trash ml-2 delete-task"></i>`;
            }
            todoList.appendChild(listItem);
    
            // Add event listener to task item
            listItem.addEventListener("click", function(event) {
                // Check if the click occurred on the checkbox or the delete icon
                if (!event.target.matches(".delete-task")) {
                    const checkbox = listItem.querySelector("input[type='checkbox']");
                    checkbox.checked = !checkbox.checked; // Toggle checkbox state
                    completeTask(index); // Update task completion status
                }
            });
        });
    }


    renderTasks();

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask(text) {
        tasks.push({ text: text, completed: false });
        saveTasks();
        renderTasks();
    }

    function completeTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
        }
    });

    addTaskBtn.addEventListener("click", function() {
        if (taskInput.value.trim() !== "") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
        }
    });


    todoList.addEventListener("change", function(event) {
        if (event.target.type === "checkbox") {
            const index = Array.from(todoList.children).indexOf(event.target.parentNode);
            completeTask(index);
        }
    });

    todoList.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-task")) {
            const index = Array.from(todoList.children).indexOf(event.target.parentNode);
            deleteTask(index);
        }
    });

    allTab.addEventListener("click", function() {
        allTab.classList.add("active");
        activeTab.classList.remove("active");
        completedTab.classList.remove("active");
        renderTasks();
    });

    activeTab.addEventListener("click", function() {
        allTab.classList.remove("active");
        activeTab.classList.add("active");
        completedTab.classList.remove("active");
        const activeTasks = tasks.filter(task => !task.completed);
        todoList.innerHTML = "";
        activeTasks.forEach(function(task) {
            const listItem = document.createElement("div");
            listItem.className = "task-item";
            listItem.innerHTML = `
                <input type="checkbox" class="mr-2">
                <span>${task.text}</span>
            `;
            todoList.appendChild(listItem);
        });
    });
    completedTab.addEventListener("click", function() {
        allTab.classList.remove("active");
        activeTab.classList.remove("active");
        completedTab.classList.add("active");
        const completedTasks = tasks.filter(task => task.completed);
        todoList.innerHTML = "";
        completedTasks.forEach(function(task) {
            const listItem = document.createElement("div");
            listItem.className = "task-item completed"; // Add completed class for completed tasks
            listItem.innerHTML = `
                <input type="checkbox" class="mr-2" checked> <!-- Ensure checkbox is checked for completed tasks -->
                <span>${task.text}</span>
                <i class="fa-solid fa-trash ml-2 delete-task"></i>
            `;
            todoList.appendChild(listItem);
        });
    });
    
    
});