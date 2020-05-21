// External packages
const mysql = require('mysql');
const inquirer = require('inquirer');

// Internal modules
// Functions for searching by employee
const employee = require('./employeeSearch.js');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "company_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    employee.viewAllEmployees(connection, start);
                    break;

                case "View All Employees by Department":
                    employee.viewEmployeeDept(connection, start);
                    break;

                case "View All Employees by Manager":
                    employee.viewEmployeeMgr(connection, start);
                    break;

                case "Add Employee":
                    employee.addEmployee(connection, start);
                    break;

                case "Remove Employee":
                    employee.removeEmployee(connection, start);
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

