// External packages
const mysql = require('mysql');
const inquirer = require('inquirer');

// Internal modules
// View only queries
const view = require('./utils/view.js');
// Adding new employees or roles
const add = require('./utils/add.js');
// Updating and deleting existing data
const update = require('./utils/update.js');

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
                "Update Employee Role",
                "Update Employee Manager",
                "Remove Employee",
                "View All Roles",
                "Add Role",
                "Remove Role",
                "View All Departments",
                "Add Department",
                "Remove Department",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    view.viewAllEmployees(connection, start);
                    break;

                case "View All Employees by Department":
                    view.viewEmployeeDept(connection, start);
                    break;

                case "View All Employees by Manager":
                    view.viewEmployeeMgr(connection, start);
                    break;

                case "Add Employee":
                    add.addEmployee(connection, start);
                    break;

                case "Update Employee Role":
                    update.updateRole(connection, start);
                    break;

                case "Update Employee Manager":
                    update.updateManager(connection, start);
                    break;

                case "Remove Employee":
                    update.removeEmployee(connection, start);
                    break;

                case "View All Roles":
                    view.viewRoles(connection, start);
                    break;

                case "Add Role":
                    add.addRole(connection, start);
                    break;

                case "Remove Role":
                    update.removeRole(connection, start);
                    break;

                case "View All Departments":
                    view.viewDepartments(connection, start);
                    break;

                case "Add Department":
                    add.addDepartment(connection, start);
                    break;

                case "Remove Department":
                    update.removeDepartment(connection, start);
                    break;

                case "EXIT":
                    connection.end();
                    break;
            }
        })
}

