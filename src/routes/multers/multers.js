const multer = require("multer");
const fs = require("node:fs");

// Import des videos dans le backend
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/assets/videos");
	},
	filename: (req, file, cb) => {
		const date = new Date().getTime();
		req.body.filename = `${req.body.title + date.toString()}.mp4`;
		cb(null, req.body.filename.toString());
	},
});

const upload = multer({ storage });

// Import des fichiers pub dans le backend
const storageImg = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/assets/images");
	},
	filename: (req, file, cb) => {
		const date = new Date().getTime();
		req.body.filename = `${req.body.name + date.toString()}.jpg`;
		cb(null, req.body.filename.toString());
	},
});
const uploadImg = multer({ storage: storageImg });

// Import avatar
const storageAvatar = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "assets/images/avatars/";
		if (!fs.existsSync(`public/${dir}`)) {
			fs.mkdirSync(`public/${dir}`);
		}

		cb(null, "./public/assets/images/avatars");
	},
	filename: (req, file, cb) => {
		// const date = Date.now();
		req.body.filename = `${req.body.id + req.body.dateCreation}.jpg`;
		cb(null, req.body.filename.toString());
	},
});
const uploadAvatar = multer({ storage: storageAvatar });

module.exports = {
	upload,
	uploadImg,
	uploadAvatar,
};
