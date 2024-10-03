const DataExporter = require("json2csv").Parser;
const database = require("../../../database");

const getCsv = (req, res) => {
	database
		.query(
			"SELECT firstname, lastname, nickname, DATE_FORMAT(birthday, ' % Y -% m -% d') as birthday, email FROM user;",
		)
		.then(([data]) => {
			const fileHeader = [
				"First Name",
				"Last Name",
				"Nickname",
				"birthday",
				"Email",
			];
			const jsonData = new DataExporter({ fileHeader });
			const csvData = jsonData.parse(data);
			res.setHeader("Content-Type", "text/csv");
			res.setHeader("Content-Disposition", "attachment; filename=user.csv");
			res.status(200).end(csvData);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

module.exports = {
	getCsv,
};
