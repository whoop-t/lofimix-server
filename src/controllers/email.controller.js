const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { emailService } = require('../services');

const contactUs = catchAsync(async (req, res) => {
  console.log(req.body);
  const { email, subject, message } = req.body;
  await emailService.sendContactUsEmail({ from: email, to: null, subject, text: message });
  res.send({ message: 'Thank you for reaching out, we will contact you asap' });
});

module.exports = {
  contactUs,
};
