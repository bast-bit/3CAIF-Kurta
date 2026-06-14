"use strict";

// 2) DOM-Referenzen
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const entryForm = document.getElementById("entry-form");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const noteInput = document.getElementById("note");
const filterSelect = document.getElementById("filter");
const demoStudentBtn = document.getElementById("demo-student-btn");
const demoNebenjobBtn = document.getElementById("demo-nebenjob-btn");
const demoFamilieBtn = document.getElementById("demo-familie-btn");
const resetBtn = document.getElementById("reset-btn");
const entryList = document.getElementById("entry-list");
const emptyState = document.getElementById("empty-state");
const countEl = document.getElementById("count");
const incomeTotalEl = document.getElementById("income-total");
const expenseTotalEl = document.getElementById("expense-total");
const balanceTotalEl = document.getElementById("balance-total");
const remainingTotalEl = document.getElementById("remaining-total");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");

// 3) State-Objekt
const state = {
  budget: 1000,
  filter: "all",
  entries: [],
};

// 4) Konstanten und Default-Werte
const STORAGE_KEY = "wmc-budget-planer-v1";

const demoDatasets = {
  student: {
    budget: 1200,
    entries: [
      { id: "student-1", amount: 12.5, type: "expense", category: "Essen", note: "Mittagessen" },
      { id: "student-2", amount: 39.9, type: "expense", category: "Freizeit", note: "Kino" },
      { id: "student-3", amount: 850, type: "income", category: "Gehalt", note: "Nebenjob" },
      { id: "student-4", amount: 48.0, type: "expense", category: "Transport", note: "Semesterticket" },
    ],
  },
  nebenjob: {
    budget: 1500,
    entries: [
      { id: "job-1", amount: 950, type: "income", category: "Gehalt", note: "Teilzeitjob" },
      { id: "job-2", amount: 74.2, type: "expense", category: "Essen", note: "Supermarkt" },
      { id: "job-3", amount: 29.9, type: "expense", category: "Shopping", note: "Schuhe" },
      { id: "job-4", amount: 18.0, type: "expense", category: "Freizeit", note: "Café" },
      { id: "job-5", amount: 220, type: "income", category: "Sonstiges", note: "Bonus" },
    ],
  },
  familie: {
    budget: 2600,
    entries: [
      { id: "family-1", amount: 1800, type: "income", category: "Gehalt", note: "Monatslohn" },
      { id: "family-2", amount: 650, type: "expense", category: "Wohnen", note: "Miete" },
      { id: "family-3", amount: 95.3, type: "expense", category: "Essen", note: "Wocheneinkauf" },
      { id: "family-4", amount: 145, type: "expense", category: "Transport", note: "Tanken" },
      { id: "family-5", amount: 250, type: "expense", category: "Freizeit", note: "Ausflug" },
    ],
  },
};

function createDefaultState() {
  return {
    budget: 1000,
    filter: "all",
    entries: [],
  };
}

function createId() {
  return String(Date.now()) + "-" + String(Math.floor(Math.random() * 1000));
}

function formatMoney(value) {
  return value.toFixed(2) + " EUR";
}

function getVisibleEntries() {
  if (state.filter === "income") {
    return state.entries.filter((entry) => entry.type === "income");
  }

  if (state.filter === "expense") {
    return state.entries.filter((entry) => entry.type === "expense");
  }

  return state.entries;
}

function calculateTotals() {
  const income = state.entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const expense = state.entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = income - expense;
  const remaining = state.budget - expense;
  const usedPercent = state.budget > 0 ? Math.round((expense / state.budget) * 100) : 0;

  return { income, expense, balance, remaining, usedPercent };
}

// 5) Initialisierung
init();

function init() {
  loadState();
  bindEvents();
  render();
}

function bindEvents() {
  budgetForm.addEventListener("submit", onBudgetSubmit);
  entryForm.addEventListener("submit", onEntrySubmit);
  filterSelect.addEventListener("change", onFilterChange);
  demoStudentBtn.addEventListener("click", () => onDemoClick("student"));
  demoNebenjobBtn.addEventListener("click", () => onDemoClick("nebenjob"));
  demoFamilieBtn.addEventListener("click", () => onDemoClick("familie"));
  resetBtn.addEventListener("click", onResetClick);
  entryList.addEventListener("click", onListClick);
}

