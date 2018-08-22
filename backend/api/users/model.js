const mongoose = require('mongoose');
const crypto = require('crypto');
const { auth: authConfigs } = require('../../configs');

const User = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  boss: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nodes',
    default: null
  },
  subordinates: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      }
    ],
    default: []
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: Number,
    default: 0
  },
  passwordHash: String,
  salt: String
});

User.set('toJSON', {
  virtuals: false,
  transform: (doc, ret) =>
    Object.keys(ret)
      .filter(key => !['__v', '_id', 'salt', 'passwordHash'].includes(key))
      .reduce(
        (obj, key) =>
          Object.assign(obj, {
            [key]: ret[key]
          }),
        { id: ret._id.toString() }
      )
});

User.virtual('password')
  .set(function set(password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, authConfigs.HASH_ITERATIONS, 128, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function get() {
    return this._plainPassword;
  });

User.methods.checkPassword = function checkPassword(password) {
  return (
    password &&
    this.passwordHash &&
    crypto.pbkdf2Sync(password, this.salt, authConfigs.HASH_ITERATIONS, 128, 'sha1').toString() === this.passwordHash
  );
};

module.exports.User = mongoose.model('users', User);
