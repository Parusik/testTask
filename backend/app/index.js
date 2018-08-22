const Koa = require('koa'),
  bodyParser = require('koa-bodyparser'),
  logger = require('koa-logger-middleware'),
  responseTime = require('koa-response-time'),
  router = require('../routing'),
  cors = require('kcors'),
  log = require('../tools/logger')(module);

const app = new Koa();

app
  .use(responseTime())
  .use(logger(log))
  .use(cors())
  .use(bodyParser())
  .use(router.allowedMethods())
  .use(router.routes())
  .on('error', err => log.error('Error occurred:', err.message));

module.exports.app = app;
