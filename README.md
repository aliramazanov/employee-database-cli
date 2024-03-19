# Employee Database Manager CLI Application

## Features

- **Add Employees**: Easily add new employees to the system with their relevant details such as name, email, date of birth, start date, and salary.
- **List Employees**: View a list of all employees currently stored in the system along with their details and salaries in both USD and their local currency.
- **Search Employees**: Search for employees by their ID or name, providing quick access to specific employee information.
- **Currency Conversion**: Automatically converts employee salaries from USD to their local currency using real-time exchange rate data from the Exchange Rates API.

## Prerequisites

Before running the CLI application, make sure you have the following:

- Node.js installed on your machine.
- API key from Exchange Rates API to fetch real-time exchange rate data.

## Before running the Application

Follow these steps to set up your environment correctly:

1. Navigate to your debug menu and click on "Create a launch.json" file to set up your launch environment.

2. Inside the generated `launch.json` file, add the following line inside the configurations:

    ```json

    "console": "integratedTerminal",

    ```

    Make sure it is placed after the `"program": "${file}"` line.

3. For ESLint configurations:
    - Create a `settings.json` file inside the `.vscode` folder.
    - Add the following objects for linting:

        ```json

        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": "always"
        },
        "eslint.validate": ["javascript"]

        ```

## Set up your API key

1. Get your API key from Exchange Rates API.
2. Create a .env file in the root directory.
3. Add your API key to the .env file: apikey="your-api-key"

## Run the CLI application with the following command

- node index.js **command** (the command you would like to execute)
- Available commands: list-employees, add-employee, search-by-id, search-by-name
- Now you can also use **npm run** followed by the command you would like to execute

## SQLite Database

- Employee data will be stored in an SQLite database (data.sqlite3).
