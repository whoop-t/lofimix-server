const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

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
      return res.json({ success: false, err: err.message });
    }
    uploadToAWS(req.file.path, req.file.filename, res, next);
    //next();
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

/**
 * Upload file to S3 Bucket
 * @param {*} source
 * @param {*} targetName
 * @param {*} res
 * @param {*} next
 */
const uploadToAWS = (source, targetName, res, next) => {
  console.log('preparing to upload...');
  fs.readFile(source, function (err, filedata) {
    if (!err) {
      const putParams = {
        Bucket: 'lofimix-tracks',
        Key: targetName,
        Body: filedata,
      };
      s3.upload(putParams, function (err, data) {
        if (err) {
          console.log('Could not upload the file. Error :', err);
          return res.send({ success: false });
        } else {
          //fs.unlink(source); // Deleting the file from uploads folder(Optional).Do Whatever you prefer.
          console.log('Successfully uploaded the file');
          next();
        }
      });
    } else {
      console.log({ err: err });
    }
  });
};

//TODO Figure out how to retrieve tracks from S3
// const retrieveTrackForAWS = (filename,res) => {
//   const getParams = {
//     Bucket: 'lofimix-tracks',
//     Key: filename
//   };

//   s3.getObject(getParams, function(err, data) {
//     if (err){
//       return res.status(400).send({success:false,err:err});
//     }
//     else{
//       return res.send(data.Body);
//     }
//   });
// }

module.exports = {
  uploadFile,
};
