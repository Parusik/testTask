module.exports = {
  server: {
    PORT: 3000
  },

  auth: {
    JWT_SECRET: '{SECRET}',
    HASH_ITERATIONS: 1,
    ACCESS_TOKEN_TTL: '7d', // https://github.com/zeit/ms
    REFRESH_TOKEN_TTL: 60
  },

  logger: {
    prod: {
      LOG_INFO: false,
      LOG_ERROR: true
    },
    dev: {}
  },

  mongo: {
    DATABASE: '{DATABASE_NAME}',
    PATH: 'mongodb://{USER_NAME}:{PASSWORD}@{HOST}:27017'
  }
};
