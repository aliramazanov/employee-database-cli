// Get The Exchange Rates API Key: https://apilayer.com/marketplace/exchangerates_data-api

// Importing Packages and Modules
import dotenv from "dotenv";
import readline from "readline";
import chalk from "chalk";

import { loadData, writeData } from "./utils/handlers.js";
import { getExchangeData, getSalary } from "./utils/currency.js";
import * as validators from "./utils/validators.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Global Variables
let employees;
let currencyData;

// Input Function
const getInput = function (promptText, validator, transformer) {
  return new Promise((resolve) => {
    rl.question(promptText, (value) => {
      if (!value.trim() || (validator && !validator(value))) {
        console.error(chalk.red("Invalid input. Please try again."));
        getInput(promptText, validator, transformer).then(resolve);
      } else {
        if (transformer) {
          resolve(transformer(value));
        } else {
          resolve(value);
        }
      }
    });
  });
};

// Get next employee ID
const getNextEmployeeID = () => {
  const maxID = Math.max(...employees.map((employee) => employee.id));
  return maxID + 1;
};

// Format Employee keys to easily readable text
const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};

// Log Employee Salary Data
const logEmployee = (employee) => {
  Object.entries(employee).forEach((entry) => {
    if (entry[0] !== "salaryUSD" && entry[0] !== "localCurrency") {
      console.log(
        `${chalk.blue(formatKey(entry[0]))}${chalk.blue(":")} ${entry[1]}`
      );
    }
  });
  console.log(
    `${chalk.blue("Salary USD:")} ${getSalary(
      employee.salaryUSD,
      "USD",
      currencyData
    )}`
  );
  console.log(
    `${chalk.blue("Salary with Local Currency:")} ${getSalary(
      employee.salaryUSD,
      employee.localCurrency,
      currencyData
    )}
    `
  );
};

// CLI Commands for Adding and Listing Employees
const listEmployees = () => {
  console.log(
    chalk.blue(`\nEmployee List --------------------------------\n\n`)
  );

  let currentIndex = 0;

  const displayNextEmployee = () => {
    if (currentIndex < employees.length) {
      const employee = employees[currentIndex];
      logEmployee(employee);
      currentIndex++;

      rl.question(
        chalk.green(`Press Enter for next employee. `) +
          chalk.red(`Press Ctrl + C to exit.\n`),
        displayNextEmployee
      );
    } else {
      console.log(chalk.blue(`\nEmployee list completed ------------------\n`));
      rl.close();
    }
  };

  displayNextEmployee();
};

const addEmployee = async () => {
  console.log(chalk.blue(`\nAdd Employee ---------------------------------\n`));
  let employee = {};

  employee.id = getNextEmployeeID();

  employee.firstName = await getInput(
    chalk.yellow("First Name: "),
    validators.isStringInputValid
  );
  employee.lastName = await getInput(
    chalk.yellow("Last Name: "),
    validators.isStringInputValid
  );
  employee.email = await getInput(
    chalk.yellow("Email: "),
    validators.isEmailValid
  );

  let dateBirthYear = await getInput(
    chalk.yellow("Employee Date of Birth Year(YYYY): "),
    validators.isBirthYearValid
  );
  let dateBirthMonth = await getInput(
    chalk.yellow("Employee Date of Birth Month(1-12): "),
    validators.isBirthMonthValid
  );
  let dateBirthDay = await getInput(
    chalk.yellow("Employee Date of Birth Day(1-31): "),
    validators.isBirthDayValid
  );

  employee.dateBirth = `${dateBirthYear}-${dateBirthMonth}-${dateBirthDay}`;

  let startDateYear = await getInput(
    chalk.yellow("Employee Start Year(1990-2024): "),
    validators.isStartYearValid
  );
  let startDateMonth = await getInput(
    chalk.yellow("Employee Start Date Month(1-12): "),
    validators.isStartMonthValid
  );
  let startDateDay = await getInput(
    chalk.yellow("Employee Start Date Day(1-31): "),
    validators.isStartDayValid
  );

  employee.startDate = `${startDateYear}-${startDateMonth}-${startDateDay}`;

  employee.isActive = await getInput(
    chalk.yellow("Is employee active (yes or no): "),
    validators.isBooleanInputValid,
    (input) => input === "yes"
  );

  employee.salaryUSD = await getInput(
    chalk.yellow(`Enter the yearly employee salary in USD: `),
    validators.isSalaryInputValid
  );

  employee.localCurrency = await getInput(
    chalk.yellow(`Local Currency (3 letter code): `),
    (code) => validators.isCurrencyCodeValid(code, currencyData)
  );

  employees.push(employee);

  // Write the updated data back to the data.json
  try {
    await writeData(employees);
    console.log(chalk.green("Employee added successfully!"));
  } catch (error) {
    console.error(chalk.red("Error adding employee:"), error);
  }

  // Output added employee JSON
  const json = JSON.stringify(employee, null, 2);
  console.log(`Employee: ${json}`);

  // Exit after adding the employee
  process.exit(0);
};

// Search by id or name of the employye
const searchById = async () => {
  const id = await getInput(chalk.yellow(`Employee ID: `), null, Number);
  const result = employees.find((e) => e.id === id);
  if (result) {
    console.log("");
    logEmployee(result);
    process.exit(0);
  } else {
    console.log(chalk.red("No results..."));
    process.exit(1);
  }
};

const searchByName = async () => {
  const firstNameSearch = (
    await getInput(chalk.yellow(`First Name: `))
  ).toLowerCase();
  const lastNameSearch = (
    await getInput(chalk.yellow(`Last Name: `))
  ).toLowerCase();
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
    console.log(chalk.red("No results..."));
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
      console.log(chalk.red("Unsupported command. Exiting..."));
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
    console.error(chalk.red("Application Startup Failed."));
    throw err;
  });
