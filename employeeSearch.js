function viewAllEmployees(connection, cb) {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        cb();
    });
};

module.exports = {
    viewAllEmployees: viewAllEmployees
};