const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const trackValidation = require('../../validations/track.validation');
const trackController = require('../../controllers/track.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createTrack'), validate(trackValidation.createTrack), trackController.createTrack)
  .get(validate(trackValidation.getTrack), trackController.getTracks);

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
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *                - password
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                name: fake name
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 */
