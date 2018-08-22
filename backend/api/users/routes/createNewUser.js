const HTTPErrors = require('http-custom-errors'),
  usersHandlers = require('../handlers'),
  log = require('../../../tools/logger')(module);

module.exports = async ctx => {
  const { username, email, password } = ctx.request.body;
  try {
    ctx.state.result = {
      data: {
        user: await usersHandlers.createNewUser({
          username,
          email,
          password
        })
      },
      code: 201
    };
  } catch (e) {
    log.error(e);
    if (e.code && e.code === 11000) {
      throw HTTPErrors.InternalServerError('User with this email already exist.');
    }
    throw HTTPErrors.InternalServerError(`Unable to create a new user. ${e.message}`);
  }
};
