const express = require('express');
const profileController = require('../../controllers/profile.controller');
const auth = require('../../middlewares/auth');
const { uploadAvatar } = require('../../middlewares/uploadFile');

const router = express.Router();

router.route('/').get(profileController.getProfile).put(auth('createTrack'), uploadAvatar, profileController.editProfile);

module.exports = router;
