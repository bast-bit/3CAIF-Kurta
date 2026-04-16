import persons from "./persons.json" with { type: "json" };
console.log(persons);

// "id": 6,
// "name": "Sophie Dubois",
// "groesse": 168,
// "geburtsdatum": "1994-03-10",
// "herkunft": "Frankreich",
// "gewicht": 59.5 -->

function renderPersons() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    for (const person of persons) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.groesse}</td>
            <td>${person.geburtsdatum}</td>
            <td>${person.herkunft}</td>
            <td>${person.gewicht}</td>
        `;
        tbody.appendChild(tr);
    }
}

const columns = [
    { key: "id", type: "number" },
    { key: "name", type: "string" },
    { key: "groesse", type: "number" },
    { key: "geburtsdatum", type: "date" },
    { key: "herkunft", type: "string" },
    { key: "gewicht", type: "number" }
];













const sortDirections = {};

function sortPersons(column) {
    const nextDirection = sortDirections[column.key] === "asc" ? "desc" : "asc";
    sortDirections[column.key] = nextDirection;
    const direction = nextDirection === "asc" ? 1 : -1;

    persons.sort((a, b) => {
        if (column.type === "string") {
            return a[column.key].localeCompare(b[column.key]) * direction;
        }

        if (column.type === "date") {
            return (new Date(a[column.key]).getTime() - new Date(b[column.key]).getTime()) * direction;
        }

        return (a[column.key] - b[column.key]) * direction;
    });

    renderPersons();
}

const headers = document.querySelectorAll("table thead th");
headers.forEach((header, index) => {
    const column = columns[index];
    if (!column) {
        return;
    }

    header.addEventListener("click", () => {
        sortPersons(column);
    });
});

renderPersons();
