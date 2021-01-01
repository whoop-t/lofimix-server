# Lofimix Server

Node/Mongo api

Install dependencies, create .env and create proper variables

npm run dev

# API Endpoints

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

**Track routes**:\
`POST /v1/tracks` - create a track\
`GET /v1/tracks` - get all tracks

**Swagger route(auto generated api documentation)**:\
`GET /v1/docs` - Swagger page with all api information\

# Jumpstart help from node boilerplate

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)

## License

[MIT](LICENSE)
