"use strict";
// src/index.ts
class ToDoApp {
    constructor() {
        this.tasks = [];
        this.taskListElement = document.getElementById('task-list');
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.loadTasks();
        this.taskForm.addEventListener('submit', (e) => this.addTask(e));
    }
    loadTasks() {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
            this.tasks.forEach((task) => this.renderTask(task));
        }
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    addTask(event) {
        event.preventDefault();
        const title = this.taskInput.value.trim();
        if (title === '')
            return;
        const newTask = {
            id: Date.now(),
            title,
            completed: false,
        };
        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTask(newTask);
        this.taskInput.value = '';
    }
    toggleTaskCompletion(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            const taskElement = document.getElementById(`task-${id}`);
            if (task.completed) {
                taskElement.classList.add('line-through', 'text-gray-500');
            }
            else {
                taskElement.classList.remove('line-through', 'text-gray-500');
            }
        }
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTasks();
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            this.taskListElement.removeChild(taskElement);
        }
    }
    renderTask(task) {
        const li = document.createElement('li');
        li.id = `task-${task.id}`;
        li.className = `flex items-center justify-between p-2 border rounded ${task.completed ? 'line-through text-gray-500' : ''}`;
        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;
        titleSpan.className = 'flex-1 cursor-pointer';
        titleSpan.addEventListener('click', () => this.toggleTaskCompletion(task.id));
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'text-red-500 hover:text-red-700';
        deleteButton.addEventListener('click', () => this.deleteTask(task.id));
        li.appendChild(titleSpan);
        li.appendChild(deleteButton);
        this.taskListElement.appendChild(li);
    }
}
// Initialize the To-Do App when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ToDoApp();
});
