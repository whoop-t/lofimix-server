const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { userService } = require('../services');

/**
 * AWS Setup
 */
AWS.config.update({
  accessKeyId: config.aws.access,
  secretAccessKey: config.aws.secret,
  region: 'us-west-1',
});

const s3 = new AWS.S3();

/**
 * Multer Setup
 */
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
  limits: {
    fileSize: 25000000,
  },
});

/**
 * Upload file middleware
 */
// TODO needs error checking and verification or something
const uploadFile = (req, res, next) => {
  const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
  }).single('file');

  upload(req, res, (err) => {
    if (err) {
      logger.error(err);
      return res.json({ success: false, err: err.message });
    }
    uploadToAWS(req, res, next);
    //next();
  });
};

/**
 * Only allow mp3 file uploads with Multer
 * @param {*} req
 * @param {*} file
 * @param {*} cb
 */
const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  console.log(ext);
  if (ext !== '.mp3') {
    return cb(new Error('Only mp3 files are allowed'), false);
  }
  cb(null, true);
};

/**
 * Upload file to S3 Bucket
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadToAWS = (req, res, next) => {
  console.log('preparing to upload...');
  fs.readFile(req.file.path, function (err, filedata) {
    if (!err) {
      const putParams = {
        Bucket: config.aws.tracksBucket,
        Key: req.file.filename,
        Body: filedata,
      };
      s3.upload(putParams, async (err, data) => {
        if (err) {
          console.log('Could not upload the file. Error :', err);
          logger.error(err);
          return res.send({ success: false });
        } else {
          fs.unlink(req.file.path, () => {
            console.log('file deleted');
          }); // Deleting the file from uploads folder
          console.log('Successfully uploaded the file');
          // TODO Adds filekey and user to req to save to db, should prob move this
          req.body.fileKey = req.file.filename;
          const user = await userService.getUserById(req.user.id);
          req.body.uploader = { uploaderId: req.user.id, uploaderName: user.displayName };
          next();
        }
      });
    } else {
      console.log({ err: err });
      logger.error(err);
      return res.send({ success: false });
    }
  });
};

/**
 * Gets signed url from s3 bucket for playback
 * @param {*} results
 */
const generateSignedURL = async (results) => {
  return new Promise((resolve, reject) => {
    const resultsWithURLs = [];
    results.results.forEach((track) => {
      const url = s3.getSignedUrl(
        'getObject',
        {
          Bucket: config.aws.tracksBucket,
          Key: track.fileKey,
          Expires: config.aws.urlExpire,
        },
        (err, url) => {
          if (err) {
            logger.error(err);
            reject(err);
          }
          track['signedURL'] = url;
          resultsWithURLs.push(track);
          resolve(resultsWithURLs);
        }
      );
    });
  });
};

module.exports = {
  uploadFile,
  generateSignedURL,
};
