const passport = require('koa-passport'),
  HTTPErrors = require('http-custom-errors'),
  jwt = require('jsonwebtoken'),
  { promisify } = require('bluebird'),
  { Strategy: LocalStrategy } = require('passport-local'),
  { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
  { User } = require('../../api/users/model'),
  { auth: authConfigs } = require('../../configs');

const signAsync = promisify(jwt.sign, jwt),
  jwtPassportOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authConfigs.JWT_SECRET,
    jsonWebTokenOptions: {
      maxAge: authConfigs.ACCESS_TOKEN_TTL
    }
  },
  accessTokenOpts = {
    expiresIn: authConfigs.ACCESS_TOKEN_TTL
  };

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    (email, password, done) =>
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user || !user.checkPassword(password)) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      })
  )
);

passport.use(
  new JwtStrategy(jwtPassportOptions, (payload, done) =>
    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user || false);
    })
  )
);

const localAuthHandler = (ctx, next) =>
  passport.authenticate('local', async (err, user, info) => {
    if (user === false) {
      throw new HTTPErrors.UnauthorizedError(info.message);
    } else {
      try {
        const accessTokenPayload = { id: user.id };
        ctx.state.result = {
          data: {
            user,
            at: `Bearer ${await signAsync(accessTokenPayload, authConfigs.JWT_SECRET, accessTokenOpts)}`
          }
        };
      } catch (e) {
        throw new HTTPErrors.UnauthorizedError('Unable to authorize.');
      }
    }
  })(ctx, next);

const jwtAuthHandler = (ctx, next) =>
  passport.authenticate('jwt', async (err, user) => {
    if (err || user === false) {
      throw new HTTPErrors.UnauthorizedError();
    } else {
      try {
        ctx.state.result = {
          data: {
            user
          }
        };
      } catch (e) {
        throw new HTTPErrors.UnauthorizedError('Unable to authorize.');
      }
    }
  })(ctx, next);

module.exports = {
  passport,
  jwtAuthHandler,
  localAuthHandler
};
