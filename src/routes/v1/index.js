const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const trackRoute = require('./track.route');
const profileRoute = require('./profile.route');
const favoritesRoute = require('./favorites.route');
const emailRoute = require('./email.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/tracks',
    route: trackRoute,
  },
  {
    path: '/profiles',
    route: profileRoute,
  },
  {
    path: '/favorites',
    route: favoritesRoute,
  },
  {
    path: '/email',
    route: emailRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
