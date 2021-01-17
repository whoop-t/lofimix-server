const express = require('express');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router.route('/').get(profileController.getProfile);

module.exports = router;
