const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Page load hone par localStorage se tasks load karna
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task button click event
addBtn.addEventListener('click', addTask);

// Enter key press karne par bhi task add ho jaye
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Kripya task enter karein!');
        return;
    }

    const taskObj = { text: text };
    createTaskElement(taskObj);
    saveTaskToStorage(taskObj);

    taskInput.value = '';
}

function createTaskElement(taskObj) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskObj.text;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    // Delete functionality
    deleteBtn.addEventListener('click', function () {
        li.remove();
        removeTaskFromStorage(taskObj.text);
    });

    // Inline Edit functionality (box ke andar hi edit karne ke liye)
    editBtn.addEventListener('click', function () {
        if (editBtn.textContent === 'Edit') {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = span.textContent;

            // Span ko input se replace karna
            li.replaceChild(editInput, span);
            editInput.focus();

            editBtn.textContent = 'Save';

            // Input me Enter dabane par save ho jaye
            editInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    saveChanges();
                }
            });

            // Save button click hone par
            editBtn.onclick = function () {
                if (editBtn.textContent === 'Save') {
                    saveChanges();
                }
            };

            function saveChanges() {
                const newText = editInput.value.trim();
                if (newText === '') {
                    alert('Task khali nahi ho sakta!');
                    return;
                }

                const oldText = taskObj.text;
                taskObj.text = newText;
                span.textContent = newText;

                // Input ko wapas span se replace karna
                li.replaceChild(span, editInput);
                editBtn.textContent = 'Edit';

                // Event listener reset karna taaki agli baar fir se edit chal sake
                editBtn.onclick = null;

                updateTaskInStorage(oldText, newText);
            }
        }
    });

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);

    taskList.appendChild(li);
}

// --- LocalStorage Helper Functions ---

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTaskToStorage(taskObj) {
    const tasks = getTasksFromStorage();
    tasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => createTaskElement(task));
}

function removeTaskFromStorage(taskText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(oldText, newText) {
    let tasks = getTasksFromStorage();
    const task = tasks.find(t => t.text === oldText);
    if (task) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}