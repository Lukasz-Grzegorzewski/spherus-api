require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const migrate = async () => {
	console.log("---- migrate start ----");
	const { DB_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
	const connection = await mysql.createConnection({
		host: DB_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		multipleStatements: true,
	});

	await connection.query(`DROP DATABASE IF EXISTS \`${MYSQL_DATABASE}\``);
	await connection.query(`CREATE DATABASE \`${MYSQL_DATABASE}\``);
	await connection.query(`USE \`${MYSQL_DATABASE}\``);

	const sql = fs.readFileSync(path.join(__dirname, "ODW_DB.sql"), "utf8");

	await connection.query(sql);
	connection.end();
};

try {
	migrate();
	console.log("---- migrate end SUCCES ----");
} catch (err) {
	console.log("---- migrate start FAILURE ----");
	console.error(err);
}
