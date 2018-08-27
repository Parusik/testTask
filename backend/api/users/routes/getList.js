const HTTPErrors = require('http-custom-errors'),
  usersHandlers = require('../handlers'),
  log = require('../../../tools/logger')(module);

module.exports = async ctx => {
  try {
    ctx.state.result = {
      data: {
        list: await usersHandlers.getList(ctx.params.uId),
        tree: await usersHandlers.getAndPopulate(ctx.params.uId)
      }
    };
  } catch (e) {
    log.error(e);
    throw e;
  }
};
