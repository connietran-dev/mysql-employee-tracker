const inquirer = require('inquirer');

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


function updateRole(connection, cb) {

    let newRole = {};

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                }
            ])
            .then(function (answer) {

                newRole.first_name = answer.updateEmployee;

                connection.query("SELECT * FROM role", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "updateRole",
                                type: "list",
                                choices: function () {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].title);
                                    }
                                    return choiceArray;
                                },
                                message: "What would you like you to change their role title to?"
                            }
                        ])
                        .then(function (answer) {
                            // Translate role to role_id
                            connection.query("SELECT * FROM role WHERE title = ?", answer.updateRole, function (err, results) {
                                if (err) throw err;

                                newRole.role_id = results[0].id;

                                connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [newRole.role_id, newRole.first_name], function (err, res) {
                                    if (err) throw (err);
                                    console.log('Employee role successfully updated.');
                                    cb();
                                })

                            })
                        });
                });
            });
    })
};

module.exports = {
    removeEmployee: removeEmployee,
    updateRole: updateRole
}