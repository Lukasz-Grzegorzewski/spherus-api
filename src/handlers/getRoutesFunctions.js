const database = require("../../database");

/* WELCOME MESSAGE */
const welcome = (req, res) => {
	res.send("Welcome to root of Spherus!");
};

/* USERS ROUTES */
const getUsers = (req, res) => {
	database
		.query("SELECT * FROM user")
		.then(([users]) => res.status(200).json(users))
		.catch((err) => console.error(err));
};
const getUsersCsv = (req, res) => {
	database
		.query(
			"SELECT id, firstname, lastname, nickname, DATE_FORMAT(birthday, ' % Y -% m -% d') as birthday, email FROM user;",
		)
		.then(([users]) => res.status(200).json(users))
		.catch((err) => console.error(err));
};
const getUserById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);

	database
		.query(
			"SELECT id, url, firstname, lastname, nickname, DATE_FORMAT(birthday, '%Y-%m-%d') as birthday, email, password, is_admin, token, token_start FROM user WHERE id = ?",
			[id],
		)
		.then(([user]) => {
			if (user[0] != null) {
				res.status(200).json(user[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

const getUserByEmail = (req, res) => {
	const { email } = req.params;

	database
		.query("SELECT id FROM user WHERE email = ?", [email])
		.then(([result]) => {
			if (result[0] === null) {
				res.sendStatus(404);
			} else {
				res.status(200).send(result);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

/* VERIFICATION OF THE TEMPORARY CODE */

const getUserCodeTmpById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query("SELECT code_tmp FROM user WHERE id = ?", [id])
		.then(([result]) => {
			if (result[0] === null) {
				res.sendStatus(404);
			} else {
				res.status(200).send(result);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

/* FAVORITES ROUTES (fullname, video_title, category ORDER BY fullname) */
const getFavorites = (req, res) => {
	database
		.query(
			"SELECT u.id AS user_id, CONCAT(u.firstname, ' ', u.lastname) AS fullname, v.title, c.name AS cat FROM user u INNER JOIN favorites f  ON u.id = f.user_id INNER JOIN video v  ON v.id = f.video_fav_id INNER JOIN video_category vc  ON v.id = vc.video_id INNER JOIN category c  ON c.id = vc.category_id ORDER BY user_id;",
		)
		.then(([favorites]) => res.status(200).json(favorites))
		.catch((err) => console.error(err));
};
const getFavoritesByUserId = (req, res) => {
	const id = Number.parseInt(req.params.id_user, 10);

	database
		.query(
			"SELECT v.title, v.url, v.id, v.description, v.display, c.id AS idCat, c.name AS catName FROM user u INNER JOIN favorites f  ON u.id = f.user_id AND u.id = ? INNER JOIN video v ON v.id = f.video_fav_id INNER JOIN video_category vc ON v.id = vc.video_id INNER JOIN category c ON c.id = vc.category_id ORDER BY idCat;",
			[id],
		)
		.then(([userFavourites]) => {
			if (userFavourites[0] != null) {
				res.status(200).json(userFavourites);
			} else {
				res.status(200).send([]);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

/* VIDEOS ROUTES */
const getVideos = (req, res) => {
	database
		.query(
			"SELECT id, url, description, display, title, DATE_FORMAT(date, '%Y-%m-%d') as date FROM video",
		)
		.then(([videos]) => res.status(200).json(videos))
		.catch((err) => console.error(err));
};
const getVideoById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	if (id) {
		database
			.query(
				"SELECT id, url, description, display, title, DATE_FORMAT(date, '%Y-%m-%d') as date FROM video WHERE id = ?",
				[id],
			)
			.then(([video]) => {
				if (video[0] != null) {
					res.status(200).json(video[0]);
				} else {
					res.sendStatus(404);
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send("Error retrieving data from database");
			});
	}
};

const getVideosByCategoryId = (req, res) => {
	const id = Number.parseInt(req.params.idCat, 10);
	if (id) {
		database
			.query(
				"SELECT c.name AS cat, v.title, v.id, v.description, v.display, v.url, year(v.date) AS year FROM video v INNER JOIN video_category vc  ON vc.video_id = v.id INNER JOIN category c  ON vc.category_id = c.id  AND c.id = ? ORDER BY cat;",
				[id],
			)
			.then(([videos]) => {
				res.status(200).json(videos);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send("Error retrieving data from database");
			});
	}
};
const getVideosAndCategoryByVideoId = (req, res) => {
	const id = Number.parseInt(req.params.idVid, 10);
	database
		.query(
			"SELECT c.id AS idCat, v.id AS idVid, c.name AS cat, v.title, v.url, v.description, CONCAT(YEAR(v.date), ' ', MONTHNAME(v.date), ' ', DAY(v.date)) AS date, v.display FROM video v INNER JOIN video_category vc ON vc.video_id = v.id AND v.id = ? INNER JOIN category c ON vc.category_id = c.id;",
			[id],
		)
		.then(([videos]) => {
			// eslint-disable-next-line no-unused-expressions
			videos[0] != null ? res.status(200).json(videos) : res.sendStatus(404);
		})
		.catch(() => {
			res.status(500).send("Error retrieving data from database");
		});
};

/* CATEGORYS ROUTES */
const getCategorys = (req, res) => {
	database
		.query("SELECT * FROM category")
		.then(([category]) => res.status(200).json(category))
		.catch((err) => console.error(err));
};
const getCategoryById = (req, res) => {
	const id = Number.parseInt(req.params.id_cat, 10);

	database
		.query("SELECT * FROM category WHERE id = ?", [id])
		.then(([category]) => {
			if (category[0] != null) {
				res.status(200).json(category[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

/* HERO_SLIDER VIDEOS ROUTES */
const getHeroSliderVideos = (req, res) => {
	database
		.query(
			"SELECT hs.id as hsid,fk_video, v.id, v.title, v.date, v.url, v.display FROM video v INNER JOIN hero_slider hs ON hs.fk_video = v.id;",
		)
		.then(([hsVideos]) => res.status(200).json(hsVideos))
		.catch((err) => console.error(err));
};
const getHeroSliderTable = (req, res) => {
	database
		.query(
			"SELECT hs.id as hsid, v.id, v.title, c.name as cat, v.url FROM video v INNER JOIN hero_slider hs ON hs.fk_video = v.id INNER JOIN video_category vc ON v.id = vc.video_id INNER JOIN category c ON c.id = vc.category_id;",
		)
		.then(([hsVideos]) => res.status(200).json(hsVideos))
		.catch((err) => console.error(err));
};
const getCatNameVideoSliderById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query(
			"SELECT c.name from category as c inner join video_category as vc on c.id=vc.category_id inner join video on video.id=vc.video_id where video_id= ?;",
			[id],
		)
		.then(([hsVideos]) => res.status(200).json(hsVideos))
		.catch((err) => console.error(err));
};

/* FIXTURES_SLIDER VIDEOS ROUTES */

const getFixturesVideos = (req, res) => {
	database
		.query(
			"SELECT * FROM video v INNER JOIN fixtures ON fixtures.fk_fix_video_id = v.id ORDER BY fixtures.id;",
		)
		.then(([hsVideos]) => res.status(200).json(hsVideos))
		.catch((err) => console.error(err));
};

const getDisplayFixtures = (req, res) => {
	database
		.query("SELECT * FROM display_fixtures")
		.then(([result]) => {
			res.status(200).send(result[0]);
		})
		.catch((err) => console.error(err));
};

/* PUBLICITYS ROUTES */
const getPublicities = (req, res) => {
	database
		.query("SELECT * FROM publicity")
		.then(([publicitys]) => res.status(200).json(publicitys))
		.catch((err) => console.error(err));
};
const getPublicitiesById = (req, res) => {
	const id = Number.parseInt(req.params.id_pub, 10);

	database
		.query("SELECT * FROM publicity WHERE id = ?", [id])
		.then(([publicity]) => {
			if (publicity[0] != null) {
				res.status(200).json(publicity[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

/* HOME ROUTES */

const getHome = (req, res) => {
	database
		.query("SELECT * FROM home ORDER BY position;")
		.then(([home]) => res.status(200).json(home))
		.catch((err) => console.error(err));
};
const getHomeById = (req, res) => {
	const id = Number.parseInt(req.params.id_pub, 10);

	database
		.query("SELECT * FROM home WHERE id = ?", [id])
		.then(([home]) => {
			if (home[0] != null) {
				res.status(200).json(home[0]);
			} else {
				res.status(404).send();
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};
const getHomeCategoriesName = (req, res) => {
	database
		.query("SELECT id, name FROM category")
		.then(([category]) => res.status(200).json(category))
		.catch((err) => console.error(err));
};
const getVideosByHomeId = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query(
			"SELECT v.title, v.url, v.description, v.display, v.id FROM video v INNER JOIN video_carousel vc ON vc.video_carousel_id = v.id INNER JOIN home h ON vc.home_id = h.id AND h.id = ? ORDER BY v.id;",
			[Number(id)],
		)
		.then(([videos]) => {
			if (videos[0] != null) {
				res.status(200).json(videos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error retrieving data from database");
		});
};

module.exports = {
	welcome,
	getUsers,
	getUserById,
	getUserByEmail,
	getUserCodeTmpById,
	getFavorites,
	getFavoritesByUserId,
	getVideos,
	getVideoById,
	getVideosByCategoryId,
	getCategorys,
	getCategoryById,
	getHeroSliderVideos,
	getHeroSliderTable,
	getFixturesVideos,
	getDisplayFixtures,
	getPublicities,
	getPublicitiesById,
	getVideosAndCategoryByVideoId,
	getCatNameVideoSliderById,
	getHome,
	getHomeById,
	getHomeCategoriesName,
	getVideosByHomeId,
	getUsersCsv,
};
