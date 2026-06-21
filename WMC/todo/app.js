
import TodoItem from "./todo-item.js";

const todos = [
  new TodoItem("WMC programmieren", false, 1),
  new TodoItem("CABS lernen", false, 3),
  new TodoItem("NSCS lernen", true, 2),
  new TodoItem("POS/Theorie lernen", false, 2),
  new TodoItem("POS/Java üben", false, 1),
];

function addTodoItem(todo) {
  todos.push(todo);
}

function removeTodoItem(todo) {
  const idx = todos.indexOf(todo);
  if (idx !== -1) {
    todos.splice(idx, 1);
  }
}

function toggleTodoStatus(todo) {
  todo.toggleCompleted();
}



const newTodoText = document.getElementById("todo-input");
const addBtn = document.getElementById("todo-add");
const todoList = document.getElementById("todo-list");
const todoListDone = document.getElementById("todo-list-done");



function createTodoElement(todo) {
  const listItem = document.createElement("li");
  listItem.className = "todo-item";
  if (todo.completed) {
    listItem.classList.add("is-complete");
  }

  const cbDone = document.createElement("input");
  cbDone.type = "checkbox";
  cbDone.className = "todo-toggle";
  cbDone.checked = todo.completed;
  cbDone.addEventListener("change", (_) => onTodoStatusChanged(todo));

  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.innerText = todo.text;

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `todo-priority priority-${todo.priority}`;
  priorityBadge.innerText = `P${todo.priority}`;

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "todo-priority-select";
  for (let p = 1; p <= 5; p++) {
    const option = document.createElement("option");
    option.value = p;
    option.innerText = p;
    option.selected = p === todo.priority;
    prioritySelect.appendChild(option);
  }
  prioritySelect.addEventListener("change", (e) => onTodoPriorityChanged(todo, Number(e.target.value)));

  const deleteBtn = document.createElement("input");
  deleteBtn.className = "todo-delete";
  deleteBtn.value = "Delete";
  deleteBtn.type = "button";
  deleteBtn.addEventListener("click", (_) => onDeleteButtonClicked(todo));

  listItem.append(cbDone, priorityBadge, todoText, prioritySelect, deleteBtn);
  return listItem;
}


function render() {
  todoList.innerHTML = "";
  todoListDone.innerHTML = "";
  for (const ti of todos) {
    const todoElement = createTodoElement(ti);
    if (!ti.completed) {
      todoList.append(todoElement);
    } else {
      todoListDone.append(todoElement);
    }
  }
}

function onAddButtonClicked() {
  if (newTodoText.value.trim() !== "") {
    const ti = new TodoItem(newTodoText.value.trim(), false, 3);
    addTodoItem(ti);
    render();
  }
}

function onDeleteButtonClicked(todo) {
  removeTodoItem(todo);
  render();
}

function onTodoStatusChanged(todo) {
  toggleTodoStatus(todo);
  render();
}

function onTodoPriorityChanged(todo, newPriority) {
  todo.priority = newPriority;
  render();
}

function onKeyDownEvent(e) {
  if (e.key === "Enter") {
    onAddButtonClicked();
  }
}

addBtn.addEventListener("click", (_) => onAddButtonClicked());
newTodoText.addEventListener("keydown", (e) => onKeyDownEvent(e));
render();
