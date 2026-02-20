const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [];

// ===== MENU =====
function showMenu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. View Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Enter your choice: ", function (choice) {
    handleChoice(choice);
  });
}

// ===== SWITCH CASE =====
function handleChoice(choice) {
  switch (choice) {
    case "1":
      addEmployee();
      break;

    case "2":
      viewEmployees();
      break;

    case "3":
      updateEmployee();
      break;

    case "4":
      deleteEmployee();
      break;

    case "5":
      console.log("Exiting program...");
      rl.close();
      break;

    default:
      console.log("Invalid choice. Try again.");
      showMenu();
  }
}

// ===== ADD =====
function addEmployee() {
  rl.question("Enter Employee ID: ", function (id) {
    rl.question("Enter Employee Name: ", function (name) {
      employees.push({ id: id, name: name });
      console.log("Employee added successfully!");
      showMenu();
    });
  });
}

// ===== VIEW =====
function viewEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\nEmployee List:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

// ===== UPDATE =====
function updateEmployee() {
  rl.question("Enter Employee ID to update: ", function (id) {
    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
      console.log("Employee not found.");
      showMenu();
    } else {
      rl.question("Enter new Employee Name: ", function (newName) {
        employee.name = newName;
        console.log("Employee updated successfully!");
        showMenu();
      });
    }
  });
}

// ===== DELETE =====
function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", function (id) {
    const initialLength = employees.length;

    employees = employees.filter(emp => emp.id !== id);

    if (employees.length === initialLength) {
      console.log("Employee not found.");
    } else {
      console.log("Employee deleted successfully!");
    }

    showMenu();
  });
}

// ===== START PROGRAM =====
showMenu();
