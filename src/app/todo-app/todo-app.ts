import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [FormsModule, NgClass, DatePipe],
  templateUrl: './todo-app.html',
  styleUrl: './todo-app.css',
})
export class TodoApp implements OnInit {
  newTask: TodoModel = new TodoModel();
  todoList: TodoModel[] = [];
  
  // Tracks whether the user is adding a new task or updating an old one
  isEditMode: boolean = false;

  ngOnInit() {
    // Load saved tasks from the browser when the app starts
    const localStorageData = localStorage.getItem('todoList');
    if (localStorageData) {
      this.todoList = JSON.parse(localStorageData);
    }else {
      const dummy1 = new TodoModel();
      dummy1.todoId = 1;
      dummy1.todoItem = 'Welcome to your new Todo App! 👋';
      dummy1.status = 'completed';
      dummy1.createdDate = new Date(Date.now() - 7200000); 

      const dummy2 = new TodoModel();
      dummy2.todoId = 2;
      dummy2.todoItem = 'Try editing or deleting this task';
      dummy2.status = 'in-progress';
      dummy2.createdDate = new Date(Date.now() - 3600000);

      const dummy3 = new TodoModel();
      dummy3.todoId = 3;
      dummy3.todoItem = 'Test the search and filter dropdown';
      dummy3.status = 'in-progress';
      dummy3.createdDate = new Date();

      this.todoList = [dummy1, dummy2, dummy3];
      
      this.saveData();
    }
  }
  searchText: string = '';

  filterStatus: string = 'all'; // Default to showing everything

  get filteredTodoList() {
    // Start with the full list
    let filteredList = this.todoList;

    // 1. Apply the Dropdown Filter first
    if (this.filterStatus !== 'all') {
      filteredList = filteredList.filter(task => task.status === this.filterStatus);
    }

    // 2. Apply the Text Search second
    if (this.searchText) {
      const lowerCaseSearch = this.searchText.toLowerCase();
      filteredList = filteredList.filter(task => 
        task.todoItem.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filteredList;
  }
  addTask() {
    // Prevent adding empty or blank tasks
    if (!this.newTask.todoItem || this.newTask.todoItem.trim() === '') {
      return;
    }

    if (this.isEditMode) {
      // Find the existing task and replace it with the updated data
      const index = this.todoList.findIndex(t => t.todoId === this.newTask.todoId);
      if (index !== -1) {
        this.todoList[index] = this.newTask;
      }
      this.isEditMode = false; // Turn off edit mode
    } else {
      // Create a brand new task
      this.newTask.todoId = Date.now(); // Give it a unique ID
      this.newTask.createdDate = new Date(); // Stamp the current time
      this.todoList.unshift(this.newTask); // Add to the top of the list
    }

    this.saveData();
    this.newTask = new TodoModel(); // Clear the input field
  }

  editTask(task: TodoModel) {
    // Use the spread operator {...task} to create a clone. 
    // This stops the text in the list from changing while you type in the box.
    this.newTask = { ...task };
    this.isEditMode = true;
  }

  cancelEdit() {
    // Exit edit mode without saving changes
    this.isEditMode = false;
    this.newTask = new TodoModel();
  }

  deleteTask(id: number) {
    // Filter out the task that matches the ID to delete it
    this.todoList = this.todoList.filter(task => task.todoId !== id);
    this.saveData();
  }

  saveData() {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

toggleCompletion(task: TodoModel) {
    task.status = task.status === 'completed' ? 'in-progress' : 'completed';
    this.saveData();
  }
}

// The blueprint for a single task
class TodoModel {
  todoItem: string;
  createdDate: Date;
  status: string;
  todoId: number;

  constructor() {
    this.todoItem = '';
    this.createdDate = new Date();
    this.status = 'In-progress';
    this.todoId = 0;
  }
}