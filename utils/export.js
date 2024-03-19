// Importing Packages and Modules
import chalk from 'chalk';
import { createObjectCsvWriter } from 'csv-writer';
import { getAllEmployees } from '../database.js';

const exportToCSV = async () => {
  try {
    let employees = await getAllEmployees();

    // Check if there are any employees
    if (employees.length === 0) {
      // Default values if no data found in the database
      employees = [{
        id: 'N/A',
        firstName: 'N/A',
        lastName: 'N/A',
        email: 'N/A',
        dateBirth: 'N/A',
        startDate: 'N/A',
        isActive: 'N/A',
        salaryUSD: 'N/A',
        localCurrency: 'N/A',
      }];
    }

    // Define CSV header row
    const csvHeader = [
      { id: 'id', title: 'ID' },
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'email', title: 'Email' },
      { id: 'dateBirth', title: 'Date of Birth' },
      { id: 'startDate', title: 'Start Date' },
      { id: 'isActive', title: 'Active' },
      { id: 'salaryUSD', title: 'Salary (USD)' },
      { id: 'localCurrency', title: 'Local Currency' },
    ];

    const csvWriter = createObjectCsvWriter({
      path: 'employee_data.csv',
      header: csvHeader,
    });

    await csvWriter.writeRecords(employees);

    console.log(chalk.green('Employee data exported to CSV successfully!'));
  } catch (error) {
    console.error(chalk.red(`Error exporting employee data to CSV: ${error}`));
  }
  process.exit(0);
};

export default exportToCSV;
