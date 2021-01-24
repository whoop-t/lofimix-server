const express = require('express');
const emailController = require('../../controllers/email.controller');
const validate = require('../../middlewares/validate');
const emailValidation = require('../../validations/email.validation');

const router = express.Router();

router.route('/').post(validate(emailValidation.contactUs), emailController.contactUs);

module.exports = router;
