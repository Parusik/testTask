const Node = require('../model');

module.exports = async id => Node.findById(id);
