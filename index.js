// Get The Exchange Rates API Key: https://apilayer.com/marketplace/exchangerates_data-api

// Importing Packages and Modules
import dotenv from "dotenv";
import createPrompt from "prompt-sync";
import readline from "readline";

import { loadData, writeData } from "./utils/handlers.js";
import { getExchangeData, getSalary } from "./utils/currency.js";
import * as validators from "./utils/validators.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let prompt = createPrompt();

// Global Variables
let employees;
let currencyData;

// Input Function
const getInput = function (promptText, validator, transformer) {
  let value;
  do {
    value = prompt(promptText);
    if (validator && !validator(value)) {
      console.error("Invalid input. Please try again.");
    }
  } while (validator && !validator(value));
  if (transformer) {
    return transformer(value);
  }
  return value;
};

// Get next employee ID
const getNextEmployeeID = () => {
  const maxID = Math.max(...employees.map((employee) => employee.id));
  return maxID + 1;
};

// Log Employee Salary Data
const logEmployee = (employee) => {
  Object.entries(employee).forEach((entry) => {
    if (entry[0] !== "salaryUSD" || entry[0] !== "localCurrency") {
      console.log(`${entry[0]}: ${entry[1]}`);
    }
  });
  console.log(
    `Salary USD: ${getSalary(employee.salaryUSD, "USD", currencyData)}`
  );
  console.log(
    `Salary with Local Currency: ${getSalary(
      employee.salaryUSD,
      employee.localCurrency,
      currencyData
    )}
    `
  );
};

// CLI Commands for Adding and Listing Employees
const listEmployees = () => {
  console.log(`\nEmployee List --------------------------------\n`);
  console.log("");

  let currentIndex = 0;

  const displayNextEmployee = () => {
    if (currentIndex < employees.length) {
      const employee = employees[currentIndex];
      logEmployee(employee);
      currentIndex++;

      rl.question(
        `Press Enter for next employee. Press Ctrl + C to exit.\n`,
        displayNextEmployee
      );
    } else {
      console.log(`\nEmployee list completed ------------------\n`);
      rl.close();
    }
  };

  displayNextEmployee();
};

const addEmployee = async () => {
  console.log(`\nAdd Employee ---------------------------------\n`);
  let employee = {};

  employee.id = getNextEmployeeID();

  employee.firstName = getInput("First Name: ", validators.isStringInputValid);
  employee.lastName = getInput("Last Name: ", validators.isStringInputValid);
  employee.email = getInput("Email: ", validators.isEmailValid);

  let dateBirthYear = getInput(
    "Employee Date of Birth Year(YYYY): ",
    validators.isBirthYearValid
  );
  let dateBirthMonth = getInput(
    "Employee Date of Birth Month(1-12): ",
    validators.isBirthMonthValid
  );
  let dateBirthDay = getInput(
    "Employee Date of Birth Day(1-31): ",
    validators.isBirthDayValid
  );

  employee.dateBirth = `${dateBirthYear}-${dateBirthMonth}-${dateBirthDay}`;

  let startDateYear = getInput(
    "Employee Start Year(1990-2024): ",
    validators.isStartYearValid
  );
  let startDateMonth = getInput(
    "Employee Start Date Month(1-12): ",
    validators.isStartMonthValid
  );
  let startDateDay = getInput(
    "Employee Start Date Day(1-31): ",
    validators.isStartDayValid
  );

  employee.startDate = `${startDateYear}-${startDateMonth}-${startDateDay}`;

  employee.isActive = getInput(
    "Is employee active (yes or no): ",
    validators.isBooleanInputValid,
    (input) => input === "yes"
  );

  employee.salaryUSD = getInput(
    `Enter the yearly employee salary in USD: `,
    validators.isSalaryInputValid
  );

  employee.localCurrency = getInput(
    `Local Currency (3 letter code): `,
    (code) => validators.isCurrencyCodeValid(code, currencyData)
  );

  employees.push(employee);

  // Write the updated data back to the data.json
  try {
    await writeData(employees);
    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }

  // Output added employee JSON
  const json = JSON.stringify(employee, null, 2);
  console.log(`Employee: ${json}`);

  // Exit after adding the employee
  process.exit(0);
};

// Search by id or name of the employye
const searchById = () => {
  const id = getInput(`Employee ID: `, null, Number);
  const result = employees.find((e) => e.id === id);
  if (result) {
    console.log("");
    logEmployee(result);
    process.exit(0);
  } else {
    console.log("No results...");
    process.exit(1);
  }
};

const searchByName = () => {
  const firstNameSearch = getInput(`First Name: `).toLowerCase();
  const lastNameSearch = getInput(`Last Name: `).toLowerCase();
  const results = employees.filter((employee) => {
    if (
      firstNameSearch !== "" &&
      !employee.firstName.toLowerCase().includes(firstNameSearch)
    ) {
      return false;
    }
    if (
      lastNameSearch !== "" &&
      !employee.lastName.toLowerCase().includes(lastNameSearch)
    ) {
      return false;
    }
    return true;
  });

  if (results.length > 0) {
    results.forEach(logEmployee);
    process.exit(0);
  } else {
    console.log("No results...");
    process.exit(1);
  }
};

const main = async () => {
  // Check if a command is provided
  if (process.argv.length < 3) {
    console.log("Please provide a command (list or add)");
    process.exit(1);
  }

  const command = process.argv[2].toLowerCase();

  // User Commands
  switch (command) {
    case "list-employees":
      listEmployees();
      break;

    case "add-employee":
      addEmployee();
      break;

    case "search-by-id":
      searchById();
      break;

    case "search-by-name":
      searchByName();
      break;

    default:
      console.log("Unsupported command. Exiting...");
      process.exit(1);
  }
};

// Start The Application
Promise.all([loadData(), getExchangeData()])
  .then((results) => {
    employees = results[0];
    currencyData = results[1];
    return main();
  })
  .catch((err) => {
    console.error("Application Startup Failed.");
    throw err;
  });
