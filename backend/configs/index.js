const config = require('../../configuration/config'),
  path = require('path');

module.exports = {
  server: config.server,
  auth: config.auth,
  mongo: config.mongo,
  logger: config.logger,
  DEVELOPMENT: process.env.NODE_ENV !== 'production',
  PROJECT_ROOT: config.PROJECT_ROOT || path.resolve()
};
