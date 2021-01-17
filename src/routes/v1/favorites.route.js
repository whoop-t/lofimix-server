const express = require('express');
const auth = require('../../middlewares/auth');
const favoriteController = require('../../controllers/favorite.controller');

const router = express.Router();

router.route('/').post(auth('saveFavorites'), favoriteController.saveFavorite).get(favoriteController.getFavorites);

module.exports = router;