// 6) Render-Funktionen
function render() {
  renderSummary();
  renderEntries();
  renderCount();
}

function renderSummary() {
  const totals = calculateTotals();

  incomeTotalEl.textContent = formatMoney(totals.income);
  expenseTotalEl.textContent = formatMoney(totals.expense);
  balanceTotalEl.textContent = formatMoney(totals.balance);
  remainingTotalEl.textContent = formatMoney(totals.remaining);

  progressLabel.textContent = totals.usedPercent + " %";
  progressBar.style.width = Math.min(totals.usedPercent, 100) + "%";
  progressBar.classList.toggle("over-budget", totals.usedPercent > 100);
}

function renderEntries() {
  const visibleEntries = getVisibleEntries();
  entryList.innerHTML = "";
  emptyState.hidden = visibleEntries.length > 0;

  visibleEntries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "entry-item";
    item.dataset.id = entry.id;

    const top = document.createElement("div");
    top.className = "entry-top";

    const title = document.createElement("h3");
    title.className = "entry-title";
    title.textContent = entry.category;

    const amount = document.createElement("p");
    amount.className = "entry-amount";
    amount.textContent = (entry.type === "income" ? "+ " : "- ") + formatMoney(entry.amount);

    top.append(title, amount);

    const meta = document.createElement("p");
    meta.className = "entry-meta";
    const noteText = entry.note ? " | " + entry.note : "";
    meta.textContent = (entry.type === "income" ? "Einnahme" : "Ausgabe") + noteText;

    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Löschen";

    actions.append(deleteBtn);
    item.append(top, meta, actions);
    entryList.append(item);
  });
}

function renderCount() {
  const total = state.entries.length;
  const shown = getVisibleEntries().length;
  countEl.textContent = shown + " von " + total + " Einträgen";
}

// 7) Event-Handler
function onBudgetSubmit(event) {
  event.preventDefault();

  if (budgetInput.value.trim() === "") {
    return;
  }

  const budgetValue = Number(budgetInput.value);
  if (Number.isNaN(budgetValue) || budgetValue < 0) {
    return;
  }

  state.budget = budgetValue;
  saveState();
  render();
  budgetForm.reset();
}

function onEntrySubmit(event) {
  event.preventDefault();

  const amountValue = Number(amountInput.value);
  if (Number.isNaN(amountValue) || amountValue <= 0) {
    return;
  }

  const newEntry = {
    id: createId(),
    amount: amountValue,
    type: typeSelect.value,
    category: categorySelect.value,
    note: noteInput.value.trim(),
  };

  state.entries.unshift(newEntry);
  saveState();
  render();
  entryForm.reset();
  amountInput.focus();
}

function onFilterChange(event) {
  state.filter = event.target.value;
  saveState();
  render();
}

function onDemoClick(name) {
  const demo = demoDatasets[name];
  if (!demo) {
    return;
  }

  state.budget = demo.budget;
  state.entries = demo.entries.map((entry) => ({ ...entry }));
  saveState();
  render();
}

function onResetClick() {
  const shouldDelete = window.confirm("Wirklich alle Einträge und das Budget löschen?");
  if (!shouldDelete) {
    return;
  }

  Object.assign(state, createDefaultState());
  saveState();
  render();
}

function onListClick(event) {
  const button = event.target.closest("button.delete-btn");
  if (!button) {
    return;
  }

  const item = button.closest("li[data-id]");
  if (!item) {
    return;
  }

  const id = item.dataset.id;
  state.entries = state.entries.filter((entry) => entry.id !== id);
  saveState();
  render();
}

// 8) Local-Storage-Funktionen
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    Object.assign(state, createDefaultState());
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();

    state.budget = typeof parsed.budget === "number" ? parsed.budget : defaults.budget;
    state.filter = parsed.filter || defaults.filter;
    state.entries = Array.isArray(parsed.entries) ? parsed.entries : defaults.entries;
  } catch (error) {
    Object.assign(state, createDefaultState());
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      budget: state.budget,
      filter: state.filter,
      entries: state.entries,
    })
  );
}
