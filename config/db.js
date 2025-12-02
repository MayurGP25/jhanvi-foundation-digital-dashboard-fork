const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NGOPASSWORD123",
    database: "ngo_db"
});

module.exports = db;
