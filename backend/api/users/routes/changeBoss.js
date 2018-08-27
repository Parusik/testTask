const HTTPErrors = require('http-custom-errors'),
  usersHandlers = require('../handlers'),
  { User } = require('../../users/model');

module.exports = async ctx => {
  const user = await User.findById(ctx.state.user.id);
  if (!user && user.role === 0) {
    throw new HTTPErrors.InternalServerError('Don`t have permissions!');
  }
  const { subUserId = '', newBossId = '' } = ctx.query;

  if (!subUserId || !newBossId) {
    throw new HTTPErrors.InternalServerError('Bad Params!');
  }

  if (!user.subordinates.map(a => a.toString()).includes(subUserId)) {
    throw new HTTPErrors.InternalServerError('Don`t have permissions!');
  }

  await usersHandlers.changeBoss(user, subUserId, newBossId);

  ctx.state.result = {
    data: 'Boss changed successful'
  };
};
