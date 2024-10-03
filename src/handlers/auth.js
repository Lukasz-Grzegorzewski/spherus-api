require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const hashingOptions = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16,
	timeCost: 5,
	parallelism: 1,
};

const hashPassword = (req, res, next) => {
	if (req.body.password) {
		argon2
			.hash(req.body.password, hashingOptions)
			.then((hashedPassword) => {
				req.body.password = hashedPassword;
				next();
			})
			.catch((err) => {
				console.error(err);
				res.sendStatus(500);
			});
	} else {
		next();
	}
};

const verifyPassword = (req, res) => {
	argon2
		.verify(req.user.password, req.body.password)
		.then((isVerified) => {
			if (isVerified) {
				const payload = { sub: req.user.id };

				const token = jwt.sign(payload, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				res.send({ token, isAdmin: req.user.is_admin, id: req.user.id });
			}
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

const verifyToken = (req, res, next) => {
	try {
		const authorizationHeader = req.get("Authorization");
		if (!authorizationHeader) throw new Error("No authorization header");

		const [type, token] = authorizationHeader.split(" ");
		if (type !== "Bearer")
			throw new Error("Authorization header has not the 'Bearer' type");

		req.payload = jwt.verify(token, process.env.JWT_SECRET);

		next();
	} catch (err) {
		console.error(err);
		res.sendStatus(401);
	}
};

module.exports = {
	hashPassword,
	verifyPassword,
	verifyToken,
};
