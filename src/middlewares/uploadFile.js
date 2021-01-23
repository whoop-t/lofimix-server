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
  }).fields([
    {
      name: 'file',
      maxCount: 1,
    },
    {
      name: 'art',
      maxCount: 1,
    },
  ]);

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
  if (file.fieldname === 'file') {
    if (ext !== '.mp3') {
      return cb(new Error('Only mp3 files are allowed'), false);
    }
    cb(null, true);
  }
  if (file.fieldname === 'art') {
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only png, jpg and jpeg files allowed'), false);
    }
    cb(null, true);
  }
};

/**
 * Loop over files (track and cover pic), upload each file to S3 Bucket
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadToAWS = (req, res, next) => {
  for (const file in req.files) {
    console.log(req.files[file][0]);
    fs.readFile(req.files[file][0].path, function (err, filedata) {
      if (!err) {
        const putParams = {
          Bucket: file === 'file' ? config.aws.tracksBucket : config.aws.coversBucket,
          Key: req.files[file][0].filename,
          Body: filedata,
        };
        s3.upload(putParams, async (err, data) => {
          if (err) {
            console.log('Could not upload the file. Error :', err);
            logger.error(err);
            return res.send({ success: false });
          } else {
            fs.unlink(req.files[file][0].path, () => {
              console.log('file deleted');
            }); // Deleting the file from uploads folder
            console.log('Successfully uploaded the file');
            // TODO Adds filekey, coverKey and user to req to save to db, should prob move this. NOT PRETTY
            if (file === 'art') {
              req.body.fileKey = req.files['file'][0].filename;
              req.body.coverKey = req.files['art'][0].filename;
              const user = await userService.getUserById(req.user.id);
              req.body.uploader = { uploaderId: req.user.id, uploaderName: user.displayName };
              next();
            }
          }
        });
      } else {
        console.log({ err: err });
        logger.error(err);
        return res.send({ success: false });
      }
    });
  }
};

/**
 * Gets signed url from s3 bucket for playback
 * @param {*} results
 */
const generateSignedURL = async (fileKey) => {
  return new Promise((resolve, reject) => {
    const url = s3.getSignedUrl(
      'getObject',
      {
        Bucket: config.aws.tracksBucket,
        Key: fileKey,
        Expires: config.aws.urlExpire,
      },
      (err, url) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(url);
      }
    );
  });
};

module.exports = {
  uploadFile,
  generateSignedURL,
};
