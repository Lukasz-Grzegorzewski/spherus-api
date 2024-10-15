const express = require("express");

const router = express.Router();
const { verifyToken } = require("../handlers/auth");

const getRoutesFunctions = require("../handlers/getRoutesFunctions");
/* router */
router.get("/", getRoutesFunctions.welcome);

/* users */
router.get("/users", getRoutesFunctions.getUsers);
router.get("/users/:id", getRoutesFunctions.getUserById);
router.get("/csv", getRoutesFunctions.getUsersCsv);
router.get("/email/users/:email", getRoutesFunctions.getUserByEmail);

/* route that verify the temporary code */
router.get("/users/code/:id", getRoutesFunctions.getUserCodeTmpById);

/* favorites */
router.get("/favorites", getRoutesFunctions.getFavorites);
router.get("/favorites/:id_user", getRoutesFunctions.getFavoritesByUserId);

/* videos */
router.get("/videos", getRoutesFunctions.getVideos);
router.get("/videos/:id", getRoutesFunctions.getVideoById);
router.get(
	"/videos/categories/:idCat",
	getRoutesFunctions.getVideosByCategoryId,
);
router.get(
	"/videos/cat/:idVid",
	getRoutesFunctions.getVideosAndCategoryByVideoId,
);
// router.get("/videos/last/:url", getRoutesFunctions.getLastVideos);

/* categories */
router.get("/categories", getRoutesFunctions.getCategorys);
router.get("/categories/:id_cat", getRoutesFunctions.getCategoryById);

// HeroSlider Component
router.get("/hero_slider", getRoutesFunctions.getHeroSliderVideos);
router.get("/hero_slider/table", getRoutesFunctions.getHeroSliderTable);
router.get(
	"/hero_slider/catname/:id",
	getRoutesFunctions.getCatNameVideoSliderById,
);

// Fixtures Component
router.get("/fixtures", getRoutesFunctions.getFixturesVideos);
router.get("/display_fixtures", getRoutesFunctions.getDisplayFixtures);

// Advert
router.get("/publicities/", getRoutesFunctions.getPublicities);
router.get("/publicities/:id_pub", getRoutesFunctions.getPublicitiesById);

// Home
router.get("/home", getRoutesFunctions.getHome);
router.get("/home/:id", getRoutesFunctions.getHomeById);
router.get("/home/category/name/", getRoutesFunctions.getHomeCategoriesName);
router.get("/home/carousel/:id", getRoutesFunctions.getVideosByHomeId);

// CSV
const getCsvFunctions = require("./csv/csv");

router.get("/export", getCsvFunctions.getCsv);

module.exports = router;
