const getRouter = require('koa-router');
const usersRoutes = require('./routes');

const userRouter = getRouter();

userRouter.post('/', usersRoutes.createNewUser);
userRouter.get('/:uId/getList', usersRoutes.getList);

module.exports.userRoutes = userRouter.routes();
