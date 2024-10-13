const fs = require("node:fs");
const database = require("../database");

const deleteUserById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);

	database
		.query("DELETE FROM user WHERE id = ?", [id])
		.then(([user]) => {
			return user.affectedRows === 0
				? res.status(404).send("Not Found")
				: res.sendStatus(204);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting user");
		});
};

const deleteAvatarByUserId = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);

	database
		.query("SELECT url FROM user WHERE id = ?", [id])
		.then(([url]) => {
			const urlAvatar = url[0].url;
			if (urlAvatar === null)
				res.status(404).send({ message: "url NOT FOUND" });

			database
				.query("Update user SET url = NULL WHERE id = ?", [id])
				.then(() => {
					try {
						if (fs.existsSync(`public/${urlAvatar}`)) {
							fs.unlink(`public/${urlAvatar}`, (err) => {
								if (err) {
									console.error(err);
								}
							});
							res.sendStatus(204);
						} else {
							console.warn("file doesn't exists!");
						}
					} catch (err) {
						console.error(err);
					}
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send("Error deleting user");
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error getting user's url");
		});
};

const deleteVideoById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query("DELETE FROM favorites WHERE video_fav_id = ?", [id])
		.then(() => {
			database
				.query("DELETE FROM hero_slider WHERE fk_video = ?", [id])
				.then(() => {
					database
						.query("DELETE FROM fixtures WHERE fk_fix_video_id = ?", [id])
						.then(() => {
							database
								.query(
									"DELETE FROM video_carousel WHERE video_carousel_id = ?",
									[id],
								)
								.then(() => {
									database
										.query("SELECT url FROM video WHERE id = ?", [id])
										.then(([[url]]) => {
											database
												.query(
													"DELETE FROM video_category WHERE video_id = ?",
													[id],
												)
												.then(() => {
													database
														.query("DELETE FROM video WHERE id = ?", [id])
														.then(([video]) => {
															if (video.affectedRows !== 0) {
																const path = `/${url.url}`;
																fs.unlink(`public${path}`, (err) => {
																	if (err) {
																		console.error(err);
																	}
																});
																res.sendStatus(204);
															} else {
																res.status(404).send("Video Not Found");
															}
														})
														.catch((err) => {
															console.error(err);
															res.status(500).send("Error deleting a video");
														});
												})
												.catch((err) => {
													console.error(err);
													res
														.status(500)
														.send("Error deleting from video_category");
												});
										})
										.catch((err) => {
											console.error(err);
											res.status(500).send("Error finding url of a video");
										});
								})
								.catch((err) => {
									console.error(err);
									res.status(500).send("Error deleting from video_carousel");
								});
						})
						.catch((err) => {
							console.error(err);
							res
								.status(500)
								.send("Error deleting a video_category attachment");
						});
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send("Error deleting a hero_slider ");
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting from favorites ");
		});
};

const deleteVideoByIdFromCat = (req, res) => {
	const idVid = Number.parseInt(req.params.idVid, 10);
	const { idCat } = req.params;

	database
		.query(
			"DELETE FROM video_category WHERE video_id = ? AND category_id = ?",
			[idVid, idCat],
		)
		.then(([videoCategory]) => {
			return videoCategory.affectedRows === 0
				? res.status(404).send("Not Found")
				: res.status(204).send("video_category attachment deleted");
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting a video_category attachment");
		});
};

const deleteCategoryById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	if (id)
		database
			.query("DELETE FROM home WHERE type = 1 AND idLink = ?", [id])
			.then(() => {
				database
					.query("DELETE FROM video_category WHERE category_id = ?", [id])
					.then(() => {
						database
							.query("DELETE FROM category WHERE id = ?", [id])
							.then(([category]) => {
								return category.affectedRows === 0
									? res.status(404).send("Category Not Found")
									: res.sendStatus(204);
							})

							.catch((err) => {
								console.error(err);
								res.status(500).send("Error deleting a category");
							});
					})

					.catch((err) => {
						console.error(err);
						res.status(500).send("Error deleting a video_category attachment");
					});
			});
};

// HERO SLIDER
const deleteHeroSliderById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);

	database
		.query("DELETE FROM hero_slider WHERE id = ?", [id])
		.then(([hero]) => {
			return hero.affectedRows === 0
				? res.status(404).send("Not Found")
				: res.sendStatus(204);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting a video in Hero Slider");
		});
};

// FIXTURES

const deleteFixturesById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query("DELETE FROM fixtures WHERE id = ?", [id])
		.then(([fix]) => {
			return fix.affectedRows === 0
				? res.status(404).send("File not found")
				: res.sendStatus(204);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting a video in Fixture Slider");
		});
};

// ADVERTISING
const deletePublicityById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query("DELETE FROM home WHERE type = 2 AND idLink = ?", [id])
		.then(() => {
			database
				.query("SELECT url_image ui FROM publicity WHERE id = ?", [id])
				.then(([[ui]]) => {
					database
						.query("DELETE FROM publicity WHERE id = ?", [id])
						.then(([pub]) => {
							const path = `/${ui.ui}`;
							fs.unlink(`public${path}`, (err) => {
								if (err) {
									console.error(err);
								}

								return pub.affectedRows === 0
									? res.status(404).send("Not Found")
									: res.sendStatus(204);
							});
						})
						.catch((err) => {
							console.error(err);
							res.status(500).send("Error deleting a advert");
						});
				});
		});
};

// HOME PAGE
const deleteHomeById = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);

	database
		.query("DELETE FROM video_carousel WHERE home_id = ?", [id])
		.then(() => {
			database
				.query("DELETE FROM home WHERE id = ?", [id])
				.then(([home]) => {
					return home.affectedRows === 0
						? res.status(404).send("Not Found")
						: res.sendStatus(204);
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send("Error deleting the component in the Home");
				});
		});
};

// Favorite

const deleteVideoFromFavorite = (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	database
		.query("DELETE FROM favorites WHERE video_fav_id = ?", [id])
		.then(([favorite]) => {
			return favorite.affectedRows === 0
				? res.status(404).send("Not Found")
				: res.sendStatus(204);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error deleting favorite");
		});
};

module.exports = {
	deleteUserById,
	deleteAvatarByUserId,
	deleteVideoById,
	deleteCategoryById,
	deleteHeroSliderById,
	deleteFixturesById,
	deletePublicityById,
	deleteVideoByIdFromCat,
	deleteHomeById,
	deleteVideoFromFavorite,
};
