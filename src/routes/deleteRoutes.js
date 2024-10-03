const express = require("express");

const deleteRoutesFunctions = require("../handlers/deleteRoutesFunctions");

const router = express.Router();

router.delete("/users/:id", deleteRoutesFunctions.deleteUserById);
router.delete("/users/avatars/:id", deleteRoutesFunctions.deleteAvatarByUserId);
router.delete("/videos/:id", deleteRoutesFunctions.deleteVideoById);
router.delete("/categories/:id", deleteRoutesFunctions.deleteCategoryById);
router.delete(
	"/videos/cat/:idVid/:idCat",
	deleteRoutesFunctions.deleteVideoByIdFromCat,
);
router.delete("/hero_slider/:id", deleteRoutesFunctions.deleteHeroSliderById);
router.delete("/fixtures/:id", deleteRoutesFunctions.deleteFixturesById);
router.delete("/publicities/:id", deleteRoutesFunctions.deletePublicityById);
router.delete("/home/:id", deleteRoutesFunctions.deleteHomeById);
router.delete("/favorites/:id", deleteRoutesFunctions.deleteVideoFromFavorite);

module.exports = router;
