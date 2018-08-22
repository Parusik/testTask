const { User } = require('../model');

module.exports = async data => new User(data).save();
