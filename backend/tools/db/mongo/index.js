const mongoose = require('mongoose'),
  util = require('util'),
  { DEVELOPMENT, mongo: mongoConfigs } = require('../../../configs');

const log = require('../../logger/index')(module),
  mongoURI = `${mongoConfigs.PATH}/${mongoConfigs.DATABASE}`;

mongoose.Promise = global.Promise;

if (DEVELOPMENT) {
  // mongoose.set('debug', (collectionName, method, query, doc) => {
  //   log.debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  // });
}

exports.connect = () =>
  mongoose
    .connect(mongoURI, { autoIndex: false })
    .then(() => log.info(`Connected to MongoDB: ${mongoURI}`))
    .catch(err => {
      log.error(`Unable to connect to MongoDB: ${mongoURI}`);
      return Promise.reject(err);
    });
