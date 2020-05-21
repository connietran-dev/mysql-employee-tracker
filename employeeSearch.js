const inquirer = require('inquirer');
const util = require('util');

function viewAllEmployees(connection, cb) {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        cb();
    });
};

function viewEmployeeDept(connection, cb) {
    // Query the database for all available departments to prompt user
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "What department would you like to search by?"
                }
            ])
            .then(function (answer) {
                console.log(answer.department);
                let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id'
                connection.query(query, answer.department, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    cb();
                });
            });
    });
};


function viewEmployeeMgr(connection, cb) {
    // Query the database for all distinct managers from employee table
    connection.query("SELECT DISTINCT e2.first_name, e2.last_name FROM employee LEFT JOIN employee AS e2 ON employee.manager_id = e2.id WHERE e2.first_name IS NOT NULL", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "manager",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which manager would you like to search by?"
                }
            ])
            .then(function (answer) {
                console.log(answer.manager);
                let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE e2.first_name = ? ORDER BY employee.id;'
                connection.query(query, answer.manager, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    cb();
                });
            });
    });
};

function addEmployee(connection, cb) {
    let newEmployee = {};
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    default: "Ann",
                    message: "What is the employee's first name?",
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return console.log("A valid first name is required.");
                        }
                        return true;
                    }
                },
                {
                    name: "last_name",
                    type: "input",
                    default: "Pleasant",
                    message: "What is the employee's last name?",
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return console.log("A valid last name is required.");
                        }
                        return true;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What is the employee's role?"
                }
            ])
            .then(function (answer) {

                newEmployee.first_name = answer.first_name;
                newEmployee.last_name = answer.last_name;

                // Translate role to role_id
                connection.query("SELECT * FROM role WHERE title = ?", answer.role, function (err, results) {
                    if (err) throw err;

                    newEmployee.role_id = results[0].id;

                    // Ask for manager
                    connection.query("SELECT DISTINCT e2.first_name FROM employee LEFT JOIN employee AS e2 ON employee.manager_id = e2.id WHERE e2.first_name IS NOT NULL;", answer.role, function (err, results) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "manager_name",
                                    type: "list",
                                    choices: function () {
                                        let choiceArray = [];
                                        for (var i = 0; i < results.length; i++) {
                                            choiceArray.push(results[i].first_name);
                                        }
                                        return choiceArray;
                                    },
                                    message: "Who is the employee's manager?"
                                }
                            ])
                            .then(function (answer) {
                                // Translate manager_name to id
                                connection.query("SELECT id FROM employee WHERE first_name = ?", answer.manager_name, function (err, results) {
                                    if (err) throw err;
                                    newEmployee.manager_id = results[0].id;
                                    console.log("Adding new employee: ", newEmployee);

                                    connection.query('INSERT INTO employee SET ?', newEmployee, function (err, results) {
                                        if (err) throw err;
                                        console.log("Employee successfully added.");
                                        cb();
                                    })
                                })
                            });
                    });
                });
            });
    })
};


function removeEmployee(connection, cb) {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "removeEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to remove?"
                }
            ])
            .then(function (answer) {
                let query = 'DELETE FROM employee WHERE first_name = ?;'
                connection.query(query, answer.removeEmployee, function (err, res) {
                    if (err) throw err;
                    console.log("Employee successfully deleted");
                    cb();
                });
            });
    });
};



module.exports = {
    viewAllEmployees: viewAllEmployees,
    viewEmployeeDept: viewEmployeeDept,
    viewEmployeeMgr: viewEmployeeMgr,
    addEmployee: addEmployee,
    removeEmployee: removeEmployee
};