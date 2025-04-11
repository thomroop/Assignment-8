
const taskInput = document.getElementById("task-input");   // Get references to  HTML elements by their id. the input field where you type tasks
const taskList = document.getElementById("task-list");      // the <ul> or <ol> element where tasks will appear.
const allBtn = document.getElementById("all-btn");           // All these are filter buttons to show all, only active, or only completed task
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];     // Load tasks from local storage. localStorage.getItem("tasks") gets the saved tasks as a string.
                                                                 //JSON.parse(...) converts the string back to an array.If there’s nothing in storage, it uses an empty array [].
                       
function saveTasks() {                                           //This function saves the current tasks array to local storage.JSON.stringify(tasks) converts the array into a string format.
    localStorage.setItem("tasks", JSON.stringify(tasks));         //localStorage.setItem(...) stores it using the key "tasks".
}

                                                                  
function createTaskElement(task) {                               //This function takes a task object and creates a corresponding HTML element.
    const li = document.createElement("li");                     //Creates a new <li> item to hold the task.
    li.classList.add("list-group-item", "task-item");             // Adds Bootstrap classes (or custom CSS classes) to style the task item.
    li.classList.toggle("completed", task.completed);            //If the task is marked completed, adds the completed Sets the inner content of the task:
    
    li.innerHTML = `                                              
        <span class="task-text">${task.text}</span>              
        <div>
            <button class="btn btn-success btn-sm complete-btn">Complete</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>
    `;                                                                            //Sets the inner content of the task, Shows task text, Adds Complete and Delete buttons.

    li.querySelector(".complete-btn").addEventListener("click", () => {               
        task.completed = !task.completed;                                        
        saveTasks();
        renderTasks();
    });                                                                            //Adds a click event to the "Complete" button.Toggles the task's completed status,Saves the updated list.
                                                                    
                                                                                   
    // Delete task button Adds a click event to the "Delete" button, Removes the task from the array.
    li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        renderTasks();
    });

    return li; //Returns the fully constructed <li> element to be added to the list.
}

   // Render tasks to the task list, Clears the current task list before adding tasks again, Filters tasks based on the selected filter
function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => {
        if (filter === "all") return true;
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
    });

   //For each filtered task, create its DOM element and add it to the list.
    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}

// Add new task, When the Add button is clicked.Gets the task text and trims whitespace,f the input is not empty, creates a new task object,Adds it to the array.Clears the input field
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
});

// Task filtering buttons, Each button calls renderTasks() with the respective filter value.
allBtn.addEventListener("click", () => renderTasks("all"));
activeBtn.addEventListener("click", () => renderTasks("active"));
completedBtn.addEventListener("click", () => renderTasks("completed"));

// Initial render, Calls renderTasks() when the page loads to show existing tasks from storage.
renderTasks();
