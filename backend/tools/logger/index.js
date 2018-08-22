const winston = require('winston'),
  { DEVELOPMENT, PROJECT_ROOT, logger } = require('../../configs');

const projectRoot = PROJECT_ROOT,
  getConsoleTransport = label =>
    new winston.transports.Console({
      name: 'console',
      level: process.env.NODE_ENV === 'test' ? 'error' : 'debug',
      colorize: 'all',
      label
    }),
  getFileTransports = function* getFileTransports(label) {
    if (logger.prod.LOG_ERROR) {
      yield new winston.transports.File({
        name: 'error',
        level: 'error',
        label,
        filename: `${projectRoot}/logs/error.log`
      });
    }
    if (logger.prod.LOG_INFO) {
      yield new winston.transports.File({
        name: 'info',
        level: 'info',
        label,
        filename: `${projectRoot}/logs/info.log`
      });
    }
  };

module.exports = module => {
  const label = module.filename.replace(`${projectRoot}/`, '');
  return new winston.Logger({
    name: 'default',
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    },
    colors: {
      warn: 'yellow',
      info: 'cyan'
    },
    transports: DEVELOPMENT ? [getConsoleTransport(label)] : [...getFileTransports(label)]
  });
};
