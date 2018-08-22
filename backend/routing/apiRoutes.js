const getRouter = require('koa-router'),
  jwt = require('koa-jwt'),
  { DEVELOPMENT, auth: authConfigs } = require('../configs'),
  { formatJSONResponse } = require('../middlewares/responseFormatters/json'),
  { userRoutes } = require('../api/users/router');

const apiRouter = getRouter();

apiRouter.use(formatJSONResponse);
// apiRouter.use(jwt({ secret: authConfigs.JWT_SECRET, debug: !DEVELOPMENT }));
apiRouter.use('/users', userRoutes);

module.exports.apiRoutes = apiRouter.routes();
