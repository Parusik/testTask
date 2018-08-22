module.exports = {
  server: {
    PORT: 3000
  },

  auth: {
    JWT_SECRET: '<secret>**test**</secret>',
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
    DATABASE: 'test_roles',
    PATH: 'mongodb://user1:password1@ds123852.mlab.com:23852'
  }
};
