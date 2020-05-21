const inquirer = require('inquirer');

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

module.exports = {
    addEmployee: addEmployee
};