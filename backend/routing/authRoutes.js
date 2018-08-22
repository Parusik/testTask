const getRouter = require('koa-router'),
  { jwtAuthHandler, localAuthHandler } = require('../tools/auth/passport'),
  { formatJSONResponse } = require('../middlewares/responseFormatters/json');

const authRouter = getRouter();

authRouter.use(formatJSONResponse);
authRouter.get('/', jwtAuthHandler);
authRouter.post('/', localAuthHandler);

module.exports.authRoutes = authRouter.routes();
