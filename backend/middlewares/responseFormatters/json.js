const HTTPErrors = require('http-custom-errors');

module.exports.formatJSONResponse = async (ctx, next) => {
  try {
    await next();
    const { code = 200, data = null } = ctx.state.result || {};
    ctx.status = code;
    ctx.body = JSON.stringify({ data, status: data ? 'OK' : 'No Content' }, null, 2);
    ctx.type = 'application/json';
  } catch (err) {
    if (err instanceof HTTPErrors.HTTPError) {
      ctx.status = err.code || 500;
      ctx.body = { data: null, status: err.status || 'Error', msg: err.message || '' };
      ctx.type = 'application/json';
    } else if (err.status === 401) {
      const error = new HTTPErrors.UnauthorizedError(err.message);
      ctx.status = 401;
      ctx.body = { data: null, status: error.status || 'Error', msg: error.message || '' };
      ctx.type = 'application/json';
    } else ctx.throw(500, err);
  }
};
