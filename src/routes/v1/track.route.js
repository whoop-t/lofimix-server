const express = require('express');
const auth = require('../../middlewares/auth');
const { uploadFile } = require('../../middlewares/uploadFile');
const validate = require('../../middlewares/validate');
const trackValidation = require('../../validations/track.validation');
const trackController = require('../../controllers/track.controller');

const router = express.Router();
//TODO Remove filePath being submitted from client and add path to req after file is saved to to location
router
  .route('/')
  .post(auth('createTrack'), uploadFile, validate(trackValidation.createTrack), trackController.createTrack)
  .get(validate(trackValidation.getTrack), trackController.getTracks);
router.route('/play').get(trackController.playTrack);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Track
 *   description: Track management and retrieval
 */

/**
 * @swagger
 * path:
 *  /track:
 *    post:
 *      summary: Create a Track
 *      description: Only registered users can upload tracks
 *      tags: [Track]
 *      requestBody:
 *        required: true
 *        content:
 *          form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file(mp3)
 *                - uploader
 *                - title
 *                - description
 *                - tags
 *              properties:
 *                uploader:
 *                  type: string
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                tags:
 *                  type: string
 *              example:
 *                file: sound.mp3
 *                title: Lofi Summer
 *                uploader: 12123414fsdfsfdsfs
 *                description: A great song
 *                tags: lofi;hiphop;retro
 */

/**
 * @swagger
 * path:
 *  /track:
 *    get:
 *      summary: Get tracks
 *      description: Get tracks, can use filters
 *      tags: [Track]
 */
