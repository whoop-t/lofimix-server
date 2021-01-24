const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const moment = require('moment');
const { addImageSignedUrl } = require('../middlewares/uploadFile');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .status(httpStatus.CREATED)
    .cookie('refresh_token', tokens.refresh.token, {
      path: '/', // TODO scope path to only getting access tokens
      httpOnly: true,
      expires: tokens.refresh.expires, // cookie will be removed after 30 days
    })
    .send({ user, access_token: tokens.access });
});

const login = catchAsync(async (req, res) => {
  const { email, password, remember } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // Take uploads and favs on the user doc and find corresponding images in s3
  const uploadsWithURLPromises = addImageSignedUrl(user.uploads);
  const favsWithURLPromises = addImageSignedUrl(user.favorites);
  user['uploads'] = await Promise.all(uploadsWithURLPromises);
  user['favorites'] = await Promise.all(favsWithURLPromises);
  // end
  const tokens = await tokenService.generateAuthTokens(user);
  if (remember) {
    res.cookie('remember', 'yes', { expires: moment().add(10, 'years').toDate(), httpOnly: true });
  }
  res
    .cookie('refresh_token', tokens.refresh.token, {
      path: '/', // TODO scope path to only getting access tokens
      httpOnly: true,
      expires: tokens.refresh.expires, // cookie will be removed after 30 days
    })
    .send({ user, access_token: tokens.access });
});

const logout = catchAsync(async (req, res) => {
  const { refresh_token } = req.cookies;
  res.clearCookie('refresh_token');
  res.clearCookie('remember');
  await authService.logout(refresh_token);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refresh_token } = req.cookies;
  const tokens = await authService.refreshAuth(refresh_token);
  res
    .cookie('refresh_token', tokens.refresh.token, {
      path: '/', // TODO scope path to only getting access tokens
      httpOnly: true,
      expires: tokens.refresh.expires, // cookie will be removed after 30 days
    })
    .send({ access_token: tokens.access });
});

const refreshTokensRemember = catchAsync(async (req, res) => {
  const { refresh_token, remember } = req.cookies;
  if (remember) {
    const { user, tokens } = await authService.refreshAuth(refresh_token);

    // Take uploads and favs on the user doc and find corresponding images in s3
    const uploadsWithURLPromises = addImageSignedUrl(user.uploads);
    const favsWithURLPromises = addImageSignedUrl(user.favorites);
    user['uploads'] = await Promise.all(uploadsWithURLPromises);
    user['favorites'] = await Promise.all(favsWithURLPromises);
    // end
    res
      .cookie('refresh_token', tokens.refresh.token, {
        path: '/', // TODO scope path to only getting access tokens
        httpOnly: true,
        expires: tokens.refresh.expires, // cookie will be removed after 30 days
      })
      .send({ user, access_token: tokens.access });
  } else {
    res.clearCookie('refresh_token');
    res.status(httpStatus.NO_CONTENT).send();
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  refreshTokensRemember,
};
