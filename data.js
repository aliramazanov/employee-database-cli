// Import Packages
import fs from "fs";

// Load & Write data to/from file
export const loadData = async () => {
  console.log(`
Loading Employees...
`);
  try {
    const data = fs.readFileSync("./data.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`
  Couldn't load employees...
  `);
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      console.error(
        `Error: Invalid JSON format in data.json. Please check the file.`
      );
    } else {
      console.error(`Error Name: ${err.name}`);
      console.error(`Error Message: ${err.message}`);
    }
  }
};

export const writeData = async (employees) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("data.json", JSON.stringify(employees, null, 2), (err) => {
      if (err) {
        console.error("Error writing to data.json:", err);
        reject(err);
      } else {
        console.log("Employee data updated successfully!");
        resolve();
      }
    });
  });
};
