const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Upload file middleware
 */
// TODO needs error checking and verification or something
const uploadFile = (req, res, next) => {
  // SET STORAGE
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now());
    },
    limits: {
      fileSize: 25000000,
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
  }).single('file');

  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err: err.message });
    }
    next();
  });
};

const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  console.log(ext);
  if (ext !== '.mp3') {
    return cb(new Error('Only mp3 files are allowed'), false);
  }
  cb(null, true);
};

module.exports = {
  uploadFile,
};
