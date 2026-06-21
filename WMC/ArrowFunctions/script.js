const students = [
  { name: "Anna", age: 17, grade: 2 },
  { name: "Ben", age: 16, grade: 4 },
  { name: "Clara", age: 18, grade: 1 },
  { name: "David", age: 17, grade: 5 },
  { name: "Elena", age: 16, grade: 3 },
  { name: "Felix", age: 19, grade: 2 },
  { name: "Gina", age: 17, grade: 1 },
  { name: "Hugo", age: 18, grade: 4 },
];

// Task 1 - filter
const passed = students.filter(student => student.grade <= 4);

// Task 2 - map
const labels = students.map(student => student.name + " (" + student.age + ")");

// Task 3 - filter + map
const passedNames = passed.map(student => student.name);

// Task 4 - reduce
const averageGrade = students.reduce((sum, student) => sum + student.grade, 0) / students.length;

// Task 5 - chaining
const result = students
  .filter(student => student.age >= 17 && student.grade <= 4)
  .map(student => student.name)
  .join(", ");

console.log("passed:", passed);
console.log("labels:", labels);
console.log("passedNames:", passedNames);
console.log("averageGrade:", averageGrade);
console.log("result:", result);
