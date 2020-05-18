// External packages
const mysql = require('mysql');
const inquirer = require('inquirer');

// Internal modules
// Functions for searching by employee
const employee = require('./employeeSearch.js');

var connection = mysql.createConnection({
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
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    employee.viewAllEmployees(connection, start);
                    break;

                case "View All Employees by Department":
                    viewEmployeeDept();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

