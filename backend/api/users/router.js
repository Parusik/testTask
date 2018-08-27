const getRouter = require('koa-router');
const usersRoutes = require('./routes');
const jwt = require('koa-jwt'),
  { DEVELOPMENT, auth: authConfigs } = require('../../configs');

const userRouter = getRouter();

/* PUBLIC ROUTES */
userRouter.post('/', usersRoutes.createNewUser);
userRouter.get('/:uId', usersRoutes.getList);

/* SECURE ROUTES */
userRouter.use(jwt({ secret: authConfigs.JWT_SECRET, debug: !DEVELOPMENT }));
userRouter.put('/:uId/changeBoss', usersRoutes.changeBoss);

module.exports.userRoutes = userRouter.routes();
