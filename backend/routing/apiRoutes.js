const getRouter = require('koa-router'),
  { formatJSONResponse } = require('../middlewares/responseFormatters/json'),
  { userRoutes } = require('../api/users/router');

const apiRouter = getRouter();

apiRouter.use(formatJSONResponse);
apiRouter.use('/users', userRoutes);

module.exports.apiRoutes = apiRouter.routes();
