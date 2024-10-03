require("dotenv").config();
const mysql = require("mysql2/promise");

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

database
  .getConnection()
  .then(() => {
    console.warn("Database connected 👍🏻");
  })
  .catch((err) => console.error(err));

module.exports = database;
