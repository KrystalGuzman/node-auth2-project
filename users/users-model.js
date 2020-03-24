const database = require("../database/dbConfig");

module.exports = {
    getAllUsers,
    getUsersByDepartment
}

function getAllUsers() {
    return database("users").select("users.id", "users.username", "users.department")
        .orderBy("users.id");
}

function getUsersByDepartment(department) {

    console.log("checking department,", department)

    return database("users")
        .select("users.id", "users.username", "users.department")
        .where("users.department", "=", department)
        .orderBy("users.id");
}