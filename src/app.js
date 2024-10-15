const express = require("express");
const path = require("node:path");
const cors = require("cors");

const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const patchRoutes = require("./routes/patchRoutes");
const deleteRoutes = require("./routes/deleteRoutes");

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
		optionsSuccessStatus: 200,
	}),
);

app.use(express.json());

// Serve the public folder for public resources
app.use("/api", express.static(path.join(__dirname, "../public")));

// Serve REACT APP
// app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

// API routes
app.use("/api", getRoutes);
app.use("/api", postRoutes);
app.use("/api", patchRoutes);
app.use("/api", deleteRoutes);

// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "../public/index.html"))
// );

// Redirect all requests to the REACT app
// const reactIndexFile = path.join(
//   __dirname,
//   "..",
//   "..",
//   "frontend",
//   "dist",
//   "index.html"
// );

// if (fs.existsSync(reactIndexFile)) {
//   app.get("*", (req, res) => {
//     res.sendFile(reactIndexFile);
//   });
// }

// ready to export
module.exports = app;
